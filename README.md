# Extracurricular Dashboard

A Next.js web app for tracking extracurricular activities, hours, and achievements in one place.

Built with [Next.js](https://nextjs.org) (App Router), TypeScript, Tailwind CSS, and ESLint.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file from the example (no real secrets are committed):

```bash
cp .env.example .env.local
```

Then fill in the values in `.env.local`. See `.env.example` for the expected variable names.

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Landing page: `/`
- Dashboard placeholder: `/dashboard`

## Available Scripts

| Command         | Description                                      |
| --------------- | ------------------------------------------------ |
| `npm run dev`   | Start the dev server                             |
| `npm run build` | Create a production build                        |
| `npm run start` | Start the production server                      |
| `npm run lint`  | Run ESLint                                       |
| `npm run check:supabase` | Verify Supabase connectivity (no secrets printed) |

## Supabase

The app connects to an existing Supabase project through `@supabase/ssr` (cookie-based sessions for Next.js App Router).

- Client utilities live in `src/lib/supabase/`:
  - `client.ts` — browser client for Client Components
  - `server.ts` — server client for Server Components, Server Actions, and Route Handlers
  - `proxy.ts` — session refresh helper, wired up in `src/proxy.ts` (Next.js 16's renamed middleware)
- `src/proxy.ts` refreshes Supabase Auth tokens on matched requests.
- Only the **publishable key** is used. No service-role key, database password, or access token appears anywhere in this repository.

### Verify the connection

```bash
npm run check:supabase
```

Prints only reachability status and the Auth server version — never secret values.

## Documentation

- [DATABASE_PLAN.md](./DATABASE_PLAN.md) — proposed schema, ownership, RLS strategy, migration strategy, privacy review
- [ARCHITECTURE.md](./ARCHITECTURE.md) — application layers and their rules
- [MVP_SCOPE.md](./MVP_SCOPE.md) — what the MVP includes and excludes
- [DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md) — Git, security, testing, quality, and scope rules

## Project Structure

```
src/
  app/            # App Router pages, layouts, loading/error/not-found states
    page.tsx      # Landing page
    dashboard/    # Dashboard (placeholder for now)
  components/
    ui/           # Reusable primitives (Button, Card, Container, EmptyState, Spinner)
    mascot/       # Lumo, the lightbulb mascot (inline SVG)
    site-*.tsx    # Shared layout chrome (header, footer)
  lib/supabase/   # Supabase client utilities (browser, server, proxy)
  proxy.ts        # Next.js 16 proxy entry (session refresh)
scripts/
  check-supabase.mjs  # Connection test (no secrets printed)
```

### Design foundation

The visual language lives in `src/app/globals.css` (warm light theme tokens:
`--background`, `--surface`, `--accent`, ...) and in `src/components/ui/`.
Components consume the tokens (`bg-surface`, `text-body`, `border-line`) so the
look stays consistent. "Lumo", the pencil-drawn lightbulb mascot, is a single
SVG component (`src/components/mascot/lightbulb-mascot.tsx`) used on landing,
empty, error, and 404 states.

## Roadmap

- [x] Project foundation (Next.js, TypeScript, Tailwind)
- [x] Supabase client integration
- [ ] Database schema (planned for a later phase)
- [ ] Dashboard features (activities, hours, achievements)
- [ ] Authentication

## License

Private — all rights reserved.
