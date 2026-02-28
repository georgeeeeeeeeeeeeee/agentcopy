import { getUserByEmail, createUser } from '@/lib/db';
import { hashPassword, createToken, setSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return Response.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }

    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (typeof fullName !== 'string' || fullName.trim().length < 2) {
      return Response.json({ error: 'Please enter your full name' }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return Response.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ email, passwordHash, fullName: fullName.trim() });

    const token = createToken(user.id);
    await setSessionCookie(token);

    return Response.json({ user: { id: user.id, email: user.email, fullName: user.full_name, credits: user.credits } });
  } catch (error) {
    console.error('Signup error:', error);
    return Response.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
