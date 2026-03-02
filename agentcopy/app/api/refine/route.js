import Anthropic from '@anthropic-ai/sdk';
import { getSessionUserId } from '@/lib/auth';
import { getUserById, deductCredit } from '@/lib/db';
import { getWizardSystemPrompt } from '@/lib/prompts';
import { buildGenerationPrompt } from '@/lib/wizard-questions';
import { checkRateLimit } from '@/lib/ratelimit';
import { CLAUDE_MODEL, CLAUDE_MAX_TOKENS, REFINE_CREDIT_COST } from '@/lib/config';

const VALID_TRACKS = new Set(['residential', 'commercial']);
const VALID_DIRECTIONS = new Set(['lengthen', 'shorten']);

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

  const { direction, currentText, track, formData } = body;

  if (!direction || !VALID_DIRECTIONS.has(direction)) {
    return Response.json({ error: 'Invalid direction' }, { status: 400 });
  }

  if (!track || !VALID_TRACKS.has(track)) {
    return Response.json({ error: 'Invalid track' }, { status: 400 });
  }

  if (!currentText || typeof currentText !== 'string' || !currentText.trim()) {
    return Response.json({ error: 'currentText is required' }, { status: 400 });
  }

  if (!formData || typeof formData !== 'object') {
    return Response.json({ error: 'formData is required' }, { status: 400 });
  }

  // 4. Credit pre-flight
  const user = await getUserById(userId);
  if (!user || user.credits <= 0) {
    return Response.json(
      { error: 'NO_CREDITS', message: 'No credits remaining. Please purchase more to continue.' },
      { status: 402 }
    );
  }
  if (user.credits < REFINE_CREDIT_COST) {
    return Response.json(
      { error: 'INSUFFICIENT_CREDITS', message: `Refining costs ${REFINE_CREDIT_COST} credit. Please top up to continue.` },
      { status: 402 }
    );
  }

  // 5. Build prompts
  const systemPrompt = getWizardSystemPrompt(track);
  const originalData = buildGenerationPrompt(track, formData);
  const directionWord = direction === 'lengthen' ? 'Lengthen' : 'Shorten';
  const userPrompt = `${directionWord} the following NZ real estate listing. Keep all factual information, all NZ localisation rules, and the Cringe Filter. Original property data:\n\n${originalData}\n\nCurrent listing:\n${currentText}\n\nOutput the revised listing only.`;

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
    console.error('Claude API error (refine):', error);
    return Response.json({ error: 'Failed to refine listing. Please try again.' }, { status: 502 });
  }

  // 7. Deduct credit after success
  const remainingCredits = await deductCredit(userId, REFINE_CREDIT_COST);

  return Response.json({
    text: outputText,
    credits: remainingCredits ?? 0,
  });
}
