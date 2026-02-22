# CLAUDE.md

## Project Overview

RAG chatbot for the Portuguese Constitution. Bun monorepo with three packages:

- `apps/api` — Hono server on Bun (port 8080). RAG pipeline: ChromaDB vector search + OpenRouter LLM streaming.
- `apps/web` — Next.js 15 frontend (port 3000). Uses `@ai-sdk/react` useChat hook. Tailwind CSS 4.
- `packages/shared` — Shared TypeScript types (`ConstitutionArticle`, `Source`, etc.)

## Commands

```bash
bun install              # Install all workspace dependencies
bun run dev              # Run API + frontend in parallel
bun run dev:api          # API only (port 8080, watches for changes)
bun run dev:web          # Frontend only (port 3000)
bun run ingest           # Parse constituicao.txt, embed, store in ChromaDB
```

## Architecture

- **RAG flow**: User message → embed query (OpenAI text-embedding-3-small) → ChromaDB cosine search (top-K articles) → inject into system prompt → stream LLM response (OpenRouter)
- **Chunking**: 1 article = 1 chunk. IDs are `artigo-{number}`.
- **Sources**: Returned as `X-Sources` header (URL-encoded JSON) alongside the streaming response. Frontend reads them in `onResponse` and displays as cards.
- **System prompt**: Always in European Portuguese. Instructs the model to cite articles and never fabricate.

## Key Files

- `apps/api/src/routes/chat.ts` — Core RAG endpoint (POST /api/chat)
- `apps/api/src/routes/search.ts` — Semantic search endpoint (POST /api/search)
- `apps/api/src/lib/chroma.ts` — ChromaDB client, `queryRelevantArticles()`
- `apps/api/src/lib/ai.ts` — OpenRouter model config via `@ai-sdk/openai`
- `apps/api/src/lib/prompt.ts` — System prompt builder with article injection
- `apps/api/src/lib/config.ts` — Env var validation (fails fast on missing required vars)
- `apps/api/scripts/parse-constitution.ts` — Parses raw text into structured articles
- `apps/api/scripts/ingest.ts` — Embeds articles and stores in ChromaDB
- `apps/web/src/components/chat.tsx` — Main chat component (useChat hook)
- `apps/web/next.config.ts` — Proxies `/api/*` to the backend via rewrites
- `packages/shared/src/types.ts` — All shared interfaces

## External Services

- **ChromaDB**: Must be running locally (`chroma run --port 8000`). No Docker needed.
- **OpenAI API**: Used only for embeddings (`text-embedding-3-small`). Key: `OPENAI_API_KEY`.
- **OpenRouter**: Used for chat LLM. Model configurable via `OPENROUTER_MODEL`. Key: `OPENROUTER_API_KEY`.

## Abuse Prevention & Cost Controls

Several layers protect against abuse and runaway costs:

- **Rate limiting** (`hono-rate-limiter`): Per-IP limits on `/api/chat` and `/api/search`. Configurable via `CHAT_RATE_LIMIT`, `SEARCH_RATE_LIMIT`, and `RATE_LIMIT_WINDOW_MS` env vars.
- **Input validation**: Message content capped at 1000 chars, conversation history at 20 messages, search queries at 500 chars (Zod schemas in `chat.ts` / `search.ts`).
- **Max tokens**: LLM response capped via `MAX_TOKENS` env var (default 1024).
- **Query cache**: In-memory LRU cache (200 entries, 5-min TTL) in `chroma.ts` skips embedding + vector search for repeated queries.
- **OpenRouter budget**: Set a monthly spending limit at https://openrouter.ai/settings/limits as a hard safety net.

## Code Conventions

- TypeScript everywhere, strict mode
- ESM (`"type": "module"`)
- Shared types imported from `@constituicao/shared`
- API validation with Zod
- All user-facing text in European Portuguese
- Tailwind CSS 4 (imported via `@import "tailwindcss"` in globals.css)

## Design System

Vercel-inspired light theme. Monochrome palette, Geist typography, precise spacing.

### Font
- **Geist Sans** (body) and **Geist Mono** (code/article numbers) via the `geist` npm package.
- Configured as CSS variables `--font-geist-sans` / `--font-geist-mono` in layout.tsx and mapped to Tailwind's `font-sans` / `font-mono` in globals.css `@theme`.

### Color Palette
Use Tailwind `neutral-*` scale exclusively. No brand colors.
- **Background**: `white` (page), `neutral-50` (subtle fills like source chips, hover states)
- **Borders**: `neutral-200` (default), `neutral-300` (hover)
- **Text**: `neutral-950` (primary/headings), `neutral-800` (assistant body), `neutral-500` (secondary/descriptions), `neutral-400` (muted/labels/placeholders)
- **Accent**: `neutral-950` (buttons, user bubbles, avatars, input focus border). No other accent color.

### Component Patterns
- **Buttons**: `bg-neutral-950 text-white hover:bg-neutral-800`. Icon-only where possible (e.g. arrow-up for send). Use `rounded-lg`.
- **Inputs**: `border-neutral-200 focus:border-neutral-950`. No focus ring, just border color change. Use `rounded-lg`, `text-[14px]`.
- **Cards/chips**: `border border-neutral-200 bg-neutral-50 rounded-md`. Inline flex for compact tags (e.g. source citations).
- **Message layout**: User messages right-aligned as black pills (`bg-neutral-950 text-white rounded-2xl`). Assistant messages left-aligned with a small black book-icon avatar (`h-6 w-6 rounded-md bg-neutral-950`) and plain text (no background/border).
- **Empty states**: Centered vertically, staggered `fade-in-up` animation. Suggestion cards in a 2-column grid, clickable.
- **Labels/section headers**: Uppercase, `text-[11px] font-medium tracking-wider text-neutral-400`.

### Animations
Defined as custom keyframes in globals.css `@theme`:
- `animate-fade-in` — simple opacity 0→1 (0.4s)
- `animate-fade-in-up` — opacity + translateY 8px→0 (0.5s). Use `opacity-0` on the element and stagger with `style={{ animationDelay }}`.
- `animate-pulse-dot` — scale/opacity pulse for loading dots (1.4s infinite)

### Icons
Inline SVGs, not an icon library. Stroke-based, `strokeWidth="2"` or `"2.5"`, `strokeLinecap="round"`, `strokeLinejoin="round"`. White stroke on dark backgrounds.
