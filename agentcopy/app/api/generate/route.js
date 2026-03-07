import Anthropic from '@anthropic-ai/sdk';
import { getSessionUserId } from '@/lib/auth';
import { getUserById, deductCredit, saveGeneration } from '@/lib/db';
import { getWizardSystemPrompt } from '@/lib/prompts';
import { buildGenerationPrompt } from '@/lib/wizard-questions';
import { checkRateLimit } from '@/lib/ratelimit';
import { pushToRealestateNZ } from '@/lib/syndication';
import {
  CLAUDE_MODEL,
  CLAUDE_MAX_TOKENS,
  OUTPUT_CHANNEL_BASE_CREDIT,
  OUTPUT_CHANNEL_EXTRA_CREDIT,
} from '@/lib/config';

const VALID_TRACKS = new Set(['residential', 'commercial']);
const MAX_FIELD_LENGTH = 2000;

/**
 * Calculate credit cost based on selected output channels.
 * 1.0 credit for the first channel, +0.5 for each additional.
 */
function calcChannelCost(formData) {
  const channels = Array.isArray(formData?.outputChannels) ? formData.outputChannels : [];
  const count = Math.max(channels.length, 1);
  if (count === 1) return OUTPUT_CHANNEL_BASE_CREDIT;
  return OUTPUT_CHANNEL_BASE_CREDIT + (count - 1) * OUTPUT_CHANNEL_EXTRA_CREDIT;
}

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

  // Validate field lengths (scalar fields only; address objects and arrays are handled separately)
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string' && value.length > MAX_FIELD_LENGTH) {
      return Response.json(
        { error: `Field "${key}" exceeds maximum length of ${MAX_FIELD_LENGTH} characters` },
        { status: 400 }
      );
    }
  }

  // Validate outputChannels
  const outputChannels = Array.isArray(formData.outputChannels) ? formData.outputChannels : [];
  const VALID_CHANNELS = new Set(['Open2view', 'Company Website', 'Newspaper']);
  for (const ch of outputChannels) {
    if (!VALID_CHANNELS.has(ch)) {
      return Response.json({ error: `Invalid output channel: "${ch}"` }, { status: 400 });
    }
  }

  // 4. Credit pre-flight
  const GENERATION_COST = calcChannelCost(formData);
  const user = await getUserById(userId);
  if (!user || user.credits === 0) {
    return Response.json(
      { error: 'NO_CREDITS', message: 'No credits remaining. Please purchase more to continue.' },
      { status: 402 }
    );
  }
  if (Number(user.credits) < GENERATION_COST) {
    return Response.json(
      {
        error: 'INSUFFICIENT_CREDITS',
        message: `This generation costs ${GENERATION_COST} credit${GENERATION_COST !== 1 ? 's' : ''}. You have ${user.credits} — please top up to continue.`,
      },
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

  // 7. Deduct credits after success
  const remainingCredits = await deductCredit(userId, GENERATION_COST);

  // 8. Save generation (fire-and-forget)
  const wizardWorkflowId = `wizard-${track}`;
  let savedGeneration = null;
  if (outputText) {
    savedGeneration = await saveGeneration(
      userId,
      wizardWorkflowId,
      [{ role: 'user', content: userPrompt }],
      outputText,
      { track, formData }
    ).catch((err) => {
      console.error('Failed to save generation:', err);
      return null;
    });
  }

  // 9. Syndication: push to Realestate.co.nz if "Company Website" channel selected (fire-and-forget)
  if (outputChannels.includes('Company Website') && outputText) {
    pushToRealestateNZ({
      formData,
      outputText,
      listingId: savedGeneration?.id ?? `tmp-${Date.now()}`,
    });
  }

  return Response.json({
    text: outputText,
    credits: remainingCredits ?? 0,
    channelCost: GENERATION_COST,
  });
}
