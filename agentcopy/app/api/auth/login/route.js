import { getUserByEmail } from '@/lib/db';
import { verifyPassword, createToken, setSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await getUserByEmail(email);

    // Always run bcrypt to prevent timing attacks, even if user not found
    const dummyHash = '$2a$12$invalidhashfortimingattackprevention000000000000000000';
    const passwordMatch = user
      ? await verifyPassword(password, user.password_hash)
      : await verifyPassword(password, dummyHash).then(() => false);

    if (!user || !passwordMatch) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = createToken(user.id);
    await setSessionCookie(token);

    return Response.json({
      user: { id: user.id, email: user.email, fullName: user.full_name, credits: user.credits }
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}
