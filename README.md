# Planora

Planora is an AI-first design tool that converts 2D floor plans into photorealistic top-down 3D architectural renders. Upload a floor plan image; the app generates a 3D view via AI, persists projects in the cloud, and lets you compare before and after or export the result.

## Tech Stack

- **Frontend:** React 19, React Router 7, TypeScript, Tailwind CSS, Vite
- **Backend / services:** Puter (auth, cloud workers, file hosting, AI image generation via Gemini)

## Prerequisites

- Node.js (version that supports the project’s `engines` if set)
- A Puter account for auth and project persistence
- A Puter worker that exposes:
  - `GET /api/projects/list`: list projects
  - `GET /api/projects/get?id=<id>`: get one project
  - `POST /api/projects/save`: save a project (body: `{ project, visibility }`)

## Environment

Create a `.env` (or `.env.local`) in the project root:

```bash
VITE_PUTER_WORKER_URL=https://your-puter-worker-url
```

Without this variable, project save and load are skipped (upload and AI render still work in-session).

## Commands

| Command     | Description                |
|------------|----------------------------|
| `npm run dev`       | Start dev server (default: http://localhost:5173) |
| `npm run build`     | Production build            |
| `npm run start`     | Serve production build      |
| `npm run typecheck` | Run route typegen and `tsc` |

## Project Structure

```
app/
  root.tsx              # Layout, Puter auth state, outlet context
  routes.ts             # Route config (home, visualizer/:id)
  routes/
    home.tsx             # Hero, upload, projects grid
    visualizer.$id.tsx   # Project view, AI render, compare slider, export
  app.css                # Global styles
lib/
  ai.action.ts           # generate3DView (Puter AI / Gemini)
  puter.action.ts        # signIn, signOut, createProject, getProject, getProjectById
  puter.hosting.ts       # Image hosting for persisted projects
  constants.ts           # Env, paths, render prompt, UI constants
  utils.ts               # URL/blob helpers
components/
  Navbar.tsx
  Upload.tsx             # Drag-and-drop floor plan upload (JPG/PNG, 50 MB)
  ui/Button.tsx
```

## Flow

1. **Home:** User signs in with Puter, uploads a floor plan (JPG or PNG, up to 50 MB). A project is created and the user is sent to `/visualizer/:id`.
2. **Visualizer:** The app loads the project. If there is no stored render, it calls `generate3DView` (Puter AI, Gemini) to produce a 1024x1024 top-down 3D render from the floor plan. The result is shown and, when the worker URL is set, saved. User can compare source vs render with a slider and export the render as PNG.

## Deployment

After `npm run build`, deploy the `build/` output. The server entry is `build/server/index.js`; static assets live under `build/client/`. The app can be run with `npm run start` or any Node server that serves the same entry and static files. For containerized deployment, use a Dockerfile that installs dependencies, runs `npm run build`, and runs the built server.
