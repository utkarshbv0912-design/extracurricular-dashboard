# MVP Scope — Extracurricular Dashboard

This document is the scope contract for the MVP. Features are added to
"includes" only by updating this file with the same care as code.

## Included (MVP)

| Feature | Description |
|---|---|
| Student onboarding | Sign up / sign in (authentication required), then create profile, set interests and preferences |
| Profile and preferences | Edit display name, grade band, interests (selected from the controlled category taxonomy), matching preferences |
| Dashboard | Personal overview: upcoming deadlines, recent activities, quick links. Requires authentication |
| Activity tracking | Create, edit, and review extracurricular activities with hours, dates, and a category from the shared taxonomy |
| Achievement tracking | Record awards, certifications, and results, optionally linked to activities |
| Curated opportunity finder | Browse the admin-curated catalog of published opportunities. Requires authentication — not publicly readable |
| Search and basic filters | Text search plus category and grade-band filters |
| Saved opportunities | Bookmark opportunities for later |
| Application and deadline tracking | Track application status (planned → in_progress → submitted → accepted/rejected/withdrawn) and deadlines; multiple applications for the same opportunity are allowed |
| Basic rule-based recommendations | Deterministic interest/category/eligibility matching with explainable reasons |
| Admin opportunity management | Admin-only create/edit/publish/archive of opportunities; resolve reports |
| Responsive web design | Usable on phone and desktop from one codebase |

## Excluded (not in MVP)

| Feature | Status | Rationale |
|---|---|---|
| Payments | Excluded | No monetization in MVP; avoids compliance burden |
| Premium features | Excluded | Depends on payments |
| Advanced AI coaching | Excluded | MVP recommendations are rule-based and explainable |
| Automated scraping | Excluded | Catalog is hand-curated; scraping adds legal/abuse risk |
| Native mobile apps | Excluded | Responsive web covers mobile use |
| Parent or school portals | Excluded | Additional auth scopes and data sharing; privacy-sensitive |
| Voice mascot | Excluded | Novelty, not core value |
| Automated email notifications | Excluded | Deadline reminders manual/in-product for MVP |
| Complex gamification | Excluded | Simple streaks/badges deferred; no leaderboards comparing students |

## Explicit non-goals during the MVP build

- No age, birthdate, location, school identity, or contact data collection
  (see DATABASE_PLAN.md privacy review).
- No service-role key in application code.
- No RLS bypasses, permissive policies, or disabled security "for now".
- No external AI, payment, map, scraping, or email services.
- No bulk data import in the student-facing product.

## Locked access and data-model decisions

Settled before Phase 1; details and rationale in DATABASE_PLAN.md
("Locked MVP Decisions").

### Authentication

The student-facing dashboard and opportunity finder require authentication.
Only the landing/marketing page is public.

### Categories

The MVP uses the controlled shared category taxonomy defined in
DATABASE_PLAN.md (13 initial categories including `Other`); students select
from the list rather than creating arbitrary categories.

### Applications

Multiple applications for the same opportunity are allowed — no unique
constraint on `(user_id, opportunity_id)`; each application has its own ID.

### Application statuses

`planned | in_progress | submitted | accepted | rejected | withdrawn`, with
lifecycle `planned → in_progress → submitted →
accepted/rejected/withdrawn`. The database does not enforce a strict
transition sequence; the application UI controls reasonable transitions.

### Access model

Landing page is public; all student functionality requires authentication.
Published opportunities are readable only by authenticated students through
the authenticated application flow — never anonymously. Draft and archived
opportunities remain hidden from students, and admin access remains
separately protected.

## Success criteria for the MVP

1. A student can complete onboarding and see a personalized dashboard.
2. Activities, achievements, applications, and saves can be created, edited,
   and viewed — and are visible to no one but their owner.
3. The finder returns published, curated opportunities with working filters.
4. Recommendations are explainable and derived only from permitted data.
5. Admins can fully curate the catalog and resolve reports without touching
   the database directly.
6. RLS assertion checks and Supabase security advisors pass for every
   migration.
