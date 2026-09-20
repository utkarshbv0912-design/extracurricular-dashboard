/**
 * Minimal Supabase connection test.
 *
 * - Reads .env.local (never committed) and validates required variables.
 * - Calls the project's Auth health endpoint with the publishable key.
 * - Prints NO secret values: not the key, no tokens, nothing beyond the
 *   project URL host and the health response metadata.
 *
 * Usage: npm run check:supabase
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(".env.local");

let env;
try {
  env = readFileSync(envPath, "utf8");
} catch {
  console.error(
    `FAIL: .env.local not found at ${envPath}. Copy .env.example to .env.local and fill in the values.`
  );
  process.exit(1);
}

const vars = {};
for (const line of env.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
}

const missing = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
].filter((name) => !vars[name]);

if (missing.length > 0) {
  console.error(
    `FAIL: missing required environment variables: ${missing.join(", ")}`
  );
  process.exit(1);
}

const supabaseUrl = vars.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = vars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let host;
try {
  host = new URL(supabaseUrl).host;
} catch {
  console.error(
    "FAIL: NEXT_PUBLIC_SUPABASE_URL is not a valid absolute https URL (value not shown)."
  );
  process.exit(1);
}

try {
  const response = await fetch(`https://${host}/auth/v1/health`, {
    headers: { apikey: publishableKey },
  });

  if (!response.ok) {
    console.error(
      `FAIL: Supabase Auth health endpoint returned HTTP ${response.status} for ${host}.`
    );
    process.exit(1);
  }

  const health = await response.json();

  console.log(`PASS: Supabase reachable at ${host}`);
  console.log(`PASS: Auth health version: ${health.version ?? "unknown"}`);
  console.log(
    "No secrets printed. The publishable key is public by design; nothing else was displayed."
  );
} catch (error) {
  console.error(
    `FAIL: could not reach Supabase at ${host}: ${error instanceof Error ? error.message : String(error)}`
  );
  process.exit(1);
}
