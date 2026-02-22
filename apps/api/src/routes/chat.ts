import { Hono } from "hono";
import { streamText } from "ai";
import { z } from "zod";
import { queryRelevantArticles } from "../lib/chroma";
import { getModel } from "../lib/ai";
import { buildSystemPrompt } from "../lib/prompt";

const chat = new Hono();

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(1000),
});

const chatSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
});

chat.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = chatSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const { messages } = parsed.data;

  // Get the latest user message for retrieval
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMessage) {
    return c.json({ error: "No user message found" }, 400);
  }

  // Retrieve relevant articles
  const sources = await queryRelevantArticles(lastUserMessage.content);

  // Build system prompt with context
  const systemPrompt = buildSystemPrompt(sources);

  // Stream response
  const result = streamText({
    model: getModel(),
    system: systemPrompt,
    messages,
    maxTokens: 1024,
  });

  // Return a data stream response with sources as custom data
  return result.toDataStreamResponse({
    headers: {
      "X-Sources": encodeURIComponent(JSON.stringify(sources)),
    },
  });
});

export default chat;
