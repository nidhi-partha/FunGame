# 💗 Guess Who Said It

A real-time multiplayer party game. A host creates a room, friends join with a room
code or link, everyone anonymously answers a prompt, and the group tries to guess who
said what — while debating live. Some statements might even be AI-generated bluffs.

Pink, sorority-coded, a little chaotic on purpose. See [`docs/game-flow.md`](docs/game-flow.md)
for the full rules and [`docs/architecture.md`](docs/architecture.md) for how it's built.

## Core game flow

```
Create Room / Join Room
        ↓
      Lobby
        ↓
  Host starts game
        ↓
Players receive a prompt → everyone submits an anonymous answer privately
        ↓
   A statement is revealed
        ↓
Players vote on who said it (or whether it was an AI bluff) — debating live
        ↓
   Results + vote breakdown shown, points awarded
        ↓
      Leaderboard
        ↓
  (repeat for next round)
        ↓
   Final winner screen
```

Full phase-by-phase breakdown, including open design questions still to be decided:
[`docs/game-flow.md`](docs/game-flow.md).

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Supabase](https://supabase.com/) (Postgres + Realtime) for the database and live
  multiplayer sync
- UI primitives organized to be [shadcn/ui](https://ui.shadcn.com/)-compatible

## Architecture (short version)

```
UI (app/, components/) → hooks (hooks/) → game logic (lib/game/) → database (lib/supabase/, supabase/)
```

- **UI** components render one screen per game phase and hold no business logic.
- **Hooks** are the only layer that talks to Supabase Realtime, translating DB state
  into typed data for screens.
- **Game logic** (`lib/game/`) is plain TypeScript — no React, no Supabase imports —
  so phase transitions and scoring are easy to reason about and unit test.
- **Database** access is isolated to `lib/supabase/client.ts` and `server.ts`.

Full writeup, including how a future AI bluff system plugs in:
[`docs/architecture.md`](docs/architecture.md).

## Local development

Requires Node.js 20+.

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase project URL + anon key
npm run dev                         # http://localhost:3000
```

Other useful commands:

```bash
npm run build   # production build + typecheck
npm run lint    # eslint
```

The database schema hasn't been applied anywhere yet — see
[`supabase/migrations/README.md`](supabase/migrations/README.md) and
[`docs/database-schema.md`](docs/database-schema.md) before running any migrations.

## Folder structure

```
guess-who-said-it/
├── docs/                     Architecture, game flow, DB schema, dev guide
├── public/                   Static assets
├── src/
│   ├── app/                  Next.js App Router pages (create/, join/, room/[roomCode]/)
│   ├── components/
│   │   ├── ui/                Generic, game-agnostic primitives (Button, Card, ...)
│   │   ├── game/               One component per GamePhase (Lobby, VotingRound, ...)
│   │   └── shared/              Small pieces reused across phases (Timer, PlayerAvatar, ...)
│   ├── hooks/                 useGame / useRoom / useRealtimeGame — the Supabase-facing layer
│   ├── lib/
│   │   ├── supabase/            Browser + server Supabase clients
│   │   ├── game/                 Pure game logic: gameEngine, scoring, roundLogic
│   │   └── utils.ts
│   ├── types/                 Room, Player, Game, Round, Prompt, Response, Vote, Score, GamePhase
│   ├── constants/              gameConfig.ts, prompts.ts
│   └── styles/
└── supabase/
    ├── migrations/            SQL schema (currently a draft, not yet applied)
    └── seed.sql
```

See [`docs/architecture.md`](docs/architecture.md) for the reasoning behind this split.

## Contributing (branches & PRs)

- `main` is always meant to be deployable.
- One branch per feature/task: `feature/voting-screen`, `fix/timer-reset`, etc.
- Keep PRs small and scoped to one phase/feature; link the GitHub issue it closes.
- Both contributors review each other's PRs before merging, even for small changes —
  this project is split across a frontend/backend seam where integration bugs are easy
  to miss solo.
- Squash-merge to keep history readable.

Full conventions (naming, where logic should live, how to avoid stepping on each
other's files): [`docs/development-guide.md`](docs/development-guide.md).
