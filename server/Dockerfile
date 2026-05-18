# ─── Build stage ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy and install ALL deps for building
COPY package.json ./
RUN npm install

# Copy source and build
COPY src ./src
COPY tsconfig.json ./
RUN npx tsup src/server.ts src/db/seed.ts --format esm --out-dir dist

# ─── Runtime stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Install production deps only
COPY package.json ./
RUN npm install --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Data directory for SQLite
RUN mkdir -p /app/data && chown -R node:node /app

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_PATH=/app/data/users.db

EXPOSE 3001

USER node

# Seed DB if empty, then start server
CMD ["sh", "-c", "node dist/db/seed.js && node dist/server.js"]
