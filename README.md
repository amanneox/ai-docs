# AI Docs

A collaborative documentation platform with AI support and MDX capabilities, built with Next.js and shadcn/ui.

## Features

### 📝 Collaborative Editing
- **Real-time collaboration** powered by Liveblocks
- See who's currently editing with live cursors
- Conflict-free concurrent editing using Yjs

### 🤖 AI Writing Assistant
- **OpenAI GPT-4** integration for content generation
- Improve writing, summarize, and expand content
- Generate ideas and get writing suggestions

### 💻 MDX Support
- Write documentation with MDX
- Syntax highlighting for 50+ programming languages
- Support for React components within documents

### 🎨 Modern UI
- Built with **shadcn/ui** components
- Clean, minimal interface inspired by Notion-style editors
- Dark mode support
- Responsive design

### 🔐 Authentication
- Secure authentication with **Clerk**
- Support for email/password and social providers
- Granular access control

### 📁 Document Management
- Hierarchical document structure
- Full-text search
- Document organization with folders

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Editor:** BlockNote (based on Tiptap/ProseMirror)
- **Collaboration:** Liveblocks, Yjs
- **AI:** OpenAI GPT-4o-mini
- **Auth:** Clerk
- **Database:** PostgreSQL with Prisma ORM

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Clerk account
- Liveblocks account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/notion-docs.git
cd notion-docs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Fill in your environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From Clerk dashboard
- `CLERK_SECRET_KEY` - From Clerk dashboard
- `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` - From Liveblocks dashboard
- `LIVEBLOCKS_SECRET_KEY` - From Liveblocks dashboard
- `OPENAI_API_KEY` - From OpenAI dashboard

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
notion-docs/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── main/              # Main application layout
│   ├── marketing/         # Landing page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Root page
├── components/
│   ├── collaboration/     # Liveblocks/Yjs components
│   ├── editor/            # BlockNote editor components
│   ├── mdx/               # MDX components
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── prisma/                # Database schema
├── types/                 # TypeScript types
└── README.md
```

## Key Features Explained

### Real-time Collaboration

The platform uses Liveblocks for real-time collaboration, with Yjs providing conflict-free concurrent editing. Each document is a separate "room" where users can:
- See each other's cursors in real-time
- Edit content simultaneously without conflicts
- Track who is currently viewing/editing

### AI Writing Assistant

The AI assistant integrates with OpenAI's GPT-4o-mini to provide:
- **Improve Writing**: Makes text more professional and clear
- **Summarize**: Creates concise summaries of content
- **Expand**: Adds details and examples to content
- **Generate Ideas**: Brainstorms relevant topics

### MDX Support

MDX allows embedding React components and JSX within Markdown:

```mdx
# Welcome to My Document

Here's a code example:

\`\`\`tsx
function Hello() {
  return <div>Hello World</div>
}
\`\`\`

And here's a custom component:

<MyComponent prop="value" />
```

## API Routes

### Documents
- `GET /api/documents` - List all documents
- `POST /api/documents` - Create a new document
- `GET /api/documents/:id` - Get a specific document
- `PATCH /api/documents/:id` - Update a document
- `DELETE /api/documents/:id` - Delete (archive) a document

### AI
- `POST /api/ai/generate` - Generate content using AI

### Collaboration
- `POST /api/liveblocks-auth` - Authenticate with Liveblocks

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [BlockNote](https://www.blocknotejs.org/) for the editor
- [Liveblocks](https://liveblocks.io/) for real-time collaboration
- [Clerk](https://clerk.dev/) for authentication
- [OpenAI](https://openai.com/) for the AI capabilities

---

Built with ❤️ using Next.js and shadcn/ui
