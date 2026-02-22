import { Hono } from "hono";
import { z } from "zod";
import { queryRelevantArticles } from "../lib/chroma";

const search = new Hono();

const searchSchema = z.object({
  query: z.string().min(1).max(500),
  topK: z.number().int().min(1).max(20).optional(),
});

search.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = searchSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const { query, topK } = parsed.data;
  const sources = await queryRelevantArticles(query, topK);

  return c.json({ sources });
});

export default search;
