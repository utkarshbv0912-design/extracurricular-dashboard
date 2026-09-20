# Database Plan — Extracurricular Dashboard

Status: **planning document only**. No tables, policies, or migrations have been
executed yet. Everything below must be reviewed before the schema phase.

## Design principles

1. **Least data.** Collect only what a feature requires. No age, no birthdate,
   no home address, no precise geolocation (see the privacy review at the end).
2. **Private by default.** Student records are visible only to their owner.
   Public exposure is an explicit, per-table design decision.
3. **RLS is the security boundary.** Application code is not trusted to scope
   queries; Row Level Security enforces ownership server-side. Policies ship in
   the same migration as their table, never "added later".
4. **No unsafe shortcuts.** No `USING (true)` policies, no disabled RLS during
   development, no service-role key in the application runtime.

## Entity overview

```
profiles 1─────* activities
profiles 1─────* achievements
profiles 1─────* saved_opportunities *─────1 opportunities
profiles 1─────* applications *───────────1 opportunities
users (auth) *────1 profiles
admin_roles *────1 users (auth)
opportunity_reports *────1 opportunities
opportunity_reports *────1 users (auth) [reporter]
```

## Proposed tables

### profiles

- **Purpose:** Student-facing profile and matching preferences. One row per
  authenticated user, created by an explicit server-side onboarding step after
  signup — **not** by an `auth.users` database trigger (locked; see "Profile
  creation flow" below).
- **Ownership:** The single user referenced by `id`. Never writable by other
  students.
- **Important fields:**
  - `id uuid PK` — equals `auth.users.id` (1:1, not a separate surrogate key)
  - `display_name text` — optional, self-chosen
  - `grade_level text` — coarse band (e.g. "9", "10", "11", "12", "other");
    stored instead of birthdate or age
  - `interests text[]` — zero or more values from the shared category
    taxonomy (see "Category taxonomy") used by rule-based recommendations;
    students select from the controlled list rather than creating arbitrary
    tags
  - `preferences jsonb` — future matching preferences (e.g. preferred
    activity types), kept schema-flexible
  - `created_at timestamptz`, `updated_at timestamptz`
- **Future security requirements:** RLS enabled; SELECT/UPDATE restricted to
  `auth.uid() = id`; no INSERT by clients other than the owner's server-side
  onboarding operation, which can only create/update the authenticated
  user's own profile (`WITH CHECK (auth.uid() = id)`); no DELETE (account
  deletion handled out of scope, via support flow).

#### Profile creation flow (locked)

```
Sign up → authenticated session → onboarding → server-side profile creation
→ dashboard
```

- After signup the user holds an authenticated session but no profile row
  yet; onboarding collects display name, grade band, and interests.
- Submission goes to a server action / route handler that runs with the
  caller's own session and inserts the profile with `id = auth.uid()`. It can
  only create or update the authenticated user's own profile — never another
  user's. RLS (`auth.uid() = id` with `WITH CHECK`) is the ultimate security
  boundary; the server code adds no bypass.
- No `auth.users` insert trigger is used for MVP profile creation. Explicit
  server-side creation keeps profile setup inside the onboarding UX (where
  interests and preferences are actually collected) and avoids
  trigger-side failure modes.
- Until a profile exists, the student is redirected to onboarding; the
  dashboard and finder require an authenticated session (see the access
  model in "How public or curated opportunities are managed").
- **Deliberately excluded:** birthdate, age, home address, GPS/location
  coordinates, school name (not needed for the MVP matching rules), phone
  number.

### activities

- **Purpose:** A student's logged extracurricular activities (clubs, sports,
  volunteering, personal projects).
- **Ownership:** Belongs to exactly one student. Strictly private.
- **Important fields:**
  - `id uuid PK default gen_random_uuid()`
  - `user_id uuid NOT NULL REFERENCES profiles(id)` — owner
  - `title text NOT NULL`
  - `category text` — exactly one value from the shared category taxonomy
    (see "Category taxonomy")
  - `description text`
  - `started_on date`, `ended_on date` — dates only; no recurring schedule
    engine in the MVP
  - `hours numeric` — cumulative logged hours
  - `created_at timestamptz`, `updated_at timestamptz`
