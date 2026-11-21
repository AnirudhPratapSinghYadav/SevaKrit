// Pure check of the public Supabase settings. Does not import @supabase/supabase-js and creates no client.
// Returns false in local demo mode, when either public value is missing or blank.
export function supabaseConfigured(env: Record<string, string | undefined>): boolean {
  const url = env.VITE_SUPABASE_URL;
  const anonKey = env.VITE_SUPABASE_ANON_KEY;
  return (
    typeof url === "string" && url.trim() !== "" && typeof anonKey === "string" && anonKey.trim() !== ""
  );
}
