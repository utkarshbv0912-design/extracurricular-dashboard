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

## Project Structure

```
src/
  app/            # App Router pages and layouts
    page.tsx      # Landing page
    dashboard/    # Dashboard (placeholder for now)
  components/     # Shared React components
```

## Roadmap

- [ ] Database integration (Supabase)
- [ ] Dashboard features (activities, hours, achievements)
- [ ] Authentication

## License

Private — all rights reserved.
