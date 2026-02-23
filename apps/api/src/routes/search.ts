import { Hono } from "hono";
import { z } from "zod";
import { queryRelevantArticles } from "../lib/chroma";

// Create a new Hono router scoped to /api/search
const search = new Hono();

// Zod schema for validating search requests
// - "query": required string (min 1, max 500 chars)
// - "topK": optional integer [1, 20], defaults are handled in queryRelevantArticles
const searchSchema = z.object({
  query: z.string().min(1).max(500),
  topK: z.number().int().min(1).max(20).optional(),
});

// POST / — perform a semantic search over the constitution articles
search.post("/", async (c) => {
  // Parse incoming JSON
  const body = await c.req.json();

  // Validate with Zod
  const parsed = searchSchema.safeParse(body);

  // Respond with 400 if validation fails (include Zod error details)
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  // Destructure validated query and (optionally) topK from request body
  const { query, topK } = parsed.data;

  // Run semantic search (calls ChromaDB, potentially uses LRU cache)
  const sources = await queryRelevantArticles(query, topK);

  // Return matching sources as JSON
  return c.json({ sources });
});

// Export the Hono router for /api/search endpoints
export default search;
