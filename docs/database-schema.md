# Database Schema (Proposed — for review)

This documents the schema drafted in `supabase/migrations/0001_init_draft.sql`.
**Nothing here has been applied to a real Supabase project yet.** Review and adjust
before running it — see `supabase/migrations/README.md` for how to apply once agreed.

## Entities

| Table | Purpose |
|---|---|
| `rooms` | One row per game room. Has a short, human-shareable `code`. |
| `players` | One row per person who joined a room (host or not). Scoped to a room. |
| `prompts` | Bank of reusable "I ________" style prompt text. Not room-scoped. |
| `games` | One row per game played in a room. Holds the current `phase` (see `GamePhase`). |
| `rounds` | One row per round within a game — one prompt, one revealed response. |
| `responses` | Each player's private answer to a round's prompt. `is_bluff = true` and `player_id = null` for AI-generated bluffs (future). |
| `votes` | One row per (response, voter) pair — who a player guessed for a given statement. |

## Relationships

```
rooms 1───* players
rooms 1───* games
games 1───* rounds
rounds *───1 prompts
rounds 1───* responses
rounds 1───* votes
responses 1───* votes
players 1───* responses   (nullable — bluffs have no player)
players 1───* votes       (as voter)
rooms 1───1 players        (rooms.host_id -> players.id)
```

Notes:

- `rounds.revealed_response_id` points at whichever `responses` row is currently on
  screen for that round's REVEAL/VOTING/RESULTS phases.
- `votes` has a unique constraint on `(response_id, voter_id)` — one guess per player
  per statement.
- `votes.guessed_player_id` is stored as `text`, not a strict foreign key, because it
  needs to hold either a real `players.id` (uuid) or the literal string `'BLUFF'`.
  Open question: model this more strictly (e.g. a separate `is_bluff_guess boolean`
  column instead of a sentinel string)?
- `players.score` is a running total for convenience/leaderboard reads; the
  authoritative record of *why* is really the set of correct votes per round. Worth
  revisiting whether score should be derived instead of stored, once real usage shows
  whether that read pattern matters.

## Auth (not decided)

No auth is implemented yet. Two realistic options:

1. **Anonymous Supabase auth** — each device gets a Supabase anonymous session on
   join; `players.id` = the auth user id. Enables RLS policies scoped to "you can only
   act as your own player row."
2. **No auth, room-code-as-secret** — players are just rows with no linked auth user;
   trust is entirely "you know the room code." Simpler, but no real security boundary
   and no path to persistent accounts later.

This decision blocks writing real RLS policies (currently TODO'd out in the draft
migration) and should be made before `supabase/migrations/0001_init_draft.sql` is
finalized.

## Prompts: table vs. constant

`src/constants/prompts.ts` currently holds a small starter set client-side, mirrored
into `supabase/seed.sql`. Once prompts are fully DB-backed, decide whether to delete
the constant or keep it as a local-dev/offline fallback.
