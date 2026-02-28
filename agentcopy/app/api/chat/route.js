import Anthropic from '@anthropic-ai/sdk';
import { getSessionUserId } from '@/lib/auth';
import { getUserById, deductCredit, saveGeneration } from '@/lib/db';
import { getPrompt } from '@/lib/prompts';
import { checkRateLimit } from '@/lib/ratelimit';
import {
  VALID_WORKFLOW_IDS,
  MAX_MESSAGE_LENGTH,
  MAX_MESSAGES_PER_REQUEST,
  CLAUDE_MODEL,
  CLAUDE_MAX_TOKENS,
} from '@/lib/config';

export async function POST(request) {
  // 1. Auth
  const userId = await getSessionUserId();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Rate limiting
  const rateLimit = checkRateLimit(userId);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: `Too many requests. Please wait ${rateLimit.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } }
    );
  }

  // 3. Parse + validate input
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { workflowId, messages } = body;

  if (!workflowId || !VALID_WORKFLOW_IDS.has(workflowId)) {
    return Response.json({ error: 'Invalid workflow' }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'Messages are required' }, { status: 400 });
  }

  if (messages.length > MAX_MESSAGES_PER_REQUEST) {
    return Response.json({ error: 'Too many messages in request' }, { status: 400 });
  }

  // Validate and sanitise messages
  const validRoles = new Set(['user', 'assistant']);
  const sanitisedMessages = [];
  for (const msg of messages) {
    if (!msg || typeof msg.content !== 'string' || !validRoles.has(msg.role)) {
      return Response.json({ error: 'Invalid message format' }, { status: 400 });
    }
    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return Response.json({ error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` }, { status: 400 });
    }
    sanitisedMessages.push({ role: msg.role, content: msg.content.trim() });
  }

  // 4. Check credits (pre-flight, non-atomic — atomic deduction happens below)
  const user = await getUserById(userId);
  if (!user || user.credits <= 0) {
    return Response.json(
      { error: 'NO_CREDITS', message: 'No credits remaining. Please purchase more to continue.' },
      { status: 402 }
    );
  }

  // 5. Call Claude — deduct ONLY on success
  const systemPrompt = getPrompt(workflowId);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const encoder = new TextEncoder();
  let fullOutput = '';

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = await client.messages.create({
          model: CLAUDE_MODEL,
          max_tokens: CLAUDE_MAX_TOKENS,
          system: systemPrompt,
          stream: true,
          messages: sanitisedMessages,
        });

        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            fullOutput += event.delta.text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }

        // 6. Deduct credit atomically — only after successful Claude response
        const remainingCredits = await deductCredit(userId);

        if (remainingCredits === null) {
          // Edge case: credits hit 0 between check and deduction — safe to ignore,
          // we already delivered the response. Next request will be blocked.
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ credits: 0 })}\n\n`));
        } else {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ credits: remainingCredits })}\n\n`));
        }

        // 7. Save generation to history (fire-and-forget — don't block the stream)
        if (fullOutput) {
          saveGeneration(userId, workflowId, sanitisedMessages, fullOutput).catch(
            err => console.error('Failed to save generation:', err)
          );
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        console.error('Stream error:', error);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'Something went wrong. Your credit has not been charged.' })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
