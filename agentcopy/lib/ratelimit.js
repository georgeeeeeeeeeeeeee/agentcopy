// Simple in-memory rate limiter — resets per serverless instance.
// Good enough for Vercel hobby/pro; replace with Upstash Redis for higher scale.

import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from './config.js';

const store = new Map(); // userId -> { count, resetAt }

export function checkRateLimit(userId) {
  const now = Date.now();
  const entry = store.get(userId);

  if (!entry || now > entry.resetAt) {
    store.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}
