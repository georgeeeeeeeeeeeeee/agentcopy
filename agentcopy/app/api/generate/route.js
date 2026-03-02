import Anthropic from '@anthropic-ai/sdk';
import { getSessionUserId } from '@/lib/auth';
import { getUserById, deductCredit, saveGeneration } from '@/lib/db';
import { getWizardSystemPrompt } from '@/lib/prompts';
import { buildGenerationPrompt } from '@/lib/wizard-questions';
import { checkRateLimit } from '@/lib/ratelimit';
import { CLAUDE_MODEL, CLAUDE_MAX_TOKENS } from '@/lib/config';

const VALID_TRACKS = new Set(['residential', 'commercial']);
const MAX_FIELD_LENGTH = 2000;

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

  const { track, formData } = body;

  if (!track || !VALID_TRACKS.has(track)) {
    return Response.json({ error: 'Invalid track' }, { status: 400 });
  }

  if (!formData || typeof formData !== 'object') {
    return Response.json({ error: 'formData is required' }, { status: 400 });
  }

  // Validate field lengths
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string' && value.length > MAX_FIELD_LENGTH) {
      return Response.json(
        { error: `Field "${key}" exceeds maximum length of ${MAX_FIELD_LENGTH} characters` },
        { status: 400 }
      );
    }
  }

  // 4. Credit pre-flight
  const user = await getUserById(userId);
  if (!user || user.credits <= 0) {
    return Response.json(
      { error: 'NO_CREDITS', message: 'No credits remaining. Please purchase more to continue.' },
      { status: 402 }
    );
  }
  if (user.credits < 1) {
    return Response.json(
      { error: 'INSUFFICIENT_CREDITS', message: 'This requires 1 credit. Please top up to continue.' },
      { status: 402 }
    );
  }

  // 5. Build prompts
  const systemPrompt = getWizardSystemPrompt(track);
  const userPrompt = buildGenerationPrompt(track, formData);

  // 6. Call Claude (non-streaming)
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let outputText;
  try {
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: CLAUDE_MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });
    outputText = response.content[0]?.text || '';
  } catch (error) {
    console.error('Claude API error:', error);
    return Response.json({ error: 'Failed to generate listing. Please try again.' }, { status: 502 });
  }

  // 7. Deduct credit after success
  const remainingCredits = await deductCredit(userId, 1);

  // 8. Save generation (fire-and-forget)
  const wizardWorkflowId = `wizard-${track}`;
  if (outputText) {
    saveGeneration(userId, wizardWorkflowId, [{ role: 'user', content: userPrompt }], outputText).catch(
      (err) => console.error('Failed to save generation:', err)
    );
  }

  return Response.json({
    text: outputText,
    credits: remainingCredits ?? 0,
  });
}
