function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export const config = {
  openaiApiKey: requireEnv("OPENAI_API_KEY"),
  openrouterApiKey: requireEnv("OPENROUTER_API_KEY"),
  openrouterModel: optionalEnv("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
  chromaHost: optionalEnv("CHROMA_HOST", "localhost"),
  chromaPort: optionalEnv("CHROMA_PORT", "8000"),
  apiPort: parseInt(optionalEnv("API_PORT", "8080")),
  frontendUrl: optionalEnv("FRONTEND_URL", "http://localhost:3000"),
  ragTopK: parseInt(optionalEnv("RAG_TOP_K", "5")),
  maxTokens: parseInt(optionalEnv("MAX_TOKENS", "1024")),
  // Rate limiting
  chatRateLimit: parseInt(optionalEnv("CHAT_RATE_LIMIT", "10")),
  searchRateLimit: parseInt(optionalEnv("SEARCH_RATE_LIMIT", "20")),
  rateLimitWindowMs: parseInt(optionalEnv("RATE_LIMIT_WINDOW_MS", "60000")),
} as const;