- **Future security requirements:** RLS enabled; all operations filtered by
  `auth.uid() = user_id`. No role grants exceptions for admins — admins have no
  reason to read student activities.

### achievements

- **Purpose:** Awards, certifications, competition results, and milestones,
  optionally linked to an activity.
- **Ownership:** Belongs to exactly one student. Strictly private.
- **Important fields:**
  - `id uuid PK default gen_random_uuid()`
  - `user_id uuid NOT NULL REFERENCES profiles(id)` — owner
  - `activity_id uuid NULL REFERENCES activities(id)` — optional link
  - `title text NOT NULL`
  - `level text` — e.g. school / regional / national / international
  - `awarded_on date`
  - `description text`
  - `created_at timestamptz`, `updated_at timestamptz`
- **Future security requirements:** RLS enabled; scoped by
  `auth.uid() = user_id`. If `activity_id` is set, its owner must equal
  `user_id` (enforced in validation or a check policy).

### opportunities

- **Purpose:** The curated catalog of competitions, programs, internships,
  and other opportunities. Managed by admins; read-only for students.
- **Ownership:** Not user-owned. Managed by admins (see admin model below).
- **Important fields:**
  - `id uuid PK default gen_random_uuid()`
  - `title text NOT NULL`
  - `organization text`
  - `description text`
  - `category text` — exactly one value from the shared category taxonomy
    (see "Category taxonomy"), shared conceptually with `activities.category`
    and `profiles.interests` for rule-based matching
  - `eligibility text` — free-form eligibility notes
  - `min_grade_level text NULL` / `max_grade_level text NULL` — coarse bands,
    matching the profile field; enables basic filters without collecting age
  - `deadline date` — application deadline
  - `link text NOT NULL` — external URL
  - `status text NOT NULL DEFAULT 'draft'` — `draft | published | archived`
  - `created_at timestamptz`, `updated_at timestamptz`
- **Future security requirements:** RLS enabled with two distinct policies:
  authenticated students may SELECT only `status = 'published'` rows; admins
  may SELECT all and INSERT/UPDATE (no client DELETE — archiving only).
  Anonymous requests see no rows — the catalog is not publicly readable in
  the MVP (see the access model below). Drafts and archived rows are never
  readable by students. All writes flow through the admin surface, which
  validates input server-side.

### saved_opportunities

- **Purpose:** A student's bookmarked opportunities ("save for later").
- **Ownership:** Belongs to exactly one student. Strictly private.
- **Important fields:**
  - `id uuid PK default gen_random_uuid()`
  - `user_id uuid NOT NULL REFERENCES profiles(id)` — owner
  - `opportunity_id uuid NOT NULL REFERENCES opportunities(id)`
  - `created_at timestamptz`
  - Unique constraint: `(user_id, opportunity_id)` — no duplicate saves
- **Future security requirements:** RLS enabled; scoped by
  `auth.uid() = user_id`. Students may only reference rows of `opportunities`
  they can already read (published ones); enforced via a policy subquery or a
  foreign-key + validation, decided at implementation.

### applications

- **Purpose:** Application and deadline tracking for opportunities a student
  intends to pursue or has pursued.
- **Ownership:** Belongs to exactly one student. Strictly private.
- **Important fields:**
  - `id uuid PK default gen_random_uuid()`
  - `user_id uuid NOT NULL REFERENCES profiles(id)` — owner
  - `opportunity_id uuid NULL REFERENCES opportunities(id)` — nullable so a
    student can track an application outside the curated catalog
  - `status text NOT NULL DEFAULT 'planned'` —
    `planned | in_progress | submitted | accepted | rejected | withdrawn`
  - `deadline date` — editable snapshot; the catalog deadline may change
  - `notes text`
  - `created_at timestamptz`, `updated_at timestamptz`
- **Multiple applications allowed (locked):** there is deliberately **no**
  unique constraint on `(user_id, opportunity_id)`. Some opportunities
  repeat annually or run several application cycles, so the same student may
  legitimately apply again; every application row carries its own `id` and
  is tracked independently. `opportunity_id` stays nullable for off-catalog
  tracking.
