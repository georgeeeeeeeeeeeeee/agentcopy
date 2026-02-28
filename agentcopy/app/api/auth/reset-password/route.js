import { consumeResetToken, updatePassword } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || typeof token !== 'string') {
      return Response.json({ error: 'Reset token is required' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const userId = await consumeResetToken(token);
    if (!userId) {
      return Response.json({ error: 'This reset link is invalid or has expired' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    await updatePassword(userId, passwordHash);

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return Response.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
