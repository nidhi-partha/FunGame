# Database Schema (as of October 21, 2026)

This documents the schema finalized in `supabase/migrations/0001_init.sql`.
**Nothing here has been applied to a real Supabase project yet.** See
`supabase/migrations/README.md` for how to apply it.

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
- `votes.guessed_player_id` is a nullable uuid foreign key to `players.id`; a separate
  `votes.is_bluff_guess` boolean marks "I think this was an AI bluff" (in which case
  `guessed_player_id` is null). Resolved: the earlier `'BLUFF'` text sentinel was dropped
  in favor of this stricter shape (see `supabase-migration-design.md`).
- `players.score` is a stored running total for cheap leaderboard reads; the
  authoritative record of *why* is the set of correct votes per round. Resolved: keep it
  stored rather than deriving on read — deriving is a premature optimization with no
  evidence of drift (see `supabase-migration-design.md`).

## Auth decided

1. **Decided: Anonymous Supabase auth** — each device gets a Supabase anonymous session on
   join; `players.id` = the auth user id. Enables RLS policies scoped to "you can only
   act as your own player row."
   (more flexible for future features such as dedicated accounts for users).
   
2. **Rejected: No auth, room-code-as-secret** — players are just rows with no linked auth user;
   trust is entirely "you know the room code." Simpler, but no real security boundary
   and no path to persistent accounts later.

This decision unblocks writing real RLS policies — they can reference
`auth.uid() = players.id`. They're deferred to a future `0002` migration, shipped
together with the client's anonymous-auth wiring (see `supabase-migration-design.md`).

## Prompts: table vs. constant

`src/constants/prompts.ts` currently holds a small starter set client-side, mirrored
into `supabase/seed.sql`. Once prompts are fully DB-backed, decide whether to delete
the constant or keep it as a local-dev/offline fallback.
