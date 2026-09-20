import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 *
 * Cookie-based auth storage lets server code read the signed-in user during
 * SSR. Server Components cannot write cookies, which is why token refresh is
 * handled by the proxy (see src/lib/supabase/proxy.ts and src/proxy.ts).
 */
export async function createClient() {
  const { url, publishableKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component: cookies cannot be written here.
          // The proxy refreshes sessions, so this can be safely ignored.
        }
      },
    },
  });
}
