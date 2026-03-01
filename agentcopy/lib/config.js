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
  // Tier 4 — Commercial Real Estate
  'cre-information-memorandum',
  'cre-walt-calculator',
  'cre-opex-breakdown',
  'cre-agreement-to-lease',
  'cre-rent-review',
  'cre-make-good-clause',
  'cre-seismic-disclosure',
  'cre-deed-summary',
]);

// Tier 3 workflow IDs — 2 credits, residential legal & compliance
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

// Tier 4 workflow IDs — 2 credits, commercial real estate
export const TIER4_WORKFLOW_IDS = new Set([
  'cre-information-memorandum',
  'cre-walt-calculator',
  'cre-opex-breakdown',
  'cre-agreement-to-lease',
  'cre-rent-review',
  'cre-make-good-clause',
  'cre-seismic-disclosure',
  'cre-deed-summary',
]);

export const TIER3_CREDIT_COST = 2;
export const TIER4_CREDIT_COST = 2;

// Returns the credit cost for any workflow ID — single source of truth for the route
export function getWorkflowCreditCost(workflowId) {
  if (TIER4_WORKFLOW_IDS.has(workflowId)) return TIER4_CREDIT_COST;
  if (TIER3_WORKFLOW_IDS.has(workflowId)) return TIER3_CREDIT_COST;
  return 1;
}

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
// 4096 prevents truncation of long-form commercial documents (IMs, WALT analyses)
export const CLAUDE_MAX_TOKENS = 4096;
