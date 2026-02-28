import { sql } from '@/lib/db';

export async function GET() {
  try {
    await sql`SELECT 1`;
    return Response.json({ status: 'ok', db: 'connected', ts: new Date().toISOString() });
  } catch (error) {
    return Response.json({ status: 'error', db: 'disconnected', error: error.message }, { status: 503 });
  }
}
