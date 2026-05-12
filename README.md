# Prompt Library — Frontend

A React single-page app for saving, sharing, and rating AI prompts, with per-prompt notes and voting. This repository contains the frontend only; it expects a separate HTTP backend exposing the `/api/v1` surface (see [Backend](#backend)).

## Tech stack

- **React 18** with functional components and hooks
- **Vite 5** for dev server and build tooling
- **React Router 7** for client-side routing
- **TanStack Query 5** for server state, caching, and cursor-based infinite lists
- **React Hook Form** + **Zod** for form state and validation
- **Tailwind CSS 4** (via `@tailwindcss/vite`) for styling, with light/dark themes
- **Axios** for HTTP, with cookie-based session auth (`withCredentials: true`)
- **Lucide React** for icons

## Prerequisites

- Node.js 18+ and npm
- A running backend at `http://localhost:8000` that serves the `/api/v1` routes consumed by `src/api/promptsApi.js` (prompts, notes, ratings, votes, auth)

## Getting started

```bash
npm install
npm run dev
```

The dev server starts on Vite's default port (usually `http://localhost:5173`) and proxies `/api/v1/*` to `http://localhost:8000` — see `vite.config.js`. Start the backend before signing in or loading prompts.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally for smoke-testing |

## Project structure

```
src/
├── main.jsx                 # App entry: wires QueryClient, Router, Theme, Auth providers
├── App.jsx                  # Route definitions (PromptLibrary, Login, Register)
├── constants.js             # Domain/config constants (THEME, STORAGE_KEYS, LIST_PAGE_SIZE)
├── api/
│   └── promptsApi.js        # Typed wrappers around /api/v1 endpoints
├── components/              # Presentational + container components (flat layout)
├── context/                 # AuthContext, ThemeContext, PromptActionsContext
├── hooks/
│   ├── usePromptLibrary.js  # Prompt list query + create/delete/rate mutations
│   └── usePaginatedQuery.js # Generic cursor-pagination over useInfiniteQuery
├── query/
│   ├── queryClient.js       # Configured QueryClient factory
│   └── keys.js              # Centralized query-key factory
├── utils/
│   ├── api.js               # Axios instance, ApiError class, auth-failure hook
│   ├── promptMappers.js     # snake_case API → camelCase model mappers
│   ├── styles.js            # Shared Tailwind class strings (form inputs, buttons)
│   └── metadata.js          # Prompt metadata helpers
└── validation/
    └── schemas.js           # Zod schemas for login/register/prompt forms
```

## Architecture notes

- **Server state vs. client state.** All backend-derived data flows through TanStack Query; React Context is reserved for cross-cutting client concerns (auth session, theme, prompt-action callbacks). Avoid mirroring server data into Context.
- **Query keys are centralized** in `src/query/keys.js`. Always build keys through the `queryKeys` factory so invalidations and optimistic updates stay in sync.
- **Pagination** is cursor-based and abstracted by `usePaginatedQuery`, which wraps `useInfiniteQuery` and exposes a windowed page-at-a-time API (`currentItems`, `canGoPrev/Next`, `handleNextPage/PrevPage`, `resetPage`).
- **Auth is cookie/session based.** Axios is configured with `withCredentials: true`; a 401 from any request triggers the registered auth-failure handler (see `registerAuthFailureHandler` in `src/utils/api.js`), which `AuthContext` uses to clear local session state.
- **Naming convention.** The API returns `snake_case`; UI code uses `camelCase`. Conversion happens at the boundary in `src/utils/promptMappers.js` — components and hooks should only ever see camelCase.
- **Imports** are relative throughout (`../`). At the current depth (≤2 levels), this stays readable; path aliases can be added later via `vite.config.js` `resolve.alias` + `jsconfig.json` if the component tree grows feature-folders.

## Backend

The frontend talks to a single REST backend over `/api/v1`. Endpoints currently consumed:

- `GET /api/v1/prompts` — list (filter, sort, cursor)
- `POST /api/v1/prompts` — create
- `PATCH /api/v1/prompts/:id` — update (e.g. privacy toggle)
- `DELETE /api/v1/prompts/:id` — delete
- `PUT /api/v1/prompts/:id/rate` — submit rating
- `GET /api/v1/prompts/:id/notes` — list notes
- `POST /api/v1/prompts/:id/notes` — create note
- `DELETE /api/v1/prompts/:id/notes/:noteId` — delete note
- `POST /api/v1/prompts/:id/notes/:noteId/vote` — upvote/downvote

Plus auth routes invoked by `AuthContext`. The dev proxy target is hardcoded to `http://localhost:8000` in `vite.config.js`; change it there if your backend runs elsewhere.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` outputs static assets to `dist/`. In production the frontend must be served behind a reverse proxy (or co-deployed) that routes `/api/v1/*` to the backend — Vite's dev proxy does not apply to the built bundle.
