# Phase 1 UX Plan — Extracurricular Dashboard

Status: **UX architecture only — no screens implemented yet.** This document is
the contract for Phase 1 implementation. Every screen, flow, and state below is
checked against DATABASE_PLAN.md (data + privacy), MVP_SCOPE.md (scope), and
the locked MVP decisions before any code is written.

Product in one line: a student extracurricular dashboard and opportunity coach
— track what you do, discover curated opportunities, and keep applications on
schedule with explainable recommendations.

---

## 0. UX principles

1. **Next action first.** Every screen answers "what should I do next?" before
   showing everything else. The dashboard leads with the single most useful
   action (usually the nearest deadline), not a wall of stats.
2. **Short forms, honest labels.** Forms collect only fields defined in
   DATABASE_PLAN.md, use the exact taxonomy, and say why a field exists.
3. **Calm encouragement.** Lumo (the mascot) supports, never pressures — no
   guilt, streak-shaming, fake urgency, or notification nagging.
4. **Private by default, visibly private.** Ownership is reinforced in copy
   ("Only you can see this") where students might worry about it.
5. **Progressive disclosure.** Defaults are sensible; advanced options (notes,
   preferences) are available but never required.

---

## 1. Public experience

### Landing page (`/`) — public

Rebuilt in Phase 1 from the Phase 0 placeholder, same structure:

| Section | Content |
|---|---|
| Hero | Lumo (happy, large), headline "Keep your extracurriculars — and the opportunities they unlock — in one place", subhead naming the three pillars (track activities & achievements, find curated opportunities, never miss a deadline). Primary CTA **Sign up**, secondary **Sign in**. |
| How it works | 3 numbered cards: 1. Build your profile (grade band + interests) → 2. Track activities and achievements → 3. Get matched with curated opportunities and track applications. |
| Core benefits | Cards: "Explainable matches" (every recommendation says why), "Deadline tracking" (planned → submitted → outcome), "Your data is yours" (records visible only to you). |
| Product explanation | One short paragraph + preview mock of the dashboard (static, no real data). |
| CTA band | Repeated **Sign up** CTA near the footer. |
| Sign in | Header link → `/auth/sign-in`. |
| Sign up | Header button + hero CTA → `/auth/sign-up`. |

Rules:

- No marketing claims about AI coaching or features the MVP excludes.
- No student data, no counts, no testimonials in the MVP (nothing real to
  show yet, and no fake social proof).
- The footer repeats the "private by design" line and links to the in-app
  privacy explainer (see Settings UX).

### Public/private boundary (locked access model)

- Public: `/` and the auth pages only.
- `/dashboard`, `/opportunities/*`, `/activities/*`, `/achievements/*`,
  `/applications/*`, `/settings/*` require an authenticated session.
- `/onboarding` requires authentication but **no profile yet**.
- `/admin/*` requires authentication **and** an `admin_roles` row; nothing
  admin-related renders for students.
- Unauthenticated visits to guarded routes redirect to `/auth/sign-in` with a
  `?next=` param so sign-in returns the student to where they were.
- The opportunity catalog is **never** publicly readable: signed-out visitors
  cannot preview listings, browse, or see counts.

---

## 2. Authentication flow

### Primary flow (locked)

```
Landing → Sign up → Authentication (email confirm if enabled)
        → Onboarding (3 short steps) → Server-side profile creation
        → Dashboard
```

Per the locked decision, the profile row is created by a server action running
with the caller's own session during onboarding — never by an auth trigger.

### Screens

