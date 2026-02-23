// Import core server libraries and middleware
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { rateLimiter } from "hono-rate-limiter";
import { config } from "./lib/config"; // Loads validated environment/config values

// Import API route handlers
import chat from "./routes/chat";
import health from "./routes/health";
import search from "./routes/search";

// Initialize the Hono app
const app = new Hono();

// Enable request logging for all routes
app.use("*", logger());

// Enable CORS for all origins defined in config.frontendUrl
app.use(
  "*",
  cors({
    origin: config.frontendUrl, // Only allow frontend URL
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    exposeHeaders: ["X-Sources"], // Expose vector source info for frontend
  }),
);

// Add rate limiting to the /api/chat endpoint
// Defaults to 10 requests/minute/IP (can be configured in .env)
app.use(
  "/api/chat",
  rateLimiter({
    windowMs: config.rateLimitWindowMs,
    limit: config.chatRateLimit,
    // Use X-Forwarded-For header as rate limiting key, fallback to x-real-ip or "unknown"
    keyGenerator: (c) =>
      c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown",
  }),
);

// Add rate limiting to the /api/search endpoint
// Defaults to 20 requests/minute/IP (can be configured in .env)
app.use(
  "/api/search",
  rateLimiter({
    windowMs: config.rateLimitWindowMs,
    limit: config.searchRateLimit,
    keyGenerator: (c) =>
      c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown",
  }),
);

// Mount main route handlers
app.route("/api/chat", chat); // Handles RAG chat POST requests and streaming
app.route("/api/search", search); // Handles semantic search requests
app.route("/api/health", health); // Simple health check endpoint

// Print to console when server starts, with configured port
console.log(`API server running on port ${config.apiPort}`);

// Export Bun server config for deployment
export default {
  port: config.apiPort, // Port for Bun to listen on
  fetch: app.fetch, // Hono fetch handler
  idleTimeout: 120, // Idle server shutdown (seconds)
};
