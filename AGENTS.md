<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# CodeQuest — orientation for whoever (human or AI) works on this next

Read `work-done.txt` (history of what's been built and why) and `todo.txt`
(live checklist) before changing anything. They're kept up to date on
purpose — trust them over guessing from file names.

## The rules that matter most
1. **LocalStorage only, one key.** Everything lives under `localStorage["learningApp"]`,
   typed as `AppState` in `types/index.ts`. `lib/storage.ts` is the only file
   that should ever call `window.localStorage` directly.
2. **One store, one hook.** `lib/store.ts` holds the cached state + a
   `useSyncExternalStore`-compatible subscribe API. `hooks/useAppData.ts` is
   the only hook components should use to read/write it. Don't read the
   store directly from a component.
3. **Business logic is not UI logic.** `lib/actions.ts` holds pure
   `(state, ...) => state` transitions (XP awarding, note edits, project
   status changes). `hooks/useActions.ts` wraps them with the store setter
   and toast celebrations. Components call `useActions()`, never
   `lib/actions.ts` directly, and never hand-roll a state mutation inline.
4. **The AI provider is swappable by design.** Nothing outside
   `services/ai/*` should know Gemini exists. UI/hooks only ever import
   `getReviewService` from `services/ai/index.ts`. XP for a review is always
   computed by `lib/xpEngine.ts` from the AI's scores — a provider (Gemini or
   the offline mock) never emits an XP number itself.
5. **Achievements are declarative.** Add a new achievement by adding one
   entry to `config/achievements.ts` with a `condition`; don't hand-write a
   new branch of unlock logic — `lib/achievementsEngine.ts`'s single
   `evaluateCondition()` already knows how to read every condition type, and
   it's also what powers the in-progress "3/5" style counters on the
   Achievements page. Two parallel copies of a threshold number is a bug.

## Known, deliberate scope cuts (see todo.txt "NICE-TO-HAVE" section)
Only one roadmap track exists (Backend). Dependency visualization is
tier-grouping + text lists, not an SVG line diagram. Global search is a
topbar input, not a command palette. None of these are missing by accident.

## Before you consider a change done
`npx eslint .` and `npx tsc --noEmit` and `npm run build` should all be
clean. This sandboxed environment blocks `fonts.gstatic.com`, which is why
`app/layout.tsx` loads fonts via a `<link>` tag instead of `next/font/google`
— don't "fix" that back to `next/font/google` without checking whether your
environment can actually reach Google Fonts at build time.