| Route | Purpose | Details |
|---|---|---|
| `/auth/sign-up` | Create account | Email + password. Copy sets expectation: "Next, we'll set up your profile (takes about a minute)." On success → email-verify notice (if enabled) or straight to `/onboarding`. |
| `/auth/verify` | Email confirmation pending | "Check your inbox" state with resend (rate-limited, disabled state shows countdown) and "wrong address? change it" link back to sign-up. |
| `/auth/sign-in` | Sign in | Email + password. On success → `?next=` target or `/dashboard`. |
| `/auth/forgot-password` | Request reset | Email field → always-success copy ("If that email has an account, we've sent reset instructions") to avoid account enumeration. |
| `/auth/reset-password` | Set new password | Reached from email link; password + confirm; invalid/expired token shows a friendly error with a link to request a new email. |
| `/auth/callback` | Route handler | Supabase email-link exchange; redirects onward, shows error state on failure. |
| Sign out | Everywhere | In the header avatar menu and Settings → Account. Ends the session, lands on `/` with a neutral confirmation toast. |

### Authentication error states (shared, no user enumeration)

| Case | Presentation |
|---|---|
| Invalid credentials | "That email and password don't match an account." (never "no such user") |
| Email not confirmed | "Confirm your email first — open the link we sent." + resend |
| Rate limited | "Too many attempts. Try again in a minute." + disabled submit with countdown |
| Weak password | Inline rule feedback while typing (length requirement only; no composition shaming) |
| Network/server error | "We couldn't reach the service. Try again." + Retry button |
| Unknown failure | Generic message + support hint; raw error never shown, logged server-side |

### Loading & disabled states

- Submit buttons show a spinner and become disabled while pending
  (prevents double-submit).
- Auth pages render as static shells instantly; no full-page spinner needed.
- The verify/resend button enters a disabled countdown after each send.

---

## 3. Onboarding flow

**Goal: profile created in about 60–90 seconds.** Collects only the fields
approved in DATABASE_PLAN.md: `display_name`, `grade_level` (coarse band),
`interests` (subset of the taxonomy), and matching `preferences`. Nothing else
— no age, birthdate, home address, precise location, school identity, phone
number, or parent contact.

### Sequence

**Step 1 — Welcome + identity**
- Lumo (happy): "Let's set up your profile."
- Fields: **Display name** (required, what we call you — real name not
  demanded), **Grade band** (single select: 9 · 10 · 11 · 12 · Other — used
  only to filter eligibility; copy says so explicitly).
- Server action creates the profile row here (own-profile only,
  `id = auth.uid()`), so a refresh or abandonment after step 1 is safe: the
  student lands on the dashboard with a "finish setting up" banner and can
  resume at step 2.

**Step 2 — Interests**
- Multi-select chips of the 13 controlled categories (Sports … Other),
  pre-grouped visually, searchable on small screens if needed.
- Copy: "Pick what you're into — we'll use this to find matching
  opportunities." Minimum zero: skipping is allowed (dashboard shows a tip
  later); there is no wrong answer, `Other` always exists.

**Step 3 — Matching preferences (optional)**
- Two short toggles/stores into `preferences jsonb`:
  - **Opportunity types you want** (multi-select: competitions, programs,
    internships, other) — default: all.
  - **Deadline window**: "Only show opportunities closing in ≥ N days"
    (default 14, selectable 7/14/30/any).
- Framed as "you can change these anytime in Settings". Skipping keeps
  defaults.

**Done screen**
- Lumo (happy) + "You're set, {display name}!" → **Go to dashboard**.
- No confetti, no streak counters, no gamified reward.

### Rules

- Progress indicator (3 dots), Back always available; answers persist in
  client state between steps; the single profile-creating write at step 1 and
  updates at steps 2–3 are the only server calls.
