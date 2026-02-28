import { randomBytes } from 'crypto';
import { getUserByEmail, createResetToken } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import { RESET_TOKEN_EXPIRY_HOURS } from '@/lib/config';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Always return success — don't reveal whether the email exists
    const user = await getUserByEmail(email);
    if (user) {
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
      await createResetToken(user.id, token, expiresAt);
      await sendPasswordResetEmail(user.email, token);
    }

    return Response.json({ ok: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return Response.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
