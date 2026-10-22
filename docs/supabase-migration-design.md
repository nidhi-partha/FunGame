# Initial Migration — Design & Decisions (0001)

Design notes for finalizing and applying the initial database schema, i.e. promoting
`supabase/migrations/0001_init_draft.sql` from a draft to an applied migration. Companion
to [`database-schema.md`](database-schema.md), which documents the schema itself; this doc
records the decisions behind *finalizing* it and the plan for this branch
(`feature/supabase-migration`).

## Goal

Finalize the draft initial schema, resolve the open questions flagged in
`database-schema.md`, and prepare it for apply — without pulling in auth, RLS, or
frontend work that isn't ready yet.

## Scope

In scope for this branch:

- Rename `supabase/migrations/0001_init_draft.sql` → `0001_init.sql` (drop the `_draft`
  suffix, per `supabase/migrations/README.md`).
- Apply the one schema change below to the `votes` table.
- Update `src/types/database.ts` (`VoteRow`) to mirror the new columns.
- Update `database-schema.md` to reflect the resolved open questions.
- Hand the actual `supabase db push` to a human (needs the project-ref + credentials).

Explicitly **out of scope** (see Deferred):

- RLS policies and anonymous-auth wiring.
- Any change to domain types (`src/types/game.ts`) or UI components.

## Decisions

### 1. Migration is schema-only; RLS ships later in `0002`

The auth approach (anonymous Supabase auth, `players.id = auth.uid()`) is decided, which
*unblocks* RLS — but the app has no `signInAnonymously` wiring yet. Enabling RLS now would
make every app query fail against policies keyed on `auth.uid()`. So `0001` ships tables,
keys, and constraints only. RLS policies land in a future `0002_rls_policies.sql`, shipped
together with the client's anonymous-auth change so they're introduced only once they can
be satisfied.

### 2. `votes.guessed_player_id` → stricter uuid FK + boolean

Replace the stringly-typed sentinel with a real foreign key plus an explicit flag:

```sql
-- Draft:
guessed_player_id text not null,  -- a players.id uuid (as text) or the literal 'BLUFF'

-- Finalized:
guessed_player_id uuid references players (id),   -- nullable; null when the guess was "bluff"
is_bluff_guess    boolean not null default false,
```

Gives referential integrity and removes the `'BLUFF'` magic string from the storage layer.
The existing `unique (response_id, voter_id)` constraint (one guess per player per
statement) is unchanged.

### 3. `players.score` stays a stored column

Keep `score integer not null default 0`. It matches `src/types` and `lib/game/scoring.ts`,
and gives cheap leaderboard reads. Deriving score from `votes` on every read is a premature
optimization with no evidence the stored total drifts; revisit only if real usage shows a
problem.

## Type / contract impact

`src/types/*` is the shared frontend/backend contract (see
[`development-guide.md`](development-guide.md)). This branch changes `src/types/database.ts`:

```ts
// VoteRow
guessed_player_id: string | null;  // player uuid, or null for a bluff guess
is_bluff_guess: boolean;
```

Per the development guide, a change to a shared `src/types/*` file must be flagged to the
other contributor before starting, not made unilaterally. The **domain** type
`src/types/game.ts` (the `BLUFF` sentinel used by `VotingRound.tsx` / `Results.tsx`) is
**not** changed here — translating the new DB columns to/from the `BLUFF` domain value is a
future concern for the hook mapping layer (hooks are currently stubs, so nothing breaks).

## Deferred (tracked, not forgotten)

| Item | Where it lands | Why not now |
|---|---|---|
| RLS enable + policies | `0002`, with auth | Would lock out an app that can't yet authenticate |
| `signInAnonymously` client wiring | Frontend/backend change alongside `0002` | Prerequisite for RLS to be satisfiable |
| `players.id` → `auth.users(id)` FK | `0002`, with auth | Only meaningful once anonymous sessions exist |
| Domain/UI sync for new vote shape | Hook mapping layer, when hooks are implemented | Hooks are stubs today; no live consumer to break |

## Applying

Schema-only `0001` is safe to apply before auth exists. The push is done by a human with
project access (not automated here):

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

See [`supabase/migrations/README.md`](../supabase/migrations/README.md) for the full
convention (one numbered file per change; never edit an applied migration).
