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
  authenticated user, created automatically on signup (trigger or server-side
  onboarding step — decided at implementation).
- **Ownership:** The single user referenced by `id`. Never writable by other
  students.
- **Important fields:**
  - `id uuid PK` — equals `auth.users.id` (1:1, not a separate surrogate key)
  - `display_name text` — optional, self-chosen
  - `grade_level text` — coarse band (e.g. "9", "10", "11", "12", "other");
    stored instead of birthdate or age
  - `interests text[]` — free/self-reported tags used by recommendations
  - `preferences jsonb` — future matching preferences (e.g. preferred
    activity types), kept schema-flexible
  - `created_at timestamptz`, `updated_at timestamptz`
- **Future security requirements:** RLS enabled; SELECT/UPDATE restricted to
  `auth.uid() = id`; no INSERT by clients other than the owner's signup flow;
  no DELETE (account deletion handled out of scope, via support flow).
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
  - `category text` — self-reported taxonomy (e.g. sports, music, service)
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
  - `category text` — taxonomy shared with `activities.category` and
    `profiles.interests` for rule-based matching
  - `eligibility text` — free-form eligibility notes
  - `min_grade_level text NULL` / `max_grade_level text NULL` — coarse bands,
    matching the profile field; enables basic filters without collecting age
  - `deadline date` — application deadline
  - `link text NOT NULL` — external URL
  - `status text NOT NULL DEFAULT 'draft'` — `draft | published | archived`
  - `created_at timestamptz`, `updated_at timestamptz`
- **Future security requirements:** RLS enabled with two distinct policies:
  students may SELECT only `status = 'published'` rows; admins may SELECT all
  and INSERT/UPDATE (no client DELETE — archiving only). Drafts are never
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
    `planned | in_progress | submitted | accepted | rejected`
  - `deadline date` — editable snapshot; the catalog deadline may change
  - `notes text`
  - `created_at timestamptz`, `updated_at timestamptz`
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

- The catalog is **curated, not user-generated**: only admins can create or
  edit opportunities. Students interact only by reading published rows,
  saving them, applying, and reporting.
- `status` drives visibility: `draft → published → archived`.
  - `draft`: invisible to students, visible to admins — used for preparing
    listings (including bulk-pasted ones) before release.
  - `published`: selectable by any authenticated student.
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
   - `opportunities`: student SELECT restricted to `status = 'published'`;
     admin SELECT/INSERT/UPDATE via `EXISTS (SELECT 1 FROM admin_roles WHERE
     user_id = auth.uid())`;
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
  1. `0001_profiles.sql` — profiles + trigger/policy
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

## Open decisions (to resolve in the schema phase)

- Onboarding profile creation: database trigger on `auth.users` insert vs.
  explicit server-side creation in the onboarding flow.
- Exact interest/category taxonomy: a fixed enum-like list (better for
  matching) vs. free tags (better for flexibility).
- Whether `applications` gets a unique constraint per (user, opportunity) or
  allows multiple applications over time (e.g. annual programs).
