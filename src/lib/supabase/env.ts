/**
 * Centralized access to required Supabase environment variables with safe
 * validation. Throws a descriptive error naming the exact missing variable so
 * misconfiguration is caught early instead of producing confusing runtime
 * failures deep inside the client libraries.
 *
 * Variables:
 * - NEXT_PUBLIC_SUPABASE_URL           Project URL (safe to expose to browsers)
 * - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 *                                      Publishable key (safe to expose to
 *                                      browsers; formerly the "anon" key)
 *
 * Only publishable values are handled here. The service-role key must never
 * appear in this codebase or in any client-side code.
 */
function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy .env.example to .env.local, fill in the values, and restart the dev server.`
    );
  }

  return value;
}

export function getSupabaseEnv() {
  return {
    url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  };
}
