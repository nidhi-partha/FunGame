# Development Guide

## Coding conventions

- **TypeScript everywhere**, strict mode (on by default via `create-next-app`). Avoid
  `any` — if a shape is genuinely unknown, use `unknown` and narrow it.
- **Types live in `src/types/`.** Import from `@/types` (barrel export). If a
  component only needs part of a type, use `Pick<...>` rather than inventing a
  parallel shape (see `PlayerAvatarProps` for an example).
- **Naming:**
  - Components: `PascalCase.tsx`, one component per file, named export (not default,
    except for `page.tsx`/`layout.tsx` which Next.js requires as default exports).
  - Hooks: `useCamelCase.ts`.
  - Everything else (`lib/`, `constants/`, `types/`): `camelCase.ts`.
- **`"use client"`** only on files that actually need interactivity/state/effects.
  Keep Server Components as the default where possible.
- **No business logic in `src/app/*` pages.** Pages resolve params, call a hook,
  render a component. If you find yourself writing an `if` about game rules in a
  `page.tsx`, it probably belongs in `src/lib/game/`.
- **`src/lib/game/*` stays framework-free** — no `react`, no `@supabase/*` imports.
  Pure functions in, values out. This is what makes it unit-testable and safe for two
  people to edit without touching UI files.
- Path alias `@/*` maps to `src/*` (see `tsconfig.json`) — use it instead of relative
  `../../..` imports.

## Working together without merge conflicts

The codebase is split so each of you can mostly stay in your own lane:

- **Frontend/screens dev:** `src/app/*`, `src/components/*`, `src/hooks/*` (consuming,
  not necessarily implementing realtime internals).
- **Backend/game-logic dev:** `src/lib/game/*`, `src/lib/supabase/*`,
  `supabase/migrations/*`, the realtime implementation inside
  `src/hooks/useRealtimeGame.ts`.

Guidelines to keep it that way:

- Don't add new fields to `src/types/*` unilaterally if the other person's code
  depends on that shape — flag it first (these files are the shared contract).
- Prefer adding a new file over growing an existing one. E.g. a new game screen goes
  in a new file, not as a new branch inside `RoomPage`.
- Keep PRs scoped to one phase/feature (e.g. "implement VOTING phase end-to-end") so
  they're reviewable and don't collide with a parallel PR touching the same files.
- If you need to change a shared file (`src/types/*`, `src/constants/gameConfig.ts`,
  `src/lib/utils.ts`), say so before starting — quick sync beats a merge conflict.

## Branching & PRs

- `main` is always deployable (or as close as we can manage pre-launch).
- Branch per feature/task: `feature/voting-screen`, `feature/room-creation`,
  `fix/timer-reset`, etc.
- Small, focused PRs over big ones. Link the GitHub issue it closes.
- Both devs review each other's PRs before merging, even on a two-person team —
  catches integration issues early, especially across the frontend/backend seam.
- Squash-merge to keep `main` history readable.

## Local development

See the root `README.md` for setup/run instructions. Quick reference:

```bash
npm install
npm run dev      # start dev server
npm run lint      # eslint
npm run build     # production build + typecheck
```

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase project's URL and
anon key (Supabase dashboard → Project Settings → API). `.env.local` is gitignored —
never commit real credentials.
