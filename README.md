# AI Docs

AI-powered note-taking app built with Next.js.

## Features

- **Block-based editor** - Write notes with headings, lists, code blocks
- **AI Assistant** - Improve writing, summarize, expand text
- **Auto-save** - Documents save automatically
- **Dark mode** - Clean, minimal interface

## Tech Stack

- Next.js 14 + React + TypeScript
- BlockNote editor
- Clerk authentication
- Tailwind CSS

## Getting Started

1. Clone and install:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and add your keys:
- [Clerk](https://clerk.dev) - Authentication
- [OpenAI](https://openai.com) - AI features (optional)

3. Run:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for required variables.

## Docker deployment

Docker Compose does not require an `.env` file. Export the variables in the
shell or configure them in the deployment platform, then build and start the
services:

```bash
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
export CLERK_SECRET_KEY=sk_test_...
export NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_dev_...
export LIVEBLOCKS_SECRET_KEY=sk_dev_...
export NEXT_PUBLIC_APP_URL=https://example.com
export GEMINI_API_KEY=...

docker compose up --build -d
```

`NEXT_PUBLIC_*` variables are passed at image build time and are embedded in
the browser bundle. Secret variables are passed only to the running container.
`GEMINI_API_KEY` is optional; without it, AI features use demo mode.
