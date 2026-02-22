import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { rateLimiter } from "hono-rate-limiter";
import { config } from "./lib/config";
import chat from "./routes/chat";
import search from "./routes/search";
import health from "./routes/health";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: config.frontendUrl,
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    exposeHeaders: ["X-Sources"],
  })
);

// Rate limit chat endpoint: 10 requests per minute per IP
app.use(
  "/api/chat",
  rateLimiter({
    windowMs: 60 * 1000,
    limit: 10,
    keyGenerator: (c) => c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown",
  })
);

// Rate limit search endpoint: 20 requests per minute per IP
app.use(
  "/api/search",
  rateLimiter({
    windowMs: 60 * 1000,
    limit: 20,
    keyGenerator: (c) => c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown",
  })
);

app.route("/api/chat", chat);
app.route("/api/search", search);
app.route("/api/health", health);

console.log(`API server running on port ${config.apiPort}`);

export default {
  port: config.apiPort,
  fetch: app.fetch,
  idleTimeout: 120,
};
