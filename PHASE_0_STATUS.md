# Phase 0 Status — Extracurricular Dashboard

Status: **complete**. Every required Part 4 task ran and passed. This document
is the completion report.

## Completed work

- **Design foundation:** warm, light, student-friendly theme tokens in
  `src/app/globals.css` (cream background, warm ink text scale, amber accent,
  accessible two-ring focus outline, dark-mode variant of the same hue family).
  Components consume tokens (`bg-surface`, `text-body`, `border-line`), not raw
  colors.
- **Reusable UI components:** `Button`/`ButtonLink` (4 variants, 3 sizes),
  `Card` family (Card/CardHeader/CardBody/CardTitle/CardDescription),
  `Container` (shared page width/gutters), `EmptyState`, `Spinner`.
- **Mascot direction:** "Lumo", a pencil-drawn lightbulb as a single inline SVG
  component with `happy | thinking | oops` moods. No animation, no AI avatar.
- **Shared responsive layout:** sticky header (mascot logo, active-route
  highlighting via `aria-current`, compact label on small screens) rendered
  once in the root layout, plus a shared footer; a single `<main>` landmark.
- **Landing page** (`/`) and **dashboard placeholder** (`/dashboard`) rebuilt
  on the shared components, structured for easy replacement in Phase 1.
- **States:** route-level `loading.tsx` (app and dashboard), client error
  boundary (`error.tsx`, friendly message, raw error only in console), and
  `not-found.tsx` (404).

## Files created or modified

| File | Change |
|---|---|
| `src/app/globals.css` | Rewrote tokens to warm light theme + dark variant |
| `src/app/layout.tsx` | Header/footer in layout; single `<main>` landmark |
| `src/app/page.tsx` | Redesigned landing (mascot hero, CTA, 3 preview cards) |
| `src/app/dashboard/page.tsx` | Redesigned placeholder (stat cards + empty state) |
| `src/components/site-header.tsx` | Client component: active nav, mascot logo |
| `src/components/site-footer.tsx` | New shared footer |
| `src/components/ui/button.tsx` | New: Button + ButtonLink |
| `src/components/ui/card.tsx` | New: Card family |
| `src/components/ui/container.tsx` | New: Container |
| `src/components/ui/empty-state.tsx` | New: EmptyState |
| `src/components/ui/spinner.tsx` | New: Spinner |
| `src/components/mascot/lightbulb-mascot.tsx` | New: Lumo mascot SVG |
| `src/app/loading.tsx`, `src/app/dashboard/loading.tsx` | New: loading states |
| `src/app/error.tsx` | New: error boundary |
| `src/app/not-found.tsx` | New: 404 page |
| `README.md` | Scripts table, structure, design-foundation notes |
| `PHASE_0_STATUS.md` | This report |

## Commands run

- `npm install` — dependency install check; no new packages added; npm
  `allow-scripts` notice about `unrs-resolver` postinstall (informational, not
  acted on).
- `npx tsc --noEmit` — passed after lint fixes.
- `npm run lint` — 2 errors + 1 warning found (unescaped apostrophes in
  `not-found.tsx`/`page.tsx`, unused `ReactNode` import in the mascot) —
  **fixed**, re-run clean.
- `npm run build` — production build passes: `/`, `/_not-found`, `/dashboard`
  all static; `ƒ Proxy (Middleware)` registered.
- `npm run start` (production server) — tested locally.
- `npm run check:supabase` — connectivity pass, no secrets printed.
- Code audit greps — no `dangerouslySetInnerHTML`, no `any`, no
  `eslint-disable`, no TODO/FIXME, no leftover raw zinc/gray color classes.

## Tests passed

1. Production server: `/` → 200, `/dashboard` → 200, unknown route → 404.
2. Landing page renders hero heading, mascot SVG, nav with
   `aria-current="page"` on Home, and the dashboard CTA.
3. Dashboard renders title, 3 placeholder cards, and the empty state.
4. Exactly one `<main>` landmark per page (fixed after first check found
   none — layout used a `<div>` wrapper).
5. No horizontal overflow at a ~420px mobile viewport (responsive check);
   `sm:grid-cols-3` responsive classes present; viewport meta tag confirmed.
6. Missing-env test: with `.env.local` renamed away, `npm run check:supabase`
   exits 1 with a message pointing to `.env.example` — no variable values
   printed (leak-scan grep found zero secret occurrences in output).
7. Git review: `.env.local`, `node_modules`, `.next`, `tsconfig.tsbuildinfo`,
   and logs are **not** tracked; branch `main`; remote
   `origin → github.com/utkarshbv0912-design/extracurricular-dashboard`;
   `origin/main` in sync before commit.

## Tests failed (and resolved during the session)

- Lint initially failed (2 errors, 1 warning) — fixed in-session, re-run
  passed.
- First runtime check found no `<main>` landmark — fixed in layout, rebuilt,
  re-verified.
- The dev-server preview initially served a stale build — resolved by
  rebuilding and restarting the production server before re-testing.

## Unresolved warnings

- npm `allow-scripts` notice for `unrs-resolver@1.12.2` postinstall — an npm
  security-configuration notice present since Part 1, not a project defect;
  no action taken.
- `@supabase/supabase-js` is a declared dependency but not imported anywhere
  yet — it is the documented pairing for `@supabase/ssr` and will be used for
  typed database clients in Phase 1. Keeping it avoids a re-install then; it
  is the only dependency not currently imported.

## Security limitations

- Authentication does not exist yet; there is no login, and no student data
  exists in the product yet (database has no tables).
- The publishable Supabase key ships in `.env.local` only (git-ignored,
  verified). No service-role key, database password, or access token exists
  anywhere in the project.
- RLS is planned (DATABASE_PLAN.md) but not yet deployed — database security
  remains incomplete by design until the schema phase.
- The error boundary logs full errors to the browser console in this Phase 0
  build; server-side logging replaces this when data features arrive.

## Recommended next step

Phase 1 — **design and UX planning**: translate MVP_SCOPE.md into user flows
and screen inventories (onboarding, dashboard, activity/achievement capture,
opportunity finder, saves, applications, admin), map each screen to data
needs from DATABASE_PLAN.md, agree the interaction and visual-detail spec for
the Lumo design system, and resolve the three open schema decisions in
DATABASE_PLAN.md before the first migration.

*Exact next step:* draft the Phase 1 UX plan document (flows + screens +
component mapping), then review it against MVP_SCOPE.md before any Phase 1
implementation begins.
