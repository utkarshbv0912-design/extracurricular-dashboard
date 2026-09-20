import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

/**
 * Supabase client for Client Components (browser).
 *
 * Reads the project URL and publishable key, which are safe to expose to the
 * browser. Sessions are stored in cookies so the server can read them during
 * SSR.
 */
export function createClient() {
  const { url, publishableKey } = getSupabaseEnv();

  return createBrowserClient(url, publishableKey);
}