- **Status lifecycle (intended):**
  `planned → in_progress → submitted → accepted/rejected/withdrawn`.
  The database does not enforce a strict transition sequence — `status`
  records the current state, and reasonable transitions are controlled by
  the application UI/validation layer. `withdrawn` records a student pulling
  out; it is a student-chosen terminal state alongside
  `accepted`/`rejected`.
- **Future security requirements:** RLS enabled; scoped by
  `auth.uid() = user_id`.

### admin_roles

- **Purpose:** Grants elevated, server-verified administrative permissions to
  specific users. Deliberately a separate table — not a boolean column on
  profiles and not a client-readable role claim.
- **Ownership:** Row belongs to the admin user; rows are managed only by
  existing admins (or seeded manually for the first admin).
- **Important fields:**
  - `user_id uuid PK REFERENCES profiles(id)` — one row per admin at most;
    a simple role is sufficient for the MVP (no fine-grained permission table
    yet)
  - `granted_by uuid NULL REFERENCES profiles(id)`
  - `granted_at timestamptz`
- **Future security requirements:** RLS enabled; readable only by
  `auth.uid() = user_id` (so admins can introspect their own role) — other
  users can neither read nor write it. All INSERT/UPDATE/DELETE restricted to
  existing admins through policies. The first admin is seeded by a migration
  with a known user id, not through any public endpoint. Client JWTs must
  never be the sole source of admin authority (see "Server-side admin
  enforcement").

### opportunity_reports

- **Purpose:** Student reports of inaccurate, expired, or inappropriate
  opportunity listings; input to admin curation.
- **Ownership:** Written by one student; readable by admins and (in a limited
  form) by the reporting student.
- **Important fields:**
  - `id uuid PK default gen_random_uuid()`
  - `opportunity_id uuid NOT NULL REFERENCES opportunities(id)`
  - `reported_by uuid NOT NULL REFERENCES profiles(id)` — reporter
  - `reason text NOT NULL` — enum-like: `inaccurate | expired | inappropriate | other`
  - `details text`
  - `status text NOT NULL DEFAULT 'open'` — `open | resolved`
  - `created_at timestamptz`
- **Future security requirements:** RLS enabled; INSERT allowed for any
  authenticated student targeting a published opportunity (rate limiting
  considered at implementation); SELECT limited to the reporter
  (`auth.uid() = reported_by`) and admins; UPDATE (status resolution) admins
  only.

## Category taxonomy (locked)

The MVP uses a **controlled shared category taxonomy**: students select from
a fixed list rather than creating arbitrary categories, so rule-based
matching compares like with like. The same conceptual taxonomy applies to
`profiles.interests`, `activities.category`, and `opportunities.category` —
one list of allowed values, stored as `text`. No separate category table is
introduced: nothing in the current architecture needs per-category metadata,
and the validation layer can own the list.

Initial categories:

1. Sports
2. Music
3. Arts & Design
4. Technology
5. Science
6. Business & Entrepreneurship
7. Community Service
8. Leadership
9. Writing & Media
10. Academic
11. Debate & Public Speaking
12. Environment
13. Other

- `Other` stays available for anything that fits nowhere else, so the
  controlled list never forces a wrong label.
- The list lives as a validation-layer constant shared between client-side
  selects and server-side validation. Changing it is an additive, reviewed
  change — not runtime user input.
- `profiles.interests` holds zero or more values from this list;
  `activities.category` and `opportunities.category` hold exactly one.

## How a student is restricted to their own private records

Every student-owned table (`profiles`, `activities`, `achievements`,
`saved_opportunities`, `applications`) carries a non-null `user_id` that equals
`auth.users.id`. RLS policies compare that column against the server-verified
JWT subject:

```sql
-- Illustrative pattern only — executed in the schema phase, per table.
CREATE POLICY "owner_full_access"
  ON activities FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

- `USING (auth.uid() = user_id)` makes foreign rows invisible and untouchable,
  regardless of what the application requests.
- `WITH CHECK` prevents writing a row that claims another owner, so a client
  cannot create or move data into someone else's account.
- There are no exceptions for admins on student data; no role can read another
  student's activities, achievements, or applications.
- The browser client (`src/lib/supabase/client.ts`) runs with the user's own
  JWT, so every query is automatically scoped; the server client uses the
  forwarded user session the same way. The service-role key is never used in
  application code, so no code path bypasses RLS.
- Direct API access without a valid JWT yields an empty result set, not an
  error — the default-deny posture means leaked identifiers are not enough.

## How public or curated opportunities are managed

- **MVP access model (locked):** the landing/marketing page is public; the
  student dashboard and opportunity finder require authentication. Published
  opportunities are readable only by authenticated students through the
  authenticated application flow — the catalog is **not** publicly readable
  in the MVP. Draft and archived rows remain hidden from students, and admin
  access is separately protected (see "How admin permissions will be
  enforced server-side").
- The catalog is **curated, not user-generated**: only admins can create or
  edit opportunities. Students interact only by reading published rows,
  saving them, applying, and reporting.
- `status` drives visibility: `draft → published → archived`.
  - `draft`: invisible to students, visible to admins — used for preparing
    listings (including bulk-pasted ones) before release.
  - `published`: readable only by authenticated students through the
    authenticated application flow; anonymous access returns nothing.
  - `archived`: hidden from students, retained for history and reporting.
- Admin writes go through a dedicated, server-validated admin surface (see
  ARCHITECTURE.md, "Admin dashboard (future)"). Students never receive write
  capability on this table in any policy.
- Curated quality over quantity: because listings are admin-entered, the
  MVP needs no scraping, no ingestion pipelines, and no automated verification
  — which also keeps the external-URL attack surface small.

## How admin permissions will be enforced server-side

1. **The database is the authority.** Admin capability is expressed as RLS
   policies on `admin_roles` and on admin-managed tables (e.g. an
   `EXISTS` subquery on `admin_roles` for the current `auth.uid()`). A student
   cannot forge it by editing their profile or JWT claims.
2. **Server components/actions re-check.** Every admin page and server action
   independently queries `admin_roles` for the caller's user id before
   rendering or mutating. Defense in depth: even if a route were exposed, the
   database would refuse unauthorized writes.
3. **No client-side gating only.** Hiding admin UI in the browser is UX, not
   security; the checks above run regardless of the client.
4. **No service-role bypass.** The admin surface uses the caller's own
   session. Service-role code exists only in tightly scoped, audited
   maintenance scripts, if ever.
5. **Auditable grants.** `granted_by`/`granted_at` make admin grants
   traceable; grants are made by existing admins, and the first admin is
   seeded by migration rather than a self-service path.

## Future Row Level Security strategy

Applied in the schema phase, one migration per coherent unit, in this order:

1. Enable RLS on every table at creation time (`CREATE TABLE ... ENABLE ROW
   LEVEL SECURITY` semantics via `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
   immediately after) — tables are never briefly public.
