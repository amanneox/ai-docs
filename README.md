# AI Docs

AI-powered note-taking app built with Next.js.

## Features

- **Block-based editor** - Write notes with headings, lists, code blocks
- **AI Assistant** - Improve writing, summarize, expand text (powered by Google Gemini)
- **Auto-save** - Documents save automatically to Postgres
- **Dark mode** - Clean, minimal interface

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- BlockNote editor
- Prisma + PostgreSQL
- Clerk authentication
- Google Gemini for AI features
- Tailwind CSS

## Getting Started

1. Clone and install:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your keys:
- [Clerk](https://clerk.dev) - Authentication (required)
- [PostgreSQL](https://www.postgresql.org) - `DATABASE_URL` for a running Postgres instance (required)
- [Google Gemini](https://aistudio.google.com/apikey) - `GEMINI_API_KEY` for AI features (optional; free tier available). Without it, AI features run in demo mode.

3. Set up the database schema:
```bash
npm run db:push
```

4. Run:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for the full list of variables.

## Docker deployment

Docker Compose does not require an `.env` file. Export the variables in the
shell or configure them in the deployment platform, then build and start the
services:

```bash
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
export CLERK_SECRET_KEY=sk_test_...
export NEXT_PUBLIC_APP_URL=https://example.com
export GEMINI_API_KEY=...

docker compose up --build -d
```

`NEXT_PUBLIC_*` variables are passed at image build time and are embedded in
the browser bundle. Secret variables are passed only to the running container.
`GEMINI_API_KEY` is optional; without it, AI features use demo mode.
`DATABASE_URL` is auto-configured to the bundled `db` service under Docker
Compose, so you don't need to set it.
