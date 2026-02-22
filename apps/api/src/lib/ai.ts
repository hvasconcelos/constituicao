import { createOpenAI } from "@ai-sdk/openai";
import { config } from "./config";

export const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.openrouterApiKey,
});

export function getModel() {
  return openrouter(config.openrouterModel);
}
