# Architecture

High-level map of how the pieces fit together, and — more importantly — where the
seams are so two people can work without stepping on each other.

## Layers

```
┌─────────────────────────────────────────────────────────┐
│  UI (src/app, src/components)                            │
│  Screens + presentational components. Reads game state,  │
│  renders one phase, calls callbacks (onSubmit, onVote…).  │
│  Owns almost no logic of its own.                         │
└───────────────┬─────────────────────────────────────────┘
                │  reads via hooks
┌───────────────▼─────────────────────────────────────────┐
│  Hooks (src/hooks)                                        │
│  useGame / useRoom / useRealtimeGame. The only layer that │
│  talks to Supabase Realtime. Translates DB rows + events  │
│  into the typed shapes in src/types.                      │
└───────────────┬─────────────────────────────────────────┘
                │  reads/writes
┌───────────────▼─────────────────────────────────────────┐
│  Game logic (src/lib/game)                                 │
│  gameEngine.ts / scoring.ts / roundLogic.ts. Pure          │
│  functions, no React, no Supabase import. Given data in,   │
│  returns data out. This is what actually decides "what     │
│  happens next" — trivially unit-testable.                  │
└───────────────┬─────────────────────────────────────────┘
                │  called from
┌───────────────▼─────────────────────────────────────────┐
│  Database (src/lib/supabase, supabase/)                   │
│  Postgres tables + Realtime. client.ts / server.ts are the │
│  only files that construct a Supabase client.               │
└─────────────────────────────────────────────────────────┘
```

The rule of thumb: **UI never imports `src/lib/supabase` directly**, and **`src/lib/game`
never imports React or Supabase**. If a component needs data, it goes through a hook;
if a hook needs to decide "what phase comes next" or "who won", it calls into
`src/lib/game`, not the other way around.

## Frontend / UI

- `src/app/*` — Next.js App Router pages. Thin: route params in, call a hook, render
  a component from `src/components/game`. Should not contain business logic.
- `src/components/game/*` — one component per `GamePhase` (Lobby, PromptRound,
  StatementReveal, VotingRound, Results, Leaderboard, FinalResults). Each takes plain
  props and calls callbacks — no data fetching inside them.
- `src/components/shared/*` — small pieces reused across phases (Timer, PlayerAvatar,
  RoomCode).
- `src/components/ui/*` — generic, game-agnostic primitives (Button, Card, ...),
  written to match shadcn/ui's conventions so `npx shadcn add <thing>` can drop files
  in here later without restructuring anything.

## Game logic

Lives entirely in `src/lib/game/`, split by concern so the two of you can each own a
file without merge conflicts:

- `gameEngine.ts` — phase transitions (`GamePhase` state machine).
- `roundLogic.ts` — picking the next prompt, reveal order, who's eligible to vote.
- `scoring.ts` — turning votes into points, tallying the leaderboard.

None of these import React or `@supabase/*`. That's intentional — it means this logic
can be unit tested with plain function calls, and it can eventually be reused
server-side (e.g. in a Supabase Edge Function) without changes.

## Realtime synchronization

All players in a room need to see the same phase/statement/votes update live. That
sync is centralized in `src/hooks/useRealtimeGame.ts`, which is the **only** place
that should open a `supabase.channel(...)` subscription. `useGame.ts` wraps it for
screens to consume. This means:

- Only one dev needs to touch the realtime plumbing.
- Every component/screen gets state the same way, so behavior stays consistent.
- If we swap the sync mechanism later (e.g. Postgres `postgres_changes` vs.
  `broadcast` channels, or a different provider entirely), only this one file changes.

**Who drives phase transitions?** Not yet decided — see the open question in
`docs/game-flow.md`. Likely candidates: the host's client calls a server action /
Supabase Edge Function that validates and writes the new phase, which then fans out to
everyone via Realtime. Whatever we pick, it should call into `gameEngine.ts` for the
actual transition decision rather than re-implementing it inline.

## Database

- `src/lib/supabase/client.ts` — browser Supabase client (Client Components).
- `src/lib/supabase/server.ts` — server Supabase client (Server Components, route
  handlers, server actions).
- `src/types/database.ts` — hand-written row types mirroring the proposed schema,
  used to type the Supabase client until we generate real types from a live project.
- `supabase/migrations/` — SQL schema, currently a **draft** (see
  `docs/database-schema.md`).

## Future: AI bluff system

Out of scope for the initial build (see `GAME_CONFIG.bluffRoundFrequency = 0`), but
the seams are already in place so it can be added without restructuring:

- `types.Response.isBluff` / `types.Response.playerId: null` already model "this
  statement has no human author."
- `types.Vote.guessedPlayerId` already accepts the `BLUFF` sentinel.
- `src/lib/game/roundLogic.ts` has a TODO marking where bluff generation would plug
  in — most likely a server-side call to an LLM (given the round's prompt, and later,
  a player's writing history) that inserts a `responses` row with `player_id = null`,
  `is_bluff = true` before the round enters `REVEAL`.

This keeps "generate a bluff" as a backend concern that slots into the existing round
lifecycle, rather than a special case the UI needs to know about.
