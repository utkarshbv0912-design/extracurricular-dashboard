# Development Rules — Extracurricular Dashboard

Rules that govern how this project is built. They exist to keep the system
secure, reviewable, and small. When a task conflicts with a rule, the rule
wins unless the user explicitly approves an exception in writing (in this
repo, as an update to this file).

## Git workflow

1. **Trunk-based with small commits.** Work lands on `main` in commits that
   are one logical change each. Feature branches are fine for larger work;
   they merge promptly and never live long enough to rot.
2. **Commit messages** state the *why* in one clear sentence, optionally with
   a short body for context. No "update", "fix stuff", or "wip" on `main`.
3. **Never commit:** `.env.local`, keys, tokens, passwords, database dumps,
   or anything from `.gitignore`. Only `.env.example` with placeholders is
   tracked. Before every commit: check `git status` for unexpected files and
   scan diffs for secrets.
4. **No force-pushes to `main`, no history rewrites** on shared branches, no
   `git push` without the change being verified locally first (typecheck +
   lint + build).
5. **Unrelated changes stay separate.** A security fix is not bundled with a
   feature; documentation updates are their own commit.
6. **Environment changes are explicit.** Adding a required environment
   variable means updating `.env.example` and the README in the same commit.

## Security

1. **The server is the boundary.** All authorization is enforced by RLS
   policies and server-side checks. Client-side hiding of UI is cosmetic,
   never a control.
2. **Ownership checks everywhere.** Every student-owned row carries
   `user_id` and is scoped by `auth.uid() = user_id` in RLS. `WITH CHECK`
   clauses are mandatory, not optional.
3. **No unsafe policies, ever.** No `USING (true)`, no disabled RLS, no
   anonymous catch-alls — not for local development, not for demos, not
   "temporarily". If a feature seems to need one, the feature design is
   wrong.
4. **Publishable key only** in application code. The service-role key never
   enters the repo, the client bundle, or application runtime. Any task that
   seems to require it gets redesigned.
5. **Validate every input server-side** through the validation layer
   (`src/lib/validation/`) before writes; whitelist enums; bound text
   lengths; reject unknown fields.
6. **Least data collected** (DATABASE_PLAN.md privacy review): no age,
   birthdate, location, school identity, or contact fields without an
   explicit, documented justification.
7. **User-safe errors.** Error messages expose nothing about the database,
   other users, or internals. Full errors are logged server-side only.
8. **Secrets in terminal output are forbidden** — no printing env values,
   keys, or tokens in scripts, logs, or reports. The connection test prints
   status metadata only.
9. **Security advisors after every migration.** A migration is not done until
   the Supabase security advisor is clean and the RLS assertion script
   passes for a student and an admin user.

## Testing

1. **Baseline checks per change:** `npm run lint`, `npx tsc --noEmit`,
   `npm run build` — all green before commit.
2. **RLS assertions are release-blocking.** Every migration that touches
   policies ships with (or updates) a scripted check that proves, as a
   student and as an admin:
   - cross-student reads/writes/deletes fail;
   - drafts/archived opportunities are invisible to students;
   - non-admins cannot write admin tables;
   - intended operations still succeed.
3. **Unit-test the rules that matter:** validation schemas, matching-service
   scoring, deadline/status logic. Pure functions get direct tests; no
   framework ceremony beyond what earns its keep.
4. **Connection test stays green:** `npm run check:supabase` verifies
   connectivity without printing secrets; run it after env or project
   changes.
5. **Manual QA checklist for features:** owner sees own data; owner cannot
   see others'; unauthenticated access yields nothing; invalid input is
   rejected with a clear message; responsive layout holds on a phone-width
   viewport.

## Code quality

1. **TypeScript strict mode is non-negotiable.** No `any` unless proven
   unavoidable in a comment; no non-null `!` on values that can actually be
   missing — validate instead.
2. **Server Components by default;** `"use client"` only for real
   interactivity.
3. **One responsibility per module.** Data access lives in `src/lib/data/`,
   validation in `src/lib/validation/`, matching in `src/lib/matching/`,
   Supabase clients in `src/lib/supabase/` — pages never query inline.
4. **Naming follows the domain** (activities, opportunities, applications)
   so code, schema, and documents use the same words.
5. **Documentation moves with code.** A change that alters architecture,
   scope, or security updates ARCHITECTURE.md / MVP_SCOPE.md /
   DEVELOPMENT_RULES.md in the same commit.
6. **Dependencies are scarce.** Every new package needs a reason in the
   commit message; prefer the standard library and existing deps.

## Scope control

1. **MVP_SCOPE.md is the contract.** Included = will build. Excluded = do
   not build, do not stub, do not "prepare" for.
2. **New ideas go to the docs first.** A new feature is proposed by editing
   MVP_SCOPE.md (and, if data-bearing, DATABASE_PLAN.md) before any
   implementation exists.
3. **No speculative infrastructure.** No abstraction for a second use case
   that does not exist yet; no config for deployments that are not planned.
4. **Greenfield discipline:** every table/policy migration is additive and
   reviewed; destructive database operations require explicit user approval
   in advance (see DATABASE_PLAN.md migration strategy).
5. **Done means verified:** code merged with passing checks, RLS assertions
   (if schema), and docs updated. "It works on my machine" is not done.
