// Helper function to fetch a required environment variable.
// Throws an error if the variable is not set.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Helper function to fetch an optional environment variable.
// Returns the default value if the variable is not set.
function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

// Main configuration object for the API server.
// All config values are loaded from environment variables and validated here.
export const config = {
  // --- API Keys ---
  // OpenAI API key (for embeddings). Required.
  openaiApiKey: requireEnv("OPENAI_API_KEY"),

  // OpenRouter API key (for chat completions). Required.
  openrouterApiKey: requireEnv("OPENROUTER_API_KEY"),

  // --- Model & Vector DB ---
  // OpenRouter model name. Optional, defaults to "openai/gpt-4o-mini".
  openrouterModel: optionalEnv("OPENROUTER_MODEL", "openai/gpt-4o-mini"),

  // Hostname for ChromaDB vector database. Optional, defaults to "localhost".
  chromaHost: optionalEnv("CHROMA_HOST", "localhost"),

  // Port for ChromaDB. Optional, defaults to "8000".
  chromaPort: optionalEnv("CHROMA_PORT", "8000"),

  // --- API & Frontend ---
  // Port for the API server itself. Optional, defaults to 8080.
  apiPort: parseInt(optionalEnv("API_PORT", "8080"), 10),

  // Allowed frontend URL (for CORS). Optional, defaults to local Next.js dev server.
  frontendUrl: optionalEnv("FRONTEND_URL", "http://localhost:3000"),

  // --- RAG/Search ---
  // Top-K (max articles to retrieve in vector search). Optional, defaults to 5.
  ragTopK: parseInt(optionalEnv("RAG_TOP_K", "5"), 10),

  // LLM response token cap. Optional, defaults to 1024.
  maxTokens: parseInt(optionalEnv("MAX_TOKENS", "1024"), 10),

  // --- Rate Limiting ---
  // Max POSTs/minute for /api/chat endpoint. Optional, defaults to 10.
  chatRateLimit: parseInt(optionalEnv("CHAT_RATE_LIMIT", "10"), 10),

  // Max POSTs/minute for /api/search endpoint. Optional, defaults to 20.
  searchRateLimit: parseInt(optionalEnv("SEARCH_RATE_LIMIT", "20"), 10),

  // Rate limit window in ms. Optional, defaults to 60_000 ms (1 minute).
  rateLimitWindowMs: parseInt(optionalEnv("RATE_LIMIT_WINDOW_MS", "60000"), 10),
} as const;
