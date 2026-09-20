# Architecture — Extracurricular Dashboard

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase
(Postgres, Auth) via `@supabase/ssr`.

The guiding rule: **the browser is untrusted.** Every security decision is
made on the server — in RLS policies and in server-side checks — never in
client code.

## Layer map

```
┌──────────────────────────────────────────────────────────┐
│ Browser (untrusted)                                      │
│   Next.js frontend · reusable UI components              │
└──────────────┬───────────────────────────────────────────┘
               │ fetch / server actions
┌──────────────▼───────────────────────────────────────────┐
│ Server (trusted)                                         │
│   server-side data access · validation layer             │
│   future: matching service · future: admin dashboard     │
└──────────────┬───────────────────────────────────────────┘
               │ session JWT (publishable key)
┌──────────────▼───────────────────────────────────────────┐
│ Supabase: authentication · Postgres + RLS (authoritative)│
└───────────────────────────────────────────────────────────┘
```

## 1. Next.js frontend (App Router)

- **Role:** Pages, routing, server components fetching data directly from the
  data-access layer, client components for interactivity.
- **Conventions already in place:** `src/app/` for routes, `src/` layout with
  `@/*` import alias, Tailwind styling, responsive-first design.
- **Rules:**
  - Server Components are the default; `"use client"` only where
    interactivity is genuinely needed.
  - No secrets in client bundles — only `NEXT_PUBLIC_*` values (the Supabase
    URL and publishable key, which are public by design).
  - The proxy (`src/proxy.ts`) refreshes Supabase sessions on matched
    requests so SSR renders with a valid session.
- **Planned routes (MVP):** onboarding, `/dashboard`, activities,
  achievements, opportunity finder (+ search/filters), saved opportunities,
  applications/tracker, admin area.

## 2. Reusable UI components

- **Role:** Presentational building blocks shared across pages: forms, cards,
  tables, badges, empty states, modals, filter bars.
- **Location:** `src/components/` (started with `site-header.tsx`).
- **Rules:**
  - Server Components by default; interactive primitives (inputs with
    validation feedback, modals) are the client-component exception.
  - No data fetching inside UI components — they receive props; data access
    lives in the layer below. This keeps components reusable and testable.
  - Accessible by default (labels, focus states, keyboard paths) and
    responsive without layout-shifting hacks.

## 3. Server-side data access

- **Role:** The only code that talks to Supabase for application data.
  Server Components, Server Actions, and Route Handlers call typed functions
  here instead of building queries inline.
- **Planned location:** `src/lib/data/` alongside the existing
  `src/lib/supabase/` client factories.
- **Rules:**
  - One module per entity (e.g. `activities.ts`, `opportunities.ts`) with
    explicit input/output types.
  - Always create the server client through
    `src/lib/supabase/server.ts` so the user's session JWT scopes every
    query; RLS remains the real boundary (this layer is convenience and
    typing, not the security control).
  - Server Actions validate input through the validation layer **before**
    any write, then re-check ownership/admin claims where relevant.
  - No dynamic query construction from raw client input beyond typed,
    whitelisted filter parameters (e.g. category, status).
- **Current state:** `src/lib/supabase/` exists (browser client, server
  client, proxy session refresh, env validation). Entity data modules arrive
  with the first feature.

## 4. Supabase authentication and database

- **Auth:** Supabase Auth (email/password to start) with cookie-based
  sessions via `@supabase/ssr`; token refresh handled by the proxy using
  `auth.getClaims()` (signature-verified), never raw cookie trust.
- **Database:** Postgres with RLS as the authoritative permission model —
  see DATABASE_PLAN.md for every table's policy strategy. The application
  connects with the publishable key only; the service-role key does not
  appear in application code.
- **Schema changes:** versioned SQL migrations under `supabase/migrations/`,
  additive only, each shipping with its RLS policies and an RLS assertion
  check before merge (see DATABASE_PLAN.md, "Migration strategy").

## 5. Validation layer

- **Role:** A single source of truth for input correctness, used by Server
  Actions and Route Handlers before any write reaches the database.
- **Planned location:** `src/lib/validation/`.
- **Approach:** schema-based validation (e.g. Zod) defining the shape, bounds,
  and allowed values of every user input: activity fields, achievement
  fields, application status transitions, opportunity admin forms, report
  reasons.
- **Rules:**
  - Validate on the server, always; client-side validation is UX only.
  - Whitelist enumerated values (statuses, categories) instead of trusting
    free text where a taxonomy exists.
  - Bound free-text lengths; strip or reject unexpected fields rather than
    persisting them.
  - Error responses are user-safe: no stack traces, no SQL, no identifiers
    beyond what the user owns.

## 6. Matching service (future)

- **Role:** Rule-based recommendations connecting a student's profile and
  activity history to published opportunities.
- **MVP approach:** deterministic scoring in server code — overlap between
  `profiles.interests` / activity categories and `opportunities.category`,
  grade-band eligibility checks, deadline recency weighting. No model
  training, no external AI APIs in the MVP.
- **Location when built:** `src/lib/matching/`, invoked from the dashboard
  and finder pages via the data-access layer.
- **Rules:**
  - Reads only data the calling student is allowed to see; produces ranked
    opportunity ids, then fetches rows through normal (RLS-scoped) queries.
  - Every recommendation is explainable in-product ("matches your interest:
    music"), keeping the feature auditable and cheap to debug.
  - Excluded from MVP: ML models, external AI providers, scrape-based
    candidate pools (see MVP_SCOPE.md).

## 7. Admin dashboard (future)

- **Role:** Curated opportunity management (create/edit/publish/archive) and
  report resolution for users granted `admin_roles`.
- **Planned location:** `src/app/admin/` with its own layout and a
  server-side guard.
- **Enforcement (defense in depth, per DATABASE_PLAN.md):**
  1. Guard in the admin layout/server actions: query `admin_roles` for the
     caller's `auth.uid()` before rendering or mutating; redirect non-admins.
  2. RLS policies independently restrict admin writes at the database.
  3. All admin inputs pass the same validation layer as student flows.
  4. No client-hidden-only gates; no service-role shortcuts.
- **MVP admin features:** opportunity CRUD (via validated forms), publish/
  archive status control, report queue with resolve action. Everything else
  (bulk import, analytics, multi-role permissions) is out of scope.

## Cross-cutting rules

- **Security:** ownership via `user_id = auth.uid()` RLS on all student
  tables; server-side re-checks for admin; publishable key only; no secrets
  in the repo (see DEVELOPMENT_RULES.md).
- **Privacy:** least-data collection — no age, birthdate, location, school
  identity, or contact fields (rationale in DATABASE_PLAN.md).
- **Error handling:** failures degrade to user-safe messages; unexpected
  errors are logged server-side, never streamed to clients.
- **Performance posture:** server components stream by default; indexes added
  with migrations for known query paths (`user_id` foreign keys,
  `opportunities.status`, `deadline`).
