# Phase 1 Design System — Extracurricular Dashboard

Status: **frontend design system, implemented.** This document records the
tokens, primitives, motion vocabulary, and tooling decisions that Phase 1
screens are built on. It implements the UX contract in `PHASE_1_UX_PLAN.md`
(especially §13 accessibility and §15 mascot rules) and preserves the Phase 0
warm/light direction.

Product feel (from the Phase 1 brief): warm · clean · modern ·
student-friendly · calm · intelligent · lightweight · approachable — never
corporate-SaaS, never childish, no gradient/glassmorphism noise.

---

## 1. Tooling decisions (installed and why)

Inspected `package.json` first: before this phase it held only the framework
(Next 16.3.5, React 19.2.8), Supabase clients, and dev tooling (Tailwind v4,
ESLint, TypeScript) — **zero UI libraries**, so nothing overlapped.

| Package | Purpose | Why this one |
|---|---|---|
| `clsx` + `tailwind-merge` | Class composition | The standard pair: conditional classes plus Tailwind conflict resolution, so caller classes reliably override component defaults. Tiny, zero deps. |
| `class-variance-authority` | Typed variants | Keeps Button/Badge variants as data, not class soup; the shadcn/ui pattern without pulling in the whole generator. |
| `lucide-react` | Icons | Single consistent 24px stroke set, tree-shaken (only imported icons ship), MIT. Used sparingly (checkbox check, dialog close, save bookmark, nav). |
| `@radix-ui/react-{dialog,dropdown-menu,tabs,tooltip}` | Accessible behavior | Radix ships the hard a11y (focus trap, keyboard, ARIA, scroll lock); we style the surface. Exactly the shadcn/ui approach — adopted per-primitive instead of running the shadcn CLI, so only what we use is installed. |
| `sonner` | Toasts | One 6 kB-ish host with promise/success/error semantics and clean React 19 support; replaces hand-rolling a11y toasts. |
| `motion` | Animation | The maintained `motion/react` entry (Framer Motion successor), used **only** through the `Fade` wrapper with `useReducedMotion` gating — not a heavy framework in practice here. |
| `tw-animate-css` | CSS animations | The Tailwind v4 successor to `tailwindcss-animate`; tiny CSS-only utilities that power Radix `data-[state]` enter/exit without JS. |

Deliberately **not** installed: MUI, Bootstrap, Chakra, any second component
library (would overlap Radix/our primitives), carousels, charts (no chart
feature in MVP scope), AI UI kits, framer-motion (superseded by `motion`),
no icon bundles beyond lucide. Per the brief, nothing enters unless a real
MVP requirement needs it.

Dependency count added: **13 runtime packages**, none heavyweight, all
composable. `@supabase/supabase-js` remains the only not-yet-imported
dependency (documented in PHASE_0_STATUS.md as intentional — it backs typed
clients later in Phase 1).

## 2. Styling architecture

```
src/app/globals.css        ← tokens (@theme inline), focus ring, dark scheme
src/lib/utils.ts           ← cn() = clsx + tailwind-merge
src/components/ui/         ← primitives (README.md documents each)
src/components/mascot/     ← Lumo (static SVG, 3 moods)
src/app/layout.tsx         ← fonts, chrome, <Toaster/> host
```

- **Tailwind v4 is kept, not replaced** — the existing setup (PostCSS plugin,
  `@theme inline` token bridge) is extended, never swapped.
- **`cn()` everywhere**: every primitive composes classes through it; callers
  may extend/override any component class.
- **Server-first**: only primitives that genuinely need interactivity are
  client components (Checkbox, Dialog, DropdownMenu, Tabs, Tooltip, Toaster,
  Fade); everything else renders on the server.
- **No CSS-in-JS, no runtime styling** beyond Tailwind classes; styles are
  reviewable in the diff.

## 3. Design tokens

All in `src/app/globals.css` as CSS variables bridged to Tailwind via
`@theme inline`. Components consume token classes (`bg-surface`,
`text-body`, `border-line`) — raw palette classes are banned project-wide.

| Token group | Light | Dark | Used for |
|---|---|---|---|
| `background` / `surface` / `surface-muted` | cream `#faf7f2` / white / `#f4efe7` | `#221e1a` / `#2b2620` / `#332d26` | page, cards, wells |
| `foreground` / `body` / `faint` | warm ink scale | warm ink scale (inverted) | text hierarchy |
`| `accent` / `accent-strong` / `accent-soft` / `accent-glow` | amber `#b45309` / `#92400e` / `#fef3c7` / `#fbbf24` | lighter amber set | primary brand, focus ring, mascot |
| `line` / `line-strong` | warm borders | warm borders | structure |
| `success` / `warning` / `danger` (+ `-soft` fills) | green / amber-700 / red-700 | light-on-dark pairs | feedback (new in this phase: warning pair + dark variants) |

New in this phase: **`warning`/`warning-soft` tokens** (light `#a16207` on
`#fef9c3`; dark `#facc15` on `#3a3115`) — completing the required
background/foreground/muted/primary/secondary/border/card/success/warning/
error/focus token set.

Focus: the Phase 0 two-ring `:focus-visible` rule (accent ring + offset)
remains global; every primitive also declares it explicitly for
predictability. Dark mode stays media-query-based, same warm hue family — it
"already exists cleanly", so it is maintained, not complicated.

## 4. Typography

One sans family (Geist, loaded in the root layout) with a six-level scale.
`font-drawn` (letter-spacing tweak) marks human headings; `font-semibold` is
reserved for titles, never body text.