2. Create policies in the same migration as their table, with explicit
   `USING`/`WITH CHECK` clauses per operation:
   - owner tables: `auth.uid() = user_id` for all operations;
   - `opportunities`: authenticated-student SELECT restricted to
     `status = 'published'` (the policy requires `auth.uid() is not null` —
     no anonymous read); admin SELECT/INSERT/UPDATE via
     `EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())`;
   - `admin_roles`: owner-read; writes restricted to existing admins;
   - `opportunity_reports`: authenticated INSERT on published opportunities,
     reporter/admin SELECT, admin UPDATE.
3. Deny-by-default everywhere: no `USING (true)`, no permissive catch-alls,
   no "temporary" anonymous access. If a table has no policy, no one can
   access it — the desired default.
4. **Testing gate:** before any RLS migration is declared done, run an
   assertion script as two test users (student and admin) verifying:
   - a student cannot read, update, or delete another student's rows;
   - a student cannot read draft/archived opportunities;
   - a non-admin cannot write to `opportunities` or resolve reports;
   - an admin can perform exactly the intended admin operations.
   Supabase advisors are then run to catch missing-policy regressions.
5. Policies are reviewed with `get_advisors` (security advisor) after every
   migration, and findings are fixed before the next one.

## Migration strategy

- **Tooling:** SQL migrations kept in version control under `supabase/migrations/`
  (executable via the Supabase CLI against the linked project). Ad-hoc
  dashboard SQL edits are not part of the workflow; everything that touches the
  database lives in a reviewable, re-runnable file.
