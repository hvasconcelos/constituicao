import { createOpenAI } from "@ai-sdk/openai";
import { config } from "./config";

// Initialize the OpenRouter client using the OpenAI-compatible API.
// - baseURL: Points to the OpenRouter API endpoint (OpenAI-compatible).
// - apiKey: Pulled from validated environment variables (OPENROUTER_API_KEY).
export const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.openrouterApiKey,
});

// Helper function to obtain an LLM model instance configured via env.
// - Uses the model name from OPENROUTER_MODEL (default: gpt-4o-mini)
// - Returns a function bound to the selected model, ready for chat/completions.
export function getModel() {
  return openrouter(config.openrouterModel);
}
