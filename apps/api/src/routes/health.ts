import { Hono } from "hono";
import { checkConnection } from "../lib/chroma";

// Create a new Hono router for the /api/health endpoint.
const health = new Hono();

// Health check endpoint.
// GET /api/health
// - Checks connection to ChromaDB (vector database).
// - Returns JSON with overall status and ChromaDB connectivity.
//   - { status: "ok" | "degraded", chromadb: "connected" | "disconnected" }
health.get("/", async (c) => {
  // Run connectivity check for ChromaDB.
  const chromaOk = await checkConnection();

  // Build and return health check response.
  return c.json({
    status: chromaOk ? "ok" : "degraded", // Overall health status.
    chromadb: chromaOk ? "connected" : "disconnected", // ChromaDB connectivity.
  });
});

// Export the router for use in main server.
export default health;
