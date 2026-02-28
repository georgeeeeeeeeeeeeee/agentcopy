// Edge Runtime-compatible JWT verification (used by middleware only).
// Uses jose instead of jsonwebtoken — no Node.js APIs required.
import { jwtVerify } from 'jose';
import { SESSION_COOKIE } from './config.js';

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

export async function getUserIdFromRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.sub || null;
  } catch {
    return null;
  }
}
