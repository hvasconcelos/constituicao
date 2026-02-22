# Constituicao Portuguesa - Chatbot

Chatbot RAG (Retrieval Augmented Generation) sobre a Constituicao da Republica Portuguesa. Faca perguntas sobre a Constituicao e receba respostas fundamentadas nos artigos constitucionais, com citacoes das fontes.

## Arquitetura

```
Browser  -->  Next.js (apps/web)  -->  Hono API (apps/api)  -->  ChromaDB (vector search)
                useChat hook              RAG pipeline            OpenRouter (LLM)
                Tailwind CSS              Vercel AI SDK           OpenAI Embeddings
```

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS 4, `@ai-sdk/react` |
| Backend | Bun, Hono, Vercel AI SDK (`ai` + `@ai-sdk/openai`) |
| Embeddings | OpenAI `text-embedding-3-small` |
| LLM | OpenRouter (modelo configuravel via env) |
| Vector DB | ChromaDB (local) |
| Monorepo | Bun workspaces |

## Estrutura do Projeto

```
constituicao/
├── apps/
│   ├── api/                    # Backend Hono + Bun
│   │   ├── src/
│   │   │   ├── index.ts        # Entrypoint (porta 8080)
│   │   │   ├── routes/
│   │   │   │   ├── chat.ts     # POST /api/chat (RAG streaming)
│   │   │   │   ├── search.ts   # POST /api/search (pesquisa semantica)
│   │   │   │   └── health.ts   # GET /api/health
│   │   │   └── lib/
│   │   │       ├── chroma.ts   # Cliente ChromaDB + query
│   │   │       ├── ai.ts       # Configuracao OpenRouter
│   │   │       ├── prompt.ts   # System prompt
│   │   │       └── config.ts   # Variaveis de ambiente
│   │   └── scripts/
│   │       ├── ingest.ts       # Embedding + armazenamento no ChromaDB
│   │       └── parse-constitution.ts  # Parser do texto da Constituicao
│   └── web/                    # Frontend Next.js
│       └── src/
│           ├── app/            # App Router (layout, page, globals.css)
│           └── components/     # Chat UI components
├── packages/
│   └── shared/                 # Tipos TypeScript partilhados
└── data/
    └── constituicao.txt        # Texto da Constituicao (user-provided)
```

## Pre-requisitos

- [Bun](https://bun.sh/) >= 1.1
- [ChromaDB](https://docs.trychroma.com/) server local
- Chave API do [OpenAI](https://platform.openai.com/) (para embeddings)
- Chave API do [OpenRouter](https://openrouter.ai/) (para o LLM)

## Setup

### 1. Instalar dependencias

```bash
bun install
```

### 2. Configurar variaveis de ambiente

```bash
cp .env.example .env
# Preencher OPENAI_API_KEY e OPENROUTER_API_KEY
```

### 3. Iniciar o ChromaDB

```bash
pip install chromadb
chroma run --port 8000
```

### 4. Colocar o texto da Constituicao

Colocar o ficheiro da Constituicao em `data/constituicao.txt`. O parser espera o formato oficial com marcadores `PARTE`, `TITULO`, `CAPITULO`, `SECCAO` e `Artigo N.o`.

### 5. Ingerir os artigos

```bash
bun run ingest
```

Isto faz o parse do texto, gera embeddings via OpenAI e armazena no ChromaDB.

### 6. Iniciar a aplicacao

```bash
# API (porta 8080) + Frontend (porta 3000) em paralelo
bun run dev

# Ou separadamente:
bun run dev:api
bun run dev:web
```

Abrir [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `POST` | `/api/chat` | Chat RAG com streaming. Body: `{ messages: [{ role, content }] }` |
| `POST` | `/api/search` | Pesquisa semantica. Body: `{ query: string, topK?: number }` |
| `GET` | `/api/health` | Health check com estado do ChromaDB |

## Variaveis de Ambiente

| Variavel | Obrigatoria | Default | Descricao |
|----------|:-----------:|---------|-----------|
| `OPENAI_API_KEY` | Sim | - | Chave API OpenAI (embeddings) |
| `OPENROUTER_API_KEY` | Sim | - | Chave API OpenRouter (LLM) |
| `OPENROUTER_MODEL` | Nao | `openai/gpt-4o-mini` | Modelo LLM no OpenRouter |
| `CHROMA_HOST` | Nao | `localhost` | Host do ChromaDB |
| `CHROMA_PORT` | Nao | `8000` | Porta do ChromaDB |
| `API_PORT` | Nao | `8080` | Porta do servidor API |
| `FRONTEND_URL` | Nao | `http://localhost:3000` | URL do frontend (CORS) |
| `NEXT_PUBLIC_API_URL` | Nao | `http://localhost:8080` | URL da API para o frontend |
| `RAG_TOP_K` | Nao | `5` | Numero de artigos recuperados por query |

## Como Funciona

1. O utilizador faz uma pergunta no chat
2. O backend gera um embedding da pergunta via OpenAI
3. ChromaDB devolve os 5 artigos mais relevantes (pesquisa por similaridade coseno)
4. Os artigos sao injetados no system prompt como contexto
5. O LLM (via OpenRouter) gera uma resposta em streaming, citando os artigos
6. O frontend mostra a resposta com cards das fontes consultadas
