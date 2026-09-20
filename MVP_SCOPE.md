# MVP Scope — Extracurricular Dashboard

This document is the scope contract for the MVP. Features are added to
"includes" only by updating this file with the same care as code.

## Included (MVP)

| Feature | Description |
|---|---|
| Student onboarding | Sign up / sign in, create profile, set interests and preferences |
| Profile and preferences | Edit display name, grade band, interests, matching preferences |
| Dashboard | Personal overview: upcoming deadlines, recent activities, quick links |
| Activity tracking | Create, edit, and review extracurricular activities with hours and dates |
| Achievement tracking | Record awards, certifications, and results, optionally linked to activities |
| Curated opportunity finder | Browse the admin-curated catalog of published opportunities |
| Search and basic filters | Text search plus category and grade-band filters |
| Saved opportunities | Bookmark opportunities for later |
| Application and deadline tracking | Track application status (planned → submitted → outcome) and deadlines |
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
