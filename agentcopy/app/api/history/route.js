import { getSessionUserId } from '@/lib/auth';
import { getGenerations } from '@/lib/db';
import { VALID_WORKFLOW_IDS } from '@/lib/config';

export async function GET(request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('workflow');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

    // Validate optional workflow filter
    if (workflowId && !VALID_WORKFLOW_IDS.has(workflowId)) {
      return Response.json({ error: 'Invalid workflow filter' }, { status: 400 });
    }

    const generations = await getGenerations(userId, { workflowId, limit, offset });
    return Response.json({ generations });
  } catch (error) {
    console.error('History error:', error);
    return Response.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
