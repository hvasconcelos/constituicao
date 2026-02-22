import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
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

app.route("/api/chat", chat);
app.route("/api/search", search);
app.route("/api/health", health);

console.log(`API server running on port ${config.apiPort}`);

export default {
  port: config.apiPort,
  fetch: app.fetch,
};
