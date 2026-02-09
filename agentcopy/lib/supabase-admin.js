import { createClient } from "@supabase/supabase-js";

// This client uses the service role key and bypasses RLS
// ONLY use this in server-side code (API routes, webhooks)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
