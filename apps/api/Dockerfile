FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN bun install --frozen-lockfile --production

# Build/runtime
FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
COPY data ./data

ENV NODE_ENV=production
EXPOSE 8080

CMD ["bun", "run", "apps/api/src/index.ts"]
