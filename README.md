# Presight User Directory Application

A full-stack user directory application featuring data visualization, comprehensive facet filtering, and polished aesthetics.

---

# Core Features

- **System-wide Light/Dark Theme** — A beautiful, cohesive theme system with smooth transitions, persisting in local storage and matching system preference on load.
- **Collapsible Facet Sidebar** — Collapsible sections for Hobbies and Nationalities to optimize layout, with expansion state fully persisted across visits.
- **Robust Error Resilience** — React Error Boundary implementation protecting the UI layer from unexpected rendering exceptions, paired with intuitive visual fallback state.
- **Enhanced UX States** — Shimmering skeleton loading grids for layout preservation, custom empty states, a dedicated Not Found page, and instant global and individual filter resets.
- **Deterministic Infinite Scrolling** — Seamless infinite scroll using high-performance cursor-based pagination and windowed list virtualization.

---

# Prerequisites

## Recommended Versions

- Node.js **20 LTS** or **22 LTS**
- npm ≥ 10
- **Docker Desktop** (Required if running via Docker Compose)

> ⚠️ Node.js 24+ is not recommended because some native dependencies (such as `better-sqlite3`) may fail to compile.

Verify installed versions:

```bash
node -v
npm -v
```

---

# Windows Additional Requirements

This project uses:

- `better-sqlite3`
- `node-gyp`

which may require native compilation on Windows.

Before running `npm install`, install the following:

---

## 1. Python 3

Download:

https://www.python.org/downloads/

During installation:

✅ Enable:

```txt
Add Python to PATH
```

Verify installation:

```bash
python --version
```

---

## 2. Visual Studio Build Tools

Download:

https://visualstudio.microsoft.com/visual-cpp-build-tools/

During installation select:

```txt
Desktop development with C++
```

This installs the required C/C++ toolchain for native Node modules.

---

# Local Development

## 1. Clone Repository

```bash
git clone <repo-url>
cd presight-user-directory
```

---

## 2. Install Dependencies

```bash
npm install
```

If installation fails on Windows:

```bash
npm config set python python
```

or explicitly:

```bash
npm config set python "C:\Path\To\python.exe"
```

Then retry:

```bash
npm install
```

---

## 3. Seed Database

Seeds SQLite database with 10,000 users.

```bash
npm run seed
```

---

## 4. Start Development Servers

Runs both frontend and backend concurrently.

```bash
npm run dev
```

---

# Local URLs

| Service | URL |
|---|---|
| Client | http://localhost:5173 |
| API | http://localhost:3001/api/users |
| Health Check | http://localhost:3001/health |

---

# Running Individual Services

## Backend Only

```bash
npm run dev:server
```

Features:

- Express 5
- SQLite
- Hot reload enabled

---

## Frontend Only

```bash
npm run dev:client
```

Features:

- Vite
- React 19

---

# Running with Docker Compose

## Start

```bash
docker compose up --build
```

---

## URLs

| Service | URL |
|---|---|
| App | http://localhost:5173 |
| API | http://localhost:3001 |

The database is automatically seeded on first startup.

Data persists inside the Docker named volume:

```txt
db-data
```

---

## Reset Database

```bash
docker-compose down -v
docker-compose up --build
```

---

# Running Tests

## Backend Tests

```bash
npm run test -w server
```

---

## All Tests

```bash
npm test
```

---

# Troubleshooting

This section provides solutions for common issues encountered during setup and local development, especially on Windows systems.

---

## 🛠️ Dependency Installation Failures (`better-sqlite3` & `node-gyp`)

Because this project relies on **`better-sqlite3`** (a native C++ SQLite wrapper), it compiles binaries locally using **`node-gyp`**. If `npm install` fails, it is almost always due to a missing Python interpreter, missing C++ build tools, or corrupted node_modules cache.

### Step 1: Clean any failed installation artifacts
A half-completed installation can leave corrupted build artifacts that prevent future success. Clean the workspace first:

* **Windows (PowerShell)**:
  ```powershell
  Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules
  Remove-Item -Force -ErrorAction SilentlyContinue package-lock.json
  ```
* **macOS / Linux (Bash)**:
  ```bash
  rm -rf node_modules package-lock.json
  ```

### Step 2: Verify Python and Node.js Compatibility

> [!IMPORTANT]
> - **Recommended Node.js Version**: **20 LTS** or **22 LTS** (Node.js 24+ is not yet fully supported by some native C++ compiler wrappers).
> - **Recommended Python Version**: **3.10 to 3.12** (Python 3.13+ can occasionally be incompatible with older compilers).

1. Verify Python is installed and added to your system `PATH`:
   ```powershell
   python --version
   ```
2. Find the full path to your Python executable:
   * **Windows (PowerShell)**:
     ```powershell
     where.exe python
     ```
   * **macOS / Linux (Bash)**:
     ```bash
     which python3
     ```

### Step 3: Configure the Python path for `node-gyp`

