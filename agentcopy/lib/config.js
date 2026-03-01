// ─── Single source of truth for all configurable values ───────────────────────

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Credit packs — update prices and amounts here; nowhere else.
// amount_paid_cents is in NZD cents.
export const CREDIT_PACKS = [
  { id: 'starter',  label: 'Starter',  credits: 10,  amount_paid_cents: 1900,  display: '$19' },
  { id: 'standard', label: 'Standard', credits: 25,  amount_paid_cents: 3900,  display: '$39' },
  { id: 'pro',      label: 'Pro',       credits: 50,  amount_paid_cents: 6900,  display: '$69' },
];

// Set of valid credit amounts — used by webhook to reject tampered metadata
export const VALID_CREDIT_AMOUNTS = new Set(CREDIT_PACKS.map(p => p.credits));

// Valid workflow IDs — used to whitelist chat requests
export const VALID_WORKFLOW_IDS = new Set([
  // Tier 1 — Marketing & Lead Gen
  'trademe-listing',
  'realestate-listing',
  'social-post',
  'video-tour-script',
  // Tier 2 — Professional Correspondence
  'vendor-update',
  'open-home-followup',
  'price-reduction',
  'appraisal-letter',
  'buyer-email',
  'multi-offer-notification',
  'rejection-email',
  'acceptance-email',
  // Tier 3 — Legal & Compliance
  'sp-finance-clause',
  'sp-building-clause',
  'sp-solicitors-approval',
  'sp-sunset-clause',
  'sp-further-terms',
  'disclosure-material-defects',
  'disclosure-as-is',
  'disclosure-unit-title',
  'disclosure-healthy-homes',
  'aml-cdd-explanation',
  'aml-source-of-funds',
]);

// Tier 3 workflow IDs — cost 2 credits each and require tone handling
export const TIER3_WORKFLOW_IDS = new Set([
  'sp-finance-clause',
  'sp-building-clause',
  'sp-solicitors-approval',
  'sp-sunset-clause',
  'sp-further-terms',
  'disclosure-material-defects',
  'disclosure-as-is',
  'disclosure-unit-title',
  'disclosure-healthy-homes',
  'aml-cdd-explanation',
  'aml-source-of-funds',
]);

// Credit cost for Tier 3 workflows
export const TIER3_CREDIT_COST = 2;

// Input limits
export const MAX_MESSAGE_LENGTH = 5000;  // characters per message
export const MAX_MESSAGES_PER_REQUEST = 40;

// Rate limiting: requests per window per user
export const RATE_LIMIT_MAX = 10;
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

// Auth
export const JWT_EXPIRY = '7d';
export const SESSION_COOKIE = 'ac_session';
export const RESET_TOKEN_EXPIRY_HOURS = 1;

// AI model
export const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
export const CLAUDE_MAX_TOKENS = 2048;