- **Ordering:** each migration is numbered, additive, and shipped with its
  policies, indexes, and down-notes. Example sequence:
  1. `0001_profiles.sql` — profiles + policies (no auth trigger; the profile
     row is created by the server-side onboarding flow)
  2. `0002_activities_achievements.sql`
  3. `0003_opportunities_admin_roles.sql` (tables + RLS + seeded first admin)
  4. `0004_saved_applications_reports.sql`
- **No destructive operations.** No `DROP TABLE`, `DROP COLUMN`, or type
  narrowing on existing data without an explicit, user-approved plan. The MVP
  is greenfield, so destructive paths should never arise; if they do, they get
  their own review.
- **Verification per migration:** run the RLS assertion script, run the
  security advisor, and only then proceed to the next migration.
- **Rollback philosophy:** because destructive operations are avoided, rollback
  is "revert the migration file before it ships"; once shipped, corrections are
  new additive migrations.

## Privacy review: sensitive data minimized

Reviewed against the planned schema:

- **No age or birthdate.** Grade level is a coarse band, and only where a
  feature needs it (eligibility filters). Nothing computes or stores an age.
- **No location.** No address, no city, no GPS coordinates. Eligibility that
  is location-based in the real world stays free-form text in
  `opportunities.eligibility` for the student to read, not structured student
  location data.
- **No school identity, no parent contacts, no phone numbers** in the MVP.
- Free-text fields (`description`, `notes`, `interests`) are student-authored;
  students should be reminded at onboarding not to enter more than needed.
  No system feature nudges them to.
- These choices are deliberate rejections, not omissions: any future proposal
  to add birthdate, location, or school identity must update this document
  with the feature that requires it and the justification.

## Locked MVP Decisions

These decisions are settled before Phase 1 and are fixed inputs to the
schema work. Changing any of them is a deliberate, documented revisit — not
a casual edit.

1. **Profile creation uses server-side onboarding, not an auth trigger.**
   Sign up → authenticated session → onboarding → server-side profile
   creation → dashboard. The onboarding operation can only create or update
   the authenticated user's own profile; RLS (`auth.uid() = id`) remains the
   ultimate security boundary.
2. **Interests and categories use the controlled shared category taxonomy**
   (see "Category taxonomy"). Students select from the list; `Other` covers
   edge cases. No free-tag category creation, no separate category table.
3. **Multiple applications for the same opportunity are allowed.** No unique
   constraint on `(user_id, opportunity_id)`; each application carries its
   own `id`. `opportunity_id` stays nullable for off-catalog tracking.
4. **Application status includes `withdrawn`**:
   `planned | in_progress | submitted | accepted | rejected | withdrawn`;
   lifecycle `planned → in_progress → submitted →
   accepted/rejected/withdrawn`. The database does not enforce transition
   sequencing; the application UI controls reasonable transitions.
5. **The dashboard and opportunity finder require authentication.** Only the
   landing/marketing page is public.
6. **Published opportunities are not publicly readable.** The catalog is
   readable only by authenticated students through the authenticated
   application flow; drafts and archived rows stay hidden from students.
7. **RLS remains the database security boundary.** Every table ships with
   RLS enabled and explicit policies; no application-level trust replaces
   it.
8. **No service-role key is used in application runtime.** Only the
   publishable key is configured; any future service-role use is limited to
   tightly scoped, audited maintenance scripts.
9. **No student-to-student data access exists.** Student-owned rows are
   visible only to their owner; admins get no exceptions on student data.

All three decisions previously listed as "open" (profile creation,
taxonomy, application uniqueness) are resolved by items 1–3 above.