| Level | Class recipe | Typical use |
|---|---|---|
| Display | `text-3xl sm:text-4xl font-drawn font-semibold tracking-tight` | landing hero, onboarding welcome |
| Heading | `text-xl font-drawn font-semibold tracking-tight` | page titles, card headers |
| Subheading | `text-base font-medium text-body` | section intros |
| Body | `text-sm leading-6 text-body` | paragraphs, list detail |
| Small | `text-sm text-body` (small = body size on mobile; `text-xs` only for badges/meta) | dense lists, meta |
| Caption | `text-xs text-faint` | dates, counts, helper text |

Readability first on mobile: body text is never below 14px, line length is
capped by Container (max-w-5xl), and headings use `font-drawn` sparingly.

## 5. Component inventory

17 primitives live in `src/components/ui/` (full API table in
`src/components/ui/README.md`). Summary with the reasoning that matters:

| Primitive | Basis | Key decisions |
|---| §| ... |
| Button / ButtonLink | hand-built on `cn` + CVA | variants primary/accent/outline/ghost/**danger** (new); sizes sm/md/lg/**icon** (new); 44px touch height at md |
| Card family | hand-built | surface + line border + soft shadow |
| Badge | hand-built on CVA | 6 semantic variants incl. warning/danger; text carries meaning |
| Input / Textarea / Select | native elements | error styling driven by `aria-invalid`; Select uses the `--select-arrow` SVG token (per-scheme arrow color) |
| Checkbox | Radix | real checkbox semantics for taxonomy chips |
| Dialog | Radix | focus trap/Esc/scroll-lock; confirmations (delete, archive) |
| DropdownMenu | Radix | avatar menu, row "more" actions |
| Tabs | Radix | finder Browse/Saved, settings nav |
| Tooltip | Radix | non-essential hints; never sole info source |
| Toaster | sonner | mounted once in root layout; success/gentle confirmations only |
| Avatar | hand-built | initials — no image upload/collection |
| Skeleton | hand-built | shapes match incoming layout (no CLS) |
| EmptyState / ErrorState / LoadingState | hand-built | Lumo empty/error states, spinner fallback |
| Spinner | hand-built | sm/md/lg |
| Progress | hand-built | onboarding 3-dot step indicator, progressbar role |

Nothing here overlaps a second library; Radix pieces were chosen
per-primitive so we don't carry primitives we don't use.

## 6. Motion system

One wrapper, three presets, one rule: **animation is decoration on top of
fully-functional static content.**

| Preset | Timing | Use |
|---|---|---|
| `rise` | 200ms ease-out, 6px rise | card/list appearance |
| `fade` | 150ms | panels, tab switches |
| `pop` | 240ms, 4% scale | saved opportunity, completed onboarding step |

Conventions:

- Applied only via `<Fade motion=... index=...>` (`src/components/ui/fade.tsx`)
  — one entrance-animation API for the app.
- ≤ 2 animated groups per screen; list stagger ≤ 40ms/item (capped at 240ms).
- Hover/focus feedback = `transition-colors` only (already on primitives).
- **`prefers-reduced-motion`: fully respected** — `useReducedMotion()`
  bypasses every preset (content renders static), and the tw-animate-css
  enter/exit utilities are not applied when users ask for less motion via
  the same media query in CSS where relevant.
- Never animate: text the user is reading, form inputs, navigation structure.
- Reserved use cases from the brief: page/panel `fade`, card `rise`, save
  `pop`, onboarding-step `pop`, mascot is static art (reactions are *mood
  changes* between renders — `happy/thinking/oops` — not looping animation).

## 7. Lumo mascot

Unchanged component, now with a documented state contract:

- `happy` — landing hero, onboarding welcome/done, empty states, success
  moments (beside success toasts).
- `thinking` — tips, guidance moments (dashboard first-use checklist,
  "no matching results" hint).
- `oops` — ErrorState, 404, blame-free failure copy.

Hard rules (PHASE_1_UX_PLAN.md §15): max one mascot moment per screen, never
inside tables/forms, no looping animation, no voice/AI-chatbot, no guilt or
fake urgency.

## 8. Spacing, radius, elevation

- Radius scale: `rounded-lg` (cards, inputs, menus) / `rounded-full`
  (buttons, badges, tabs, progress dots) — unchanged from Phase 0.
- Spacing: Tailwind's 4px scale; page rhythm via Container (max-w-5xl) and
  `space-y-*`/`gap-*` (8/12/16/24).
- Elevation: `shadow-sm` (cards), `shadow-md` (menus), `shadow-lg`
  (dialog/toast) — subtle by default, never glow.

## 9. Verification performed

| Check | Result |
|---|---|
| `npm install` | ✅ clean (only the known npm `allow-scripts` notice for `unrs-resolver`, unchanged since Part 1 — informational) |
| `npx tsc --noEmit` | ✅ clean |
| `npm run lint` | ✅ clean |
| `npm run build` | ✅ passes; `/`, `/dashboard`, `/_not-found` static; proxy registered |
| package.json review | ✅ 12 purposeful additions, no overlaps, no banned libraries |
| Token coverage | ✅ full set incl. new warning pair, dark variants, select-arrow |

## 10. Scope guards

- No backend functionality implemented or implied: no data fetching, no auth,
  no migrations, no Supabase changes — this phase only wires primitives.
- The landing page and dashboard placeholder are untouched; screens adopt
  these primitives in later Phase 1 slices.
- Any future dependency must clear the same bar: accessible behavior we
  would otherwise hand-roll, no overlap with what exists.
