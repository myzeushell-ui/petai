/**
 * Supabase client — used for auth, DB, and storage.
 *
 * Setup:
 * 1. Create a project at https://supabase.com
 * 2. Add to Vercel env:
 *    NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
 *    SUPABASE_SERVICE_ROLE_KEY=eyJ...  (server-only)
 * 3. Run the migration in supabase/migrations/001_initial.sql
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!_client) {
    _client = createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return _client;
}

// Server-side admin client (route handlers only — never expose to browser)
export function getSupabaseAdmin(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
