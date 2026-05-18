# Presight Frontend Exercise

Build a small full-stack user directory application. The goal is to evaluate how you design a searchable, filterable, paginated UI backed by persisted data and clear API boundaries.

---

## Quick Start

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Local Development

```bash
# 1. Install all dependencies (root + client + server)
npm install

# 2. Seed the database (10,000 users, ~0.2s)
npm run seed

# 3. Start both server and client in parallel
npm run dev
```

- **Client**: http://localhost:5173
- **API**: http://localhost:3001/api/users
- **Health**: http://localhost:3001/health

### Individual Services

```bash
# Server only (Express + SQLite, hot reload)
npm run dev:server

# Client only (Vite + React)
npm run dev:client
```

---

## Running with Docker Compose

```bash
docker-compose up --build
```

- **App**: http://localhost:5173
- **API**: http://localhost:3001

The database is seeded automatically on first startup. Data is persisted in a named Docker volume (`db-data`).

To reset the database:

```bash
docker-compose down -v   # removes db-data volume
docker-compose up --build
```

---

## Running Tests

```bash
# Backend API tests (14 tests)
npm run test -w server

# All tests
npm test
```

---

## Architecture Overview

```
┌─────────────────┐   HTTP/JSON   ┌──────────────────┐   Drizzle ORM   ┌────────┐
│   React SPA     │ ◄───────────► │   Express 5      │ ◄──────────────► │ SQLite │
│   (Vite)        │               │   REST API       │                   │  (DB)  │
│   Port 5173     │               │   Port 3001      │                   │        │
└─────────────────┘               └──────────────────┘                   └────────┘
```

### Tech Stack

**Frontend**: React 19 · Vite · Tailwind CSS v4 · TanStack Query v5 · TanStack Virtual v3 · React Router v7

**Backend**: Express 5 · Drizzle ORM · better-sqlite3 · Zod

**Tooling**: Vitest · npm workspaces · Docker

### Key Design Decisions

- **Cursor-based pagination** — deterministic, no skipped/duplicate rows on deep pages
- **Virtualized list** — renders only ~20-30 DOM nodes regardless of 10,000 users
- **URL-synced state** — filters, sort, and search reflected in the URL; shareable and reload-safe
- **Single `/api/users` endpoint** — returns data + facets atomically
- **Spec-literal facet counts** — all active filters apply to all facet counts
- **Normalized hobbies** — separate table + junction, enabling efficient AND-logic filtering

---

## API

### `GET /api/users`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | string | `""` | Case-insensitive prefix match on first_name or last_name |
| `nationalities` | string | `""` | Comma-separated, OR logic |
| `hobbies` | string | `""` | Comma-separated, AND logic |
| `sortBy` | enum | `first_name` | `first_name` · `last_name` · `age` · `nationality` |
| `sortDir` | enum | `asc` | `asc` · `desc` |
| `cursor` | string | — | Base64url-encoded keyset cursor |
| `limit` | number | `30` | Max 100 |

Response includes `data[]`, `pagination.{nextCursor, hasMore}`, and `facets.{hobbies[], nationalities[]}`.
