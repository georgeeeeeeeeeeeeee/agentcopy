import { neon } from '@neondatabase/serverless';

// Singleton connection — reused across requests in the same serverless instance
const sql = neon(process.env.DATABASE_URL);

export { sql };

// ─── User queries ─────────────────────────────────────────────────────────────

export async function getUserByEmail(email) {
  const rows = await sql`
    SELECT id, email, password_hash, full_name, credits, has_ever_paid, created_at
    FROM users WHERE email = lower(${email}) LIMIT 1
  `;
  return rows[0] || null;
}

export async function getUserById(id) {
  const rows = await sql`
    SELECT id, email, full_name, credits, has_ever_paid, created_at
    FROM users WHERE id = ${id} LIMIT 1
  `;
  return rows[0] || null;
}

export async function createUser({ email, passwordHash, fullName }) {
  const rows = await sql`
    INSERT INTO users (email, password_hash, full_name)
    VALUES (lower(${email}), ${passwordHash}, ${fullName})
    RETURNING id, email, full_name, credits, has_ever_paid, created_at
  `;
  return rows[0];
}

export async function updatePassword(userId, passwordHash) {
  await sql`
    UPDATE users SET password_hash = ${passwordHash} WHERE id = ${userId}
  `;
}

// ─── Credits — atomic deduction (returns new balance or null if insufficient) ──

export async function deductCredit(userId, amount = 1) {
  // Uses CTE to atomically check-and-deduct in one round-trip
  const rows = await sql`
    WITH updated AS (
      UPDATE users
      SET credits = credits - ${amount}, updated_at = now()
      WHERE id = ${userId} AND credits >= ${amount}
      RETURNING credits
    )
    SELECT credits FROM updated
  `;
  return rows[0]?.credits ?? null;  // null = had insufficient credits
}

export async function addCredits(userId, amount, stripeSessionId, amountPaidCents) {
  // Add credits + record purchase atomically
  const rows = await sql`
    WITH credit_update AS (
      UPDATE users
      SET credits = credits + ${amount},
          has_ever_paid = true,
          updated_at = now()
      WHERE id = ${userId}
      RETURNING credits
    ),
    purchase_insert AS (
      INSERT INTO purchases (user_id, stripe_session_id, credits_amount, amount_paid_cents)
      VALUES (${userId}, ${stripeSessionId}, ${amount}, ${amountPaidCents})
      ON CONFLICT (stripe_session_id) DO NOTHING
    )
    SELECT credits FROM credit_update
  `;
  return rows[0]?.credits ?? null;
}

// ─── Generations ──────────────────────────────────────────────────────────────

// track: 'residential' | 'commercial' | null (null for chat-based workflows)
// formData: raw wizard form fields as object | null (null for chat-based workflows)
export async function saveGeneration(userId, workflowId, messages, outputText, { track = null, formData = null } = {}) {
  const rows = await sql`
    INSERT INTO generations (user_id, workflow_id, messages, output_text, track, form_data)
    VALUES (
      ${userId},
      ${workflowId},
      ${JSON.stringify(messages)},
      ${outputText},
      ${track},
      ${formData ? JSON.stringify(formData) : null}
    )
    RETURNING id, created_at
  `;
  return rows[0];
}

export async function getGenerations(userId, { workflowId, limit = 50, offset = 0 } = {}) {
  if (workflowId) {
    return sql`
      SELECT id, workflow_id, output_text, created_at
      FROM generations
      WHERE user_id = ${userId} AND workflow_id = ${workflowId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  }
  return sql`
    SELECT id, workflow_id, output_text, created_at
    FROM generations
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
}

// ─── Password reset tokens ────────────────────────────────────────────────────

export async function createResetToken(userId, token, expiresAt) {
  // Invalidate any existing unused tokens for this user first
  await sql`
    UPDATE password_reset_tokens SET used = true
    WHERE user_id = ${userId} AND used = false
  `;
  await sql`
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt})
  `;
}

export async function consumeResetToken(token) {
  const rows = await sql`
    UPDATE password_reset_tokens
    SET used = true
    WHERE token = ${token}
      AND used = false
      AND expires_at > now()
    RETURNING user_id
  `;
  return rows[0]?.user_id || null;
}
