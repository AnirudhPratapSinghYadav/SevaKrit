import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfigured } from "./supabaseConfig";

let client: SupabaseClient | null = null;

/** Public anon client only. Returns null when the demo has no Supabase URL. */
export function getSupabase(): SupabaseClient | null {
  const env = import.meta.env as Record<string, string | undefined>;
  if (!supabaseConfigured(env)) return null;
  if (client === null) {
    const url = env.VITE_SUPABASE_URL;
    const key = env.VITE_SUPABASE_ANON_KEY;
    if (url === undefined || key === undefined) return null;
    // Session persistence pattern adapted from Nagarakshak supabase.js (anon key only).
    client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
