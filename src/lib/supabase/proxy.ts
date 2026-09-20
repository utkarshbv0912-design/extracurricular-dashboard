import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

/**
 * Refreshes the Supabase Auth session on every matched request by calling
 * supabase.auth.getClaims(), which verifies the token signature. Refreshed
 * tokens are passed to Server Components and back to the browser via cookies.
 *
 * The publishable key is public by design, so this file contains nothing
 * secret. Called from src/proxy.ts (Next.js 16 renamed middleware to proxy).
 */
export async function updateSession(request: NextRequest) {
  const { url, publishableKey } = getSupabaseEnv();

  const supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: do not run code between createServerClient and getClaims().
  // getClaims() verifies the token signature on every call.
  await supabase.auth.getClaims();

  // IMPORTANT: return the supabaseResponse object as built by setAll above.
  // Returning an earlier response would drop refreshed auth cookies.
  return supabaseResponse;
}
