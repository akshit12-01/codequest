# CodeQuest

A gamified developer roadmap — an RPG-style companion for learning backend
development. Earn XP, level up, complete a dependency-gated roadmap of
topics, take notes, submit projects for an AI code review, unlock
achievements, and track it all on a dashboard. Everything runs entirely in
your browser: **no login, no database, no backend server** — just
LocalStorage.

![tech](https://img.shields.io/badge/Next.js-16-black) ![tech](https://img.shields.io/badge/TypeScript-strict-blue) ![tech](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Pick a name, and you're
in — your progress saves automatically as you go.

### Enabling real AI reviews (optional)

Project submissions work out of the box using a local, zero-network mock
reviewer, so there's nothing to configure to try the app. To get real
Gemini-powered reviews instead:

```bash
cp .env.local.example .env.local
# then edit .env.local and set GEMINI_API_KEY
```

Get a key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
The key is read only on the server, inside `app/api/review/route.ts` — it is
never sent to the browser. If the key is missing or a request fails,
CodeQuest quietly falls back to the offline reviewer rather than breaking.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |

## How it's put together

```
app/                    Routes (Next.js App Router)
  (app)/                 Everything behind the sidebar shell
    dashboard/
    roadmap/[topicId]/
    projects/[id]/, new/
    notes/, statistics/, achievements/, settings/
  api/review/             Server-side Gemini proxy (keeps the API key private)
components/
  ui/                     Hand-rolled primitives (button, card, toast, modal…)
  layout/                 Sidebar, TopBar, app shell
  dashboard/ roadmap/ topic/ projects/ achievements/ statistics/ search/
hooks/
  useAppData.ts           The only hook that reads/writes app state
  useActions.ts           XP-aware mutations (complete topic, submit project…)
lib/
  storage.ts               LocalStorage read/write (the only file that touches it)
  store.ts                 External store (useSyncExternalStore) backing useAppData
  actions.ts                Pure state-transition functions used by useActions
  xpEngine.ts, roadmapEngine.ts, achievementsEngine.ts, streak.ts, statsEngine.ts
config/
  roadmaps/backend.ts       The roadmap content (19 topics, 8 tiers)
  skills.ts, achievements.ts, xp.ts
services/ai/
  index.ts                  getReviewService() — the only import UI code should use
  AIReviewService.ts         Picks a provider, attaches XP, handles fallback
  GeminiProvider.ts / MockProvider.ts
types/index.ts             Every persisted/shared shape
```

**Why this layout:** the spec this was built from is explicit that
LocalStorage should be swappable for a real backend later with minimal
changes, and that the AI provider should never be tightly coupled to the UI.
Concretely: every component talks to state through `useAppData`/`useActions`,
never `localStorage` directly — swap `lib/storage.ts` + `lib/store.ts` for an
API-backed version and nothing above them needs to change. Every component
that wants an AI review calls `services/ai/index.ts`, never Gemini directly —
swap in a different model/provider by writing one new class and changing
that one file.

See `AGENTS.md` for the fuller set of "rules that matter" if you're
extending this, and `work-done.txt` / `todo.txt` for exactly what's built and
what's intentionally deferred.

## Known, deliberate scope cuts

- **One roadmap track** (Backend). The config (`RoadmapTrack[]`) supports
  more; only one is populated.
- **Dependency visualization** is tier-grouping + "Requires: X, Y" /
  "Unlocks next" text, not an SVG line diagram between nodes.
- **Search** is a topbar input + dropdown, not a command palette.
- **AI reviews** reason from the project name/description/repo URL you
  provide — Gemini isn't given tool access to actually browse your
  repository, so the quality of the review tracks the quality of your
  description.

## Requirements

Node.js 20+. No other services required — everything but the optional
Gemini call is 100% client-side.
