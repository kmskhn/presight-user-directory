# Presight User Directory Application

A full-stack user directory application featuring data visualization, comprehensive facet filtering, and polished aesthetics.

## Core Features

- **System-wide Light/Dark Theme** — A beautiful, cohesive theme system with smooth transitions, persisting in local storage and matching system preference on load.
- **Collapsible Facet Sidebar** — Collapsible sections for Hobbies and Nationalities to optimize layout, with expansion state fully persisted across visits.
- **Robust Error Resilience** — React Error Boundary implementation protecting the UI layer from unexpected rendering exceptions, paired with intuitive visual fallback state.
- **Enhanced UX States** — Shimmering skeleton loading grids for layout preservation, custom empty states, a dedicated Not Found page, and instant global and individual filter resets.
- **Deterministic Infinite Scrolling** — Seamless infinite scroll using high-performance cursor-based pagination and windowed list virtualization.

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Local Development

```bash
# 1. Install all dependencies (root + client + server)
npm install

# 2. Seed the database (10,000 users)
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

### Key Design Decisions & Implementation Patterns

- **Deterministic Keyset Cursor-Based Pagination** — Keyset pagination using base64-encoded composite cursors (`[sortByValue, id]`), avoiding standard offset-pagination performance degradation and skipped/duplicate entries under dynamic additions/deletions.
- **DOM Virtualization** — Leverages TanStack Virtual to only render the active viewport nodes (~20-30 nodes out of 10,000), keeping rendering times under 16ms and memory usage extremely low.
- **URL-Synced State Management** — Bi-directional synchronization of active search, sort, and filtering criteria with React Router v7 URL search parameters, making all user searches fully shareable, bookmarkable, and reload-safe.
- **Atomic API Contracts** — A single consolidated `/api/users` endpoint returning both the cursor-paginated users and dynamically calculated query-matching facets.
- **Strict Query Facet Counts** — Adheres to spec-literal rules, dynamically computing counts where all selected filters are applied to all facets for precise user metrics.
- **Normalized SQLite Schema** — Direct M:N modeling of hobbies and users with separate entity and junction tables, indexed properly to allow efficient compound filtering.
- **Persistent UI & Theme State** — Decoupled UI state (like sidebar collapses and light/dark theme preference) stored inside `localStorage` for visual consistency across sessions, with automatic system color preference detection.
- **UI Error Boundary & Fallback Grace** — Isolated crash containment at component level using a React ErrorBoundary, allowing sections of the application to recover gracefully and present polished diagnostic feedback.


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
