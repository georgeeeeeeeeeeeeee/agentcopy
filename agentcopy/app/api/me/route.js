import { getSessionUserId } from '@/lib/auth';
import { getUserById } from '@/lib/db';

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      credits: user.credits,
      hasEverPaid: user.has_ever_paid,
    });
  } catch (error) {
    console.error('Me route error:', error);
    return Response.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
