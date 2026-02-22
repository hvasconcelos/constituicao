import { Hono } from "hono";
import { checkConnection } from "../lib/chroma";

const health = new Hono();

health.get("/", async (c) => {
  const chromaOk = await checkConnection();
  return c.json({
    status: chromaOk ? "ok" : "degraded",
    chromadb: chromaOk ? "connected" : "disconnected",
  });
});

export default health;