- Validation errors are inline and specific (e.g. "Pick a name so we can say
  hello").
- Browser back / refresh mid-flow never loses the profile once step 1
  completed.

---

## 4. Main navigation (information architecture)

### Student IA

```
Dashboard        /dashboard            overview + next actions
Opportunities    /opportunities        finder, detail, saved (tab)
Activities       /activities           list, detail, create/edit
Achievements     /achievements         list, create/edit
Applications     /applications         tracker list, detail, create/edit
Settings         /settings             profile, preferences, privacy, account
```

Decisions:

- **Saved opportunities** is a tab inside Opportunities (`/opportunities?tab=saved`
  rendered as `Saved`), not a sixth top-level item — saving is a mode of the
  finder, and the dashboard still surfaces saves.
- Applications sit at top level (not nested under Opportunities) because
  deadline tracking is a daily-use, standalone concern; applications can
  still be created *from* an opportunity detail.
- The header avatar menu offers Settings and Sign out on every screen.

### Admin IA (fully separate — students never see it)

```
Admin            /admin                       admin overview
                 /admin/opportunities         catalog management
                 /admin/opportunities/new     create
                 /admin/opportunities/[id]    edit / publish / archive
                 /admin/reports               report queue + resolve
```

Admin routes live under their own layout with its own nav; no student route
links to them, no admin link appears in student chrome, and the guard is
server-side (layout + every action) per ARCHITECTURE.md. A student who
navigates to `/admin` by URL gets the ordinary 404 — not an explanation.

### Mascot in navigation

- Header logo: small Lumo mark (static, ~24px) — identity without noise.
- Nowhere else in chrome; mascots belong to moments (see §15), not to
  navigation furniture.

---

## 5. Dashboard UX (`/dashboard`)

Layout order (desktop; single column on mobile in the same priority order):

1. **Welcome area** — "Hi, {display name}" + one-line status ("3 deadlines in
   the next two weeks"). Lumo appears here only when there is a tip (see
   first-use below), otherwise the area is text-only.
2. **Next useful action strip** — the single most urgent item, e.g. "Math
   Olympiad application closes in 4 days — finish it →". Computed from
   applications with the nearest incomplete deadline; hidden when none exist.
3. **Upcoming deadlines** — applications sorted by deadline, status badge per
   row, each linking to the application. Empty state when nothing tracked.
4. **Recommended opportunities** — top 3 rule-based matches with the
   **explainable reason rendered as a badge**: "Matches your interest: Music",
   "For grade 10–12", "Closes soon". "See all" → finder. Recommendations
   always show *why* or are not shown (explainability is a success criterion).
5. **Saved opportunities** — compact list of the most recently saved
   (title + deadline + remove/save-to-application shortcut).
6. **Recent activities** — last 3 edited/created activities with hours;
   "Add activity" shortcut.
7. **Achievement summary** — count by level (school/regional/national/
   international) as quiet stat chips + latest achievement title; link to
   full list.
8. **Quick actions** — persistent row (Add activity · Add achievement · Track
   an application · Find opportunities) also placed in mobile reach (see §12).

### States

| State | Presentation |
|---|---|
| Loading | Route-level skeleton (Phase 0 `loading.tsx` upgraded to match this layout): shimmering card shells, no spinners in cards. |
| First-use (no profile items yet) | Lumo (thinking) + a 3-item "get started" checklist: add your first activity → add an achievement → find your first opportunity. Checklist items check off live. |
| Empty sections | Each section has its own micro empty state (one line + action link), never a dead grey box; the full-page empty state belongs to first-use only. |
| Error (section-level) | The failing section collapses to "Couldn't load — Retry" while the rest of the dashboard renders; a full-page error boundary remains for catastrophic failures. |
| Success | After quick actions, focus returns with a short toast ("Activity saved"). |
| Stale/pending data | Skeletons while streaming; no fake numbers. |

Non-goals here: no leaderboards, no streaks, no comparing students (excluded
by MVP_SCOPE).

---

## 6. Opportunity Finder UX (`/opportunities`)

Reads **published opportunities only** — drafts and archived rows are
unreachable from every student surface (enforced by RLS; the UI assumes it).

### Listing

- Sticky filter bar: **Search** (title/organization/description text match) ·
  **Category** (single-select from the 13 taxonomy values, chips) ·
  **Grade band** (defaults to the student's own band, clearable) ·
  **Deadline** (any / this week / this month / ≥ N days per preference default).
- Result count always visible ("12 opportunities") so filtering feels
  responsive; active filters render as removable chips.
- Cards in a responsive grid (1/2/3 columns per §12).

### Opportunity card

- Title, organization, category badge (taxonomy color-consistent), deadline
  with relative phrasing ("closes in 9 days" / "closes today" — never
  countdown timers or urgency styling), grade band if restricted.
- **Explainable match line** when relevant ("Matches your interests").
- Actions: **Save** (bookmark toggle) · **Details**.
- Status overlays on the card: saved bookmark filled; "Application tracked"
  badge when an application exists for this student + opportunity.

### Opportunity detail (`/opportunities/[id]`)

- Full description, organization, eligibility (free-form text the student
  reads — never parsed into student location/school data), deadline, external
  link.
- Primary action: **Track application** → prefills the application form with
  this opportunity (and the catalog deadline snapshot).
- Secondary: **Save** · **Report a problem**.
- If the student already tracks an application: button becomes
  **View application**, and "Apply again" (secondary) is available — multiple
  applications per opportunity are supported by design.
- External link opens in a new tab with `rel="noopener noreferrer"` and a
  small "external site" affordance.

### Report flow

- Modal from detail: reason radio group (`inaccurate | expired |
  inappropriate | other`) + optional details textarea; submit gives a toast
  ("Thanks — an admin will take a look").
- If the student already has an **open** report on the opportunity, the
  action is disabled with "You've reported this — it's being reviewed."

### States

| State | Presentation |
|---|---|
| Loading | Skeleton cards in the grid; filter bar interactive immediately. |
| Empty (catalog truly empty) | Lumo (thinking): "No opportunities published yet — check back soon." No filters shown as the culprit. |
| No matching results | "Nothing matches these filters." + **Clear filters** action + hint to try `Other` categories. Never shows drafts/archived items or hints they exist. |
| Error | "Couldn't load opportunities — Retry." |
| Saved | Filled bookmark + toast; reflected instantly in the Saved tab and dashboard. |
| Already tracked | "Application tracked" badge; details CTA swaps to View application. |
| Deadline passed | Deadline shown as "closed on {date}"; Track application stays available (students may still want the record), but no urgency styling. |

---

## 7. Activity UX (`/activities`)

Fields (exactly DATABASE_PLAN.md): `title`*, `category` (one taxonomy value),
`description`, `started_on`, `ended_on` (dates), `hours` (number). No
recurring schedules, no locations, no teammates.

- **List** — grouped by status: ongoing (`ended_on` empty) then past, sorted
  by recency; each row shows title, category badge, hours, date range.
  Row tap → detail.
- **Detail** — all fields rendered readably; actions: Edit · Delete ·
  "Add achievement from this activity" (prefills the achievement's optional
  activity link).
- **Create** (`/activities/new`) — short form, single column; hours input
  accepts decimals ("≈ 2.5"); date pickers default started_on = today;
  copy notes hours are self-reported.
- **Edit** (`/activities/[id]/edit`) — same form prefilled.
- **Delete** — confirmation dialog: "Delete '{title}'? This can't be
  undone." Achievements linked to this activity stay but become unlinked
  (schema note: `activity_id` SET NULL — to be confirmed in the schema
  phase). Applications are unaffected.

States: loading skeletons in list; empty state (Lumo happy: "No activities
yet. Add your first one — clubs, sports, volunteering, personal projects all
count.") with Add CTA; success toasts; disabled submit while saving;
inline field errors; privacy line on forms: "Only you can see your
activities."

---

## 8. Achievement UX (`/achievements`)

Fields (exactly DATABASE_PLAN.md): `title`*, `level` (school / regional /
national / international), `awarded_on` (date), `description`,
`activity_id` (optional link to one of the student's own activities).

- **List** — grouped by level, newest first; title, level badge, date,
  linked activity title (clickable).
- **Create/Edit** — same short form; **optional activity relationship** is a
  select limited to the student's own activities ("Link to an activity?
  optional — it helps your dashboard tell the story"), with search when the
  list is long; clearing the select unlinks without deleting anything.
- **Delete** — confirmation dialog; the linked activity (if any) is untouched.

States: empty (Lumo happy: "Add awards, certificates, and results — big or
small."); loading skeletons; success toasts; disabled submit while saving;
inline errors; same privacy line as activities.

---

## 9. Application tracker UX (`/applications`)

Fields (exactly DATABASE_PLAN.md): `opportunity_id` (**nullable** —
off-catalog applications allowed), `status`*, `deadline` (editable snapshot —
catalog deadline may change), `notes`.

### Statuses & lifecycle (locked)

`planned | in_progress | submitted | accepted | rejected | withdrawn`

`planned → in_progress → submitted → accepted / rejected / withdrawn`

- The database does not enforce transition sequences; the **UI controls
  reasonable transitions**: status is a select on detail/edit offering the
  current status plus the sensible next states (forward states, outcome
  states, and `withdrawn` from any pre-outcome state). Outcomes
  (`accepted/rejected/withdrawn`) are presented as terminal — changing away
  from them requires an explicit "Reopen" action (used for re-application
  cycles).
- Status badges use calm, colorblind-safe styling; no red/alarm treatment for
  `rejected`, no celebration animation for `accepted` beyond a toast.

### Multiple applications per opportunity (locked)

- No uniqueness constraint exists; the list **groups by opportunity**, showing
  each application cycle as its own row ("2026 cycle — accepted · 2027 cycle
  — in progress").
- From an opportunity detail: "Track application" always creates a **new**
  application; if one is already tracked, the primary button is
  "View application" and a secondary **"Apply again"** starts a new cycle.
- From the applications list, "Track application" allows picking any
  published opportunity or **"Something else"** (off-catalog: title text
  field instead of a link, `opportunity_id` null).

### Screens

- **List** — sections: "Needs attention" (deadline within the preference
  window, status planned/in_progress) → "Submitted (awaiting outcome)" →
  "Outcomes" (accepted/rejected/withdrawn) → "No deadline". Each row:
  opportunity title (or off-catalog title), status badge, deadline relative
  phrasing, cycle grouping as above.
- **Detail** — status, deadline, notes (editable inline), linked opportunity
  (clickable if in-catalog), created/updated dates; actions: Edit · Change
  status · Delete.
- **Create** (`/applications/new`) — pick opportunity (searchable select of
  published opportunities + "Something else"), status defaults `planned`,
  deadline prefilled from the catalog and editable with an explicit hint
  "This is your own copy — the listing deadline may change".
- **Edit** — same form; status select constrained per lifecycle above.
- **Notes** — free-text, self reminders only; never shown to anyone else.
- **Delete** — confirmation dialog.

States: empty (Lumo thinking: "Tracking applications here keeps deadlines
off your mind. Add your first one, or find an opportunity."); loading
skeletons; per-section empties; error + retry; success toasts; disabled
submit while saving; inline errors.

---

## 10. Settings UX (`/settings`)

Sub-pages under one Settings layout with a quiet side nav (stacked tabs on
mobile):

| Page | Contents |
|---|---|
| `/settings/profile` | Edit `display_name`, `grade_level` (coarse band), `interests` (taxonomy multi-select). Exactly the onboarding fields; grade-band copy repeats the eligibility-only rationale. |
| `/settings/preferences` | Edit matching preferences (opportunity types, deadline window) with their current effect summarized in one line. |
| `/settings/privacy` | **Plain-language privacy page** (no settings to toggle in MVP): what we store (name, grade band, interests, your activity/achievement/application records), what we never store (age/birthdate, home address, precise location, school identity, phone/parent contact), who can see what (only you; admins see opportunity listings and reports, never your private records). Links back to DATABASE_PLAN.md privacy review. |
| `/settings/account` | Email (read-only display), sign out, and a non-destructive placeholder for account deletion ("contact support" line — deletion flow is out of MVP scope; no data is removed anywhere in Phase 1). |

Rules: every form shows success feedback inline; no new personal-data fields
introduced; Settings never exposes roles, tokens, or admin anything.

---

## 11. Admin UX (`/admin` — architecture only, no backend yet)

Separate layout, separate nav, server-side guard on every page and action.
Students must never see admin functionality — no links, no hints, and
non-admin visits render 404.

- **Admin dashboard** (`/admin`) — quiet overview: counts of draft/published/
  archived opportunities, open reports, recently edited listings, quick links
  to the two working areas. No analytics beyond these counts in MVP.
- **Opportunity management** (`/admin/opportunities`) — table of all
  opportunities with status badges (draft/published/archived), deadline,
  category; filter by status; search. Row → edit. **Create** →
  `/admin/opportunities/new`.
- **Create/Edit form** — exactly the DATABASE_PLAN.md fields: title*,
  organization, description, category (taxonomy), eligibility (free text),
  min/max grade band, deadline, external link (validated URL), and a **status
  control**.
- **Publish / Archive** — explicit status actions with confirmation:
  publish ("Students will see this listing") and archive ("Students will no
  longer see this; existing saves and applications keep their records").
  No hard delete from the UI (archiving only, per DATABASE_PLAN.md).
  Drafts show a "preview as admin" affordance but never a student-visible
  URL.
- **Reports** (`/admin/reports`) — queue of open reports: opportunity title,
  reporter (admin-visible), reason badge, details, date. Actions: open the
  opportunity, **Resolve** (marks resolved, optional note), and a shortcut
  **Archive opportunity** from the report when warranted. Resolved reports
  filterable separately.
- Errors/loading follow the same patterns as student surfaces; admin forms
  pass through the same validation layer.

---

## 12. Responsive UX

Mobile is designed first, not shrunk from desktop.

| Breakpoint | Navigation | Layout behavior |
|---|---|---|
| **Mobile** (< 768px) | Top bar: Lumo mark + page title + avatar menu. **Bottom app bar** with the four top destinations — Dashboard · Find · Activities · Applications — plus **More** (sheet: Achievements, Settings, Sign out). Active tab highlighted with `aria-current`. Thumb-reachable (56px bar, 44px+ targets). | Single column everywhere; dashboard sections stack in priority order (§5 ordering is the scroll order); filters collapse into a "Filters" button opening a bottom sheet with a visible active-filter count; forms single-column with full-width inputs; lists become comfortable cards (no cramped tables); quick actions live in the bottom bar area of their screens. |
| **Tablet** (768–1279px) | Top header nav returns (all six items), bottom bar disappears. | Two-column where it earns it (dashboard: main + side rail of deadlines/saves); finder grid 2 columns; forms stay single-column but wider. |
| **Desktop** (≥ 1280px) | Top header nav. | Finder grid 3 columns; dashboard uses the full multi-section layout (§5); settings uses side nav + content; admin uses wide tables. |

Additional rules:

- Content max-width via the existing `Container` (gutters never drift).
- Touch: no hover-only affordances — every hover action has a tap/visible
  equivalent; row actions on mobile move into the detail screen or a sheet.
- The bottom bar never appears on auth/onboarding/landing/admin surfaces;
  admin is desktop-first (usable on tablet, explicitly not optimized for
  phones in MVP).
- Sticky elements (filter bar, header) respect `100dvh` and keyboard
  appearance on mobile; no layout shift when the on-screen keyboard opens.

---

## 13. Accessibility

Baseline: WCAG 2.1 AA. Non-negotiables for every screen:

- **Keyboard navigation** — everything operable by keyboard in DOM order;
  visible skip-to-content link as the first tab stop; modals/sheets trap
  focus, close on Esc, and restore focus on dismiss; list actions are real
  buttons/links (no clickable divs).
- **Focus states** — the Phase 0 two-ring focus token on every interactive
  element; focus never obscured by sticky bars (scroll-margin on targets).
- **Labels** — every input has a programmatic label; icon-only buttons
  (save bookmark, more menu) carry `aria-label`s; the taxonomy chips are
  real checkboxes/switches with text.
- **Form errors** — on submit, an error summary receives focus ("2 fields
  need attention") linking to each field; fields get `aria-invalid` +
  `aria-describedby` messages; errors are specific and human.
- **Color contrast** — ≥ 4.5:1 body text, ≥ 3:1 large text and UI borders
  against their surfaces, verified for both light and dark token sets; status
  is never encoded by color alone (badges carry text).
- **Screen-reader landmarks** — one `<main>`, `<header>`/`<nav>`/`<footer>`
  with labels, `aria-current="page"` on the active nav item (already shipped
  in Phase 0); lists announced as lists; counts in the finder announced
  politely on change (`aria-live="polite"`).
- **Touch targets** — ≥ 44×44px for all interactive elements on touch
  layouts.
- **Reduced motion** — `prefers-reduced-motion: reduce` disables transitions/
  entrance effects; the spinner persists (essential feedback) but nothing
  pulses, bounces, or auto-animates. Lumo is static art in all moods.

---

## 14. UX states matrix

Every major feature ships with these states where applicable. "●" = required
for the feature's first slice; "○" = required before its feature is called
done; "–" = not applicable.

| Feature | Loading | Empty | First-use | Error | Success | Disabled |
|---|---|---|---|---|---|---|
| Auth (sign up/in/reset) | ○ buttons | – | – | ● (§2 table) | ● redirect | ● pending submit |
| Onboarding | ○ step transitions | – | ● is the flow | ● inline | ● done screen | ● pending submit |
| Dashboard | ● skeletons | ○ per-section | ● checklist | ● per-section retry | ● toasts | – |
| Finder | ● skeleton cards | ● no catalog | – | ● retry | ● save toast | ● report-after-open |
| Opportunity detail | ● skeleton | ○ not-found | – | ● retry | ● save/report toasts | ● tracked-state swap |
| Activities | ● list skeleton | ● create CTA | – | ● retry + form | ● toast | ● pending |
| Achievements | ● list skeleton | ● create CTA | – | ● retry + form | ● toast | ● pending |
| Applications | ● list skeleton | ● create CTA | – | ● retry + form | ● status-change toast | ● pending; status limits |
| Settings | ○ form skeleton | – | – | ● inline | ● inline saved | ● pending |
| Admin | ○ table skeleton | ○ empty queue/catalog | – | ● retry + form | ● publish/resolve toasts | ● pending |

Disabled conventions: pending submit buttons show spinner + disabled; rows in
flight show subtle opacity, never blocking the whole list.

---

## 15. Mascot strategy (Lumo)

The Phase 0 SVG component (moods: `happy | thinking | oops`) is the only
mascot asset. It is **encouragement furniture, not a feature**.

Appropriate uses:

| Placement | Mood | Purpose |
|---|---|---|
| Landing hero | happy | Friendly first impression. |
| Onboarding step 1 + done screen | happy | "Let's set up your profile" / "You're set!" |
| Dashboard first-use checklist | thinking | Guides the first actions, disappears once done. |
| Empty states (activities, achievements, applications, finder) | happy/thinking | Makes "nothing here" feel intentional, with one-line guidance + CTA. |
| Helpful tips (single-line, dismissible) | thinking | e.g. "Tip: link achievements to the activity they came from." Max one tip context per screen, remember dismissal. |
| Success moments | happy | Small, alongside the toast — e.g. application submitted. |
| Errors / 404 | oops | Softens failure without blame: "That didn't work — let's try again." |

Hard rules (never):

- **No guilt or pressure**: no streaks, no "you're behind", no missed-deadline
  shaming. Passed deadlines are stated neutrally ("closed on May 3").
- **No manipulative urgency**: no countdown timers, red pulsing deadlines, or
  fabricated scarcity.
- **No excessive animation**: Lumo is static; at most a single gentle
  entrance, disabled under reduced motion. No looping animations, no voice,
  no AI-avatar pretense (voice mascot is excluded from MVP).
- **No clutter**: at most one Lumo moment per screen; never inside data
  tables or forms; never blocks content or interactions.
- **No fake persona claims**: Lumo never pretends to be intelligent or to
  "understand" the student.

---

## 16. Cross-verification

### Against DATABASE_PLAN.md (data contract)

| Screen/flow | Fields used | Conforms |
|---|---|---|
| Onboarding / Settings profile | `display_name`, `grade_level` (coarse band), `interests` (0+ taxonomy values), `preferences` (types, deadline window) | ✅ — nothing beyond the approved four |
| Activities | `title`, `category` (one taxonomy value), `description`, `started_on`, `ended_on`, `hours` | ✅ |
| Achievements | `title`, `level`, `awarded_on`, `description`, optional `activity_id` (own activities only) | ✅ |
| Applications | `opportunity_id` nullable, `status` incl. `withdrawn`, `deadline` snapshot, `notes`; multiple per (user, opportunity) | ✅ |
| Finder | Published opportunities only; category/grade/deadline filters map to plan fields | ✅ |
| Admin | All opportunity fields; draft→published→archived; archive-only (no delete); reports with plan's reason enum | ✅ |
| Profile creation | Server-side during onboarding, own-profile only; no auth trigger | ✅ (locked decision) |
| Auth-gated catalog | Finder/dashboard never render for signed-out users; no public listing counts | ✅ (locked decision) |

### Against MVP_SCOPE.md

- Every included MVP feature has a designed surface (§1–§11); nothing
  designed outside the includes list.
- Excluded features appear nowhere: no payments/premium, no AI coaching copy
  (recommendations are rule-based and explainable), no scraping, no native
  shells, no parent/school portals, no voice mascot (Lumo is static art), no
  automated email (deadline awareness is in-product only), no gamification
  beyond a plain first-use checklist.
- Success criteria map 1:1 to §5 (dashboard), §6 (finder), §9 (tracking),
  §11 (admin curation), §13 (privacy/RLS-visible design).

### Privacy verification (all maintained — none weakened)

- ❌ age ❌ birthdate ❌ home address ❌ precise location ❌ school identity
  ❌ phone number ❌ parent contact — **none appear in any flow, field, copy,
  or placeholder in this plan.** Grade band remains the coarse eligibility
  band; eligibility text is read by students, never parsed into profile data.
- Off-catalog application titles are student-entered free text (their own
  records, their own privacy) — no new data category introduced.
- New privacy-relevant copy added (Settings → Privacy) only *restates* the
  DATABASE_PLAN.md review in student language.

---

## 17. Implementation sequencing (for later parts of Phase 1)

Suggested build order once implementation is approved, each slice shippable:

1. App shell: student layout + nav (top header, mobile bottom bar), guards
   (redirects only — auth itself comes with its slice).
2. Auth screens + onboarding (needs auth backend + `0001_profiles.sql`).
3. Activities (first CRUD slice; proves forms, validation, list states).
4. Achievements.
5. Applications (incl. grouping + status lifecycle).
6. Finder (listing/detail/save/report) — depends on opportunities data.
7. Dashboard assembly + recommendations rendering.
8. Settings + privacy page.
9. Admin surfaces.

Each slice follows the states matrix (§14) before being called done.