#### Option A: Set Python via `npm config` (Recommended & Persistent)
Run the following to configure npm globally to always use the correct Python interpreter:
```bash
# Example for Windows:
npm config set python "C:\Users\<YourUsername>\AppData\Local\Programs\Python\Python312\python.exe"

# Example for macOS / Linux:
npm config set python "/usr/bin/python3"
```

#### Option B: Set the environment variable for your current terminal
* **Windows (PowerShell)**:
  ```powershell
  $env:PYTHON="C:\Path\To\python.exe"
  ```
* **Windows (Command Prompt - CMD)**:
  ```cmd
  set PYTHON=C:\Path\To\python.exe
  ```
* **macOS / Linux (Bash/Zsh)**:
  ```bash
  export PYTHON=/usr/bin/python3
  ```

### Step 4: Ensure C++ Compiler Toolchain is present
* **Windows**: Install **Visual Studio Build Tools** by downloading it from the [Official Portal](https://visualstudio.microsoft.com/visual-cpp-build-tools/) and selecting the **"Desktop development with C++"** workload.
* **macOS**: Install Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```
* **Linux (Ubuntu/Debian)**: Install the build tool suite:
  ```bash
  sudo apt-get update && sudo apt-get install -y build-essential
  ```

### Step 5: Re-run a fresh installation
```bash
npm install
```

---

## 🔒 EPERM / Permission Errors on Windows

If you encounter `EPERM: operation not permitted` when installing dependencies or starting up servers, it means directory files are currently locked by an active process.

### Root Causes
- An active `npm run dev` or `node` server running in a hidden terminal or background window.
- VS Code's TypeScript service or folder-watcher actively scanning `node_modules` folders.

### How to Resolve
1. **Terminate background processes**:
   * **Windows (PowerShell)**:
     ```powershell
     Stop-Process -Name "node" -Force
     ```
   * **macOS / Linux (Bash)**:
     ```bash
     killall node
     ```
2. **Close all file locks**:
   * Close VS Code and any other terminal windows.
   * Open a fresh terminal, navigate to the folder, and run your command.

---

# Architecture Overview

```txt
┌─────────────────┐   HTTP/JSON   ┌──────────────────┐   Drizzle ORM   ┌────────┐
│   React SPA     │ ◄───────────► │   Express 5      │ ◄──────────────► │ SQLite │
│   (Vite)        │               │   REST API       │                   │  (DB)  │
│   Port 5173     │               │   Port 3001      │                   │        │
└─────────────────┘               └──────────────────┘                   └────────┘
```

---

# Tech Stack

## Frontend

- React 19
- Vite
- Tailwind CSS v4
- TanStack Query v5
- TanStack Virtual v3
- React Router v7

---

## Backend

- Express 5
- Drizzle ORM
- better-sqlite3
- Zod

---

## Tooling

- Vitest
- npm workspaces
- Docker

---

# Key Design Decisions & Implementation Patterns

## Deterministic Keyset Cursor-Based Pagination

Uses base64-encoded composite cursors:

```txt
[sortByValue, id]
```

Avoids:

- skipped entries
- duplicate records
- offset pagination performance degradation

---

## DOM Virtualization

TanStack Virtual renders only visible rows (~20–30 DOM nodes out of 10,000 users), dramatically reducing memory usage and render cost.

---

## URL-Synced State Management

Search, sort, and filters synchronize with URL search params via React Router v7.

Benefits:

- shareable URLs
- reload-safe state
- bookmarkable searches

---

## Atomic API Contracts

Single `/api/users` endpoint returns:

- paginated users
- pagination metadata
- dynamic facets

---

## Strict Query Facet Counts

Facet counts dynamically recompute using active filters for accurate filtering metrics.

---

## Normalized SQLite Schema

Uses proper many-to-many relationships:

- users
- hobbies
- junction tables

with indexing for efficient filtering.

---

## Persistent UI & Theme State

Stores UI preferences inside `localStorage`:

- theme
- sidebar state

with automatic system preference detection.

---

## UI Error Boundary & Graceful Recovery

React ErrorBoundary prevents isolated component crashes from breaking the entire application.

---

# API

## `GET /api/users`

| Param | Type | Default | Description |
|---|---|---|---|
| `search` | string | `""` | Case-insensitive prefix match on first_name or last_name |
| `nationalities` | string | `""` | Comma-separated, OR logic |
| `hobbies` | string | `""` | Comma-separated, AND logic |
| `sortBy` | enum | `first_name` | `first_name`, `last_name`, `age`, `nationality` |
| `sortDir` | enum | `asc` | `asc`, `desc` |
| `cursor` | string | — | Base64url-encoded keyset cursor |
| `limit` | number | `30` | Maximum 100 |

---

# Response Shape

```json
{
  "data": [],
  "pagination": {
    "nextCursor": "",
    "hasMore": true
  },
  "facets": {
    "hobbies": [],
    "nationalities": []
  }
}
```
