# UI Component System

The design system for the Extracurricular Dashboard. Tokens live in
`src/app/globals.css`; primitives in `src/components/ui/`; the mascot in
`src/components/mascot/`. The UX contract behind every rule here is
`PHASE_1_UX_PLAN.md` (especially §13 accessibility and §15 mascot rules) and
the full specification is `PHASE_1_DESIGN_SYSTEM.md` (repo root).

## Conventions

- **Server Components by default.** Only primitives that need interactivity
  carry `"use client"`: Checkbox, Dialog, DropdownMenu, Tabs, Tooltip,
  Toaster, Fade. Everything else is a plain server component — import freely
  in server pages.
- **`cn()` for all class composition** (`@/lib/utils`): clsx conditionals +
  tailwind-merge so caller classes always win over defaults.
- **Tokens, not colors.** Consume `bg-surface`, `text-body`, `border-line`,
  `text-danger`, etc. Raw palette classes (zinc/gray/etc.) are banned.
- **Forms:** pair Input/Textarea/Select with a programmatic `<label>`, and
  pass `aria-invalid` on validation failure; the primitive styles the error
  state from that alone. Error text is described below.

## Components

| Component | Import | Client | Notes |
|---|---|---|---|
| Button / ButtonLink | `@/components/ui/button` | no | variants: primary · accent · outline · ghost · danger; sizes: sm · md · lg · icon |
| Card family | `@/components/ui/card` | no | Card, CardHeader, CardBody, CardTitle, CardDescription |
| Badge | `@/components/ui/badge` | no | variants: neutral · accent · outline · success · warning · danger — text carries meaning, color decorates |
| Input / Textarea / Select | `@/components/ui/{input,textarea,select}` | no | native controls (Select uses the `--select-arrow` token); error styling via `aria-invalid` |
| Checkbox | `@/components/ui/checkbox` | yes | Radix; used for interest chips (real checkboxes, per UX plan §13) |
| Dialog | `@/components/ui/dialog` | yes | Radix modal; focus trap, Esc, scroll lock; use DialogHeader/Title/Description/Footer |
| DropdownMenu | `@/components/ui/dropdown-menu` | yes | Radix menu for avatar menu, row actions |
| Tabs | `@/components/ui/tabs` | yes | Radix; pill styling; finder Browse/Saved, settings nav |
| Tooltip | `@/components/ui/tooltip` | yes | hover-only hints; never the only source of info (touch) |
| Toaster | `@/components/ui/toaster` | yes | sonner host, mounted in root layout; pages call `toast()` from `sonner` |
| Avatar | `@/components/ui/avatar` | no | initials chip; no image collection (least-data) |
| Skeleton | `@/components/ui/skeleton` | no | draw the *shape* of incoming content |
| EmptyState | `@/components/ui/empty-state` | no | mascot empty states; moods: happy (default) / thinking / oops |
| ErrorState | `@/components/ui/error-state` | no | mascot "oops" + blame-free copy + retry slot |
| LoadingState | `@/components/ui/loading-state` | no | spinner surface for unknown layouts |
| Spinner | `@/components/ui/spinner` | no | sm/md/lg inline loading |
| Progress | `@/components/ui/progress` | no | onboarding step dots (progressbar role) |
| Fade | `@/components/ui/fade` | yes | the only entrance-animation wrapper; `motion="rise" \| "fade" \| "pop"`, stagger via `index` |

## Motion conventions

Three named presets via `Fade` (`src/components/ui/fade.tsx`):

- `rise` — card/list appearance (6px rise + fade, 200ms)
- `fade` — panels/tab switches (150ms)
- `pop` — confirmations: saved opportunity, completed step (240ms, 4% scale)

Rules: ≤ 2 animated groups per screen; list stagger ≤ 40ms/item; everything
is suppressed under `prefers-reduced-motion` (`useReducedMotion` in `Fade`);
never animate layout-critical structure. Full rules in
`PHASE_1_DESIGN_SYSTEM.md`.

## Mascot

`LightbulbMascot` (`src/components/mascot/lightbulb-mascot.tsx`) — static
SVG, moods `happy | thinking | oops`. Max one mascot moment per screen,
never inside tables/forms. Full usage rules: PHASE_1_UX_PLAN.md §15.
