import { streamText } from "ai";
import { Hono } from "hono";
import { z } from "zod";
import { getModel } from "../lib/ai";
import { queryRelevantArticles } from "../lib/chroma";
import { config } from "../lib/config";
import { buildSystemPrompt } from "../lib/prompt";

// Create a Hono router instance scoped to the /api/chat namespace
const chat = new Hono();

// Zod schema to validate the shape of each message in the conversation
const messageSchema = z.object({
  // Role must be either "user" or "assistant"
  role: z.enum(["user", "assistant"]),
  // Content string, limited to 1000 characters for abuse/cost protection
  content: z.string().max(1000),
});

// Zod schema to validate the body of the chat request: an array of messages (min 1, max 20)
const chatSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
});

// Handle POST requests to "/" — the main chat RAG endpoint
chat.post("/", async (c) => {
  // Parse and validate the incoming JSON request body
  const body = await c.req.json();
  const parsed = chatSchema.safeParse(body);

  // If validation fails, return details as a 400 error
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  // Extract validated conversation history from the request
  const { messages } = parsed.data;

  // Find the last message sent by the user to use as the retrieval query
  // (Reverses to ensure the latest is found, as messages may interleave)
  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === "user");
  if (!lastUserMessage) {
    return c.json({ error: "No user message found" }, 400);
  }

  // Perform semantic search to fetch the most relevant legal articles/sources for the user query
  const sources = await queryRelevantArticles(lastUserMessage.content);

  // Build the system prompt for the LLM, injecting these source articles as additional context
  const systemPrompt = buildSystemPrompt(sources);

  // Use the streaming LLM utility to generate a chat completion,
  // providing the configured model, system prompt, message history, and a token cap
  const result = streamText({
    model: getModel(),
    system: systemPrompt,
    messages,
    maxTokens: config.maxTokens,
  });

  // Return the streaming response to the frontend.
  // Sources (citations/chunks) are sent in the X-Sources header as a URI-encoded JSON string.
  return result.toDataStreamResponse({
    headers: {
      "X-Sources": encodeURIComponent(JSON.stringify(sources)),
    },
  });
});

// Export the Hono router for use in the main API app
export default chat;
