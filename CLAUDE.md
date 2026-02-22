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

## Code Conventions

- TypeScript everywhere, strict mode
- ESM (`"type": "module"`)
- Shared types imported from `@constituicao/shared`
- API validation with Zod
- All user-facing text in European Portuguese
- Tailwind CSS 4 (imported via `@import "tailwindcss"` in globals.css)
