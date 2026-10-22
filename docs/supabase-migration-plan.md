# Initial Migration (0001) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finalize the draft initial schema (`0001_init_draft.sql`) into an applyable `0001_init.sql`, with the agreed `votes` change, and align the DB-row type and schema doc — without adding auth/RLS.

**Architecture:** Schema-only migration. One SQL file is renamed and lightly edited; the matching DB-row TypeScript type and the schema reference doc are updated to agree with it. RLS and anonymous auth are deferred to a future `0002` migration.

**Tech Stack:** Supabase (Postgres) SQL migrations, TypeScript, Next.js 16 (App Router), Supabase JS client.

## Global Constraints

- Design decisions are fixed by [`supabase-migration-design.md`](supabase-migration-design.md); do not re-open them here.
- **No RLS, no auth wiring, no domain-type (`src/types/game.ts`) or UI changes** in this branch — those are deferred to `0002`.
- `src/types/*` is the **shared frontend/backend contract**; per [`development-guide.md`](development-guide.md), flag the `database.ts` change to the other contributor before editing it.
- Migration convention (per `supabase/migrations/README.md`): one numbered file per change; never edit an already-applied migration. `0001` has **not** been applied yet, so editing it now is allowed.
- No automated test runner exists (`package.json` has only `dev`/`build`/`lint`). Verification = `npm run build` (typecheck) + `npm run lint` + SQL review. Do not invent a test framework.
- These changes touch SQL and a plain TypeScript interface — **no Next.js APIs** — so the `node_modules/next/dist/docs/` guide (per `AGENTS.md`) is not needed here; `npm run build` still exercises Next's typecheck.
- The real `supabase db push` is a **human step** (needs project-ref/credentials) and is intentionally outside this plan — see "After the plan".

---

### Task 1: Finalize the migration SQL

Rename the draft to its final name and apply the agreed `votes` change. This is the core deliverable; a reviewer could accept or reject it independently of the type/doc updates.

**Files:**
- Rename: `supabase/migrations/0001_init_draft.sql` → `supabase/migrations/0001_init.sql`
- Modify (within that file): the header comment and the `votes` table
- Reference: `docs/supabase-migration-design.md` (decisions 1 & 2)

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a `votes` table with columns `guessed_player_id uuid` (nullable, FK → `players(id)`) and `is_bluff_guess boolean not null default false`. Task 2 mirrors these column names/types.

- [ ] **Step 1: Rename the file (preserve git history)**

```bash
git mv supabase/migrations/0001_init_draft.sql supabase/migrations/0001_init.sql
```

- [ ] **Step 2: Update the header comment**

Replace the top comment block (lines beginning `-- DRAFT —`) so it no longer says "draft" and points RLS at `0002`:

```sql
-- Initial schema. Mirrors src/types/database.ts. See docs/database-schema.md for the
-- entity relationship writeup, and docs/supabase-migration-design.md for the decisions
-- behind finalizing it. RLS + policies are deferred to a future 0002 migration, shipped
-- with the client's anonymous-auth wiring (auth.uid() = players.id).
```

- [ ] **Step 3: Replace the `votes` table definition**

Find the existing `create table votes (...)` block and replace it with:

```sql
create table votes (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references rounds (id) on delete cascade,
  response_id uuid not null references responses (id) on delete cascade,
  voter_id uuid not null references players (id),
  guessed_player_id uuid references players (id), -- nullable; null when the guess was "bluff"
  is_bluff_guess boolean not null default false,
  created_at timestamptz not null default now(),
  unique (response_id, voter_id) -- one guess per player per statement
);
```

(The trailing RLS `-- TODO` comment block at the end of the file stays — it documents the `0002` deferral.)

- [ ] **Step 4: Sanity-check the SQL by eye**

Confirm: `votes` references `players(id)` twice (`voter_id`, `guessed_player_id`); `guessed_player_id` has **no** `not null`; `is_bluff_guess` has `not null default false`; the `unique (response_id, voter_id)` line is intact; no stray `text`/`'BLUFF'` remains.

Run: `grep -n "BLUFF\|guessed_player_id\|is_bluff_guess" supabase/migrations/0001_init.sql`
Expected: only the two new `votes` lines appear; no `text`/`'BLUFF'` on `guessed_player_id`.

- [ ] **Step 5 (optional): Validate SQL against a local Postgres**

Only if Docker is available. This spins up Supabase's local stack and applies all migrations, which parses/validates the SQL without touching any real project:

```bash
npx supabase start   # requires Docker; first run pulls images
npx supabase db reset  # applies migrations + seed to the local db
npx supabase stop
```

Expected: `db reset` completes with no SQL error. Skip this step if Docker isn't set up — the human `db push` later will surface any SQL error regardless.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/0001_init.sql
git commit -m "feat: finalize initial migration (0001) with stricter votes schema"
```

---

### Task 2: Mirror the vote columns in the DB-row type

Update `VoteRow` so the TypeScript contract matches the finalized SQL. Separate from Task 1 because it touches the shared `src/types/*` contract and must be verified by typecheck.

**Precondition:** Give the co-contributor the heads-up required by `development-guide.md` for shared-contract changes before editing this file.

**Files:**
- Modify: `src/types/database.ts` (the `VoteRow` interface)
- Verify: `npm run build`, `npm run lint`

**Interfaces:**
- Consumes: the `votes` columns from Task 1 (`guessed_player_id uuid` nullable, `is_bluff_guess boolean`).
- Produces: `VoteRow.guessed_player_id: string | null` and `VoteRow.is_bluff_guess: boolean`. No other code consumes `VoteRow` yet (hooks are stubs; `scoring.ts` uses the domain type in `game.ts`, not `VoteRow`).

- [ ] **Step 1: Confirm no existing consumer will break**

Run: `grep -rn "guessed_player_id\|VoteRow\|is_bluff_guess" src/`
Expected: matches only in `src/types/database.ts`. (If anything else references them, stop and reassess — the plan assumes no live consumer.)

- [ ] **Step 2: Edit the `VoteRow` interface**

Replace the single `guessed_player_id` line in `VoteRow` with these two lines:

```ts
  guessed_player_id: string | null; // player uuid, or null for a bluff guess
  is_bluff_guess: boolean;
```

Resulting interface:

```ts
export interface VoteRow {
  id: string;
  round_id: string;
  response_id: string;
  voter_id: string;
  guessed_player_id: string | null; // player uuid, or null for a bluff guess
  is_bluff_guess: boolean;
  created_at: string;
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run build`
Expected: build completes with no TypeScript errors. (The change is additive to an unused row type, so existing code still compiles.)

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no new lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/types/database.ts
git commit -m "feat: align VoteRow type with finalized votes schema"
```

---

### Task 3: Update the schema reference doc

Bring `database-schema.md` in line with the finalized schema so the living reference doc doesn't still describe the draft's open questions as unresolved.

**Files:**
- Modify: `docs/database-schema.md`

**Interfaces:**
- Consumes: the finalized `votes` shape (Task 1) and the score decision (design doc).
- Produces: documentation only; nothing depends on it.

- [ ] **Step 1: Update the migration file reference**

In the intro, change the reference from the draft filename to the final one:
`0001_init_draft.sql` → `0001_init.sql`. If the "Nothing here has been applied yet" wording is present, leave it (still true until the human `db push`).

- [ ] **Step 2: Rewrite the `votes.guessed_player_id` note**

Replace the bullet that describes `guessed_player_id` as `text` with the sentinel and its "Open question" with the resolved description:

```markdown
- `votes.guessed_player_id` is a nullable uuid foreign key to `players.id`; a separate
  `votes.is_bluff_guess` boolean marks "I think this was an AI bluff" (in which case
  `guessed_player_id` is null). Resolved: the earlier `'BLUFF'` text sentinel was dropped
  in favor of this stricter shape (see supabase-migration-design.md).
```

- [ ] **Step 3: Resolve the score open question**

Replace the `players.score` "worth revisiting whether score should be derived" bullet with the decision:

```markdown
- `players.score` is a stored running total for cheap leaderboard reads; the authoritative
  record of *why* is the set of correct votes per round. Resolved: keep it stored rather
  than deriving on read — deriving is a premature optimization with no evidence of drift
  (see supabase-migration-design.md).
```

- [ ] **Step 4: Review rendering by eye**

Run: `grep -n "BLUFF\|guessed_player_id\|is_bluff_guess\|derived\|0001_init" docs/database-schema.md`
Expected: no remaining description of a `'BLUFF'` text sentinel or an unresolved "open question"; the `0001_init.sql` reference is updated.

- [ ] **Step 5: Commit**

```bash
git add docs/database-schema.md
git commit -m "docs: update schema doc for finalized votes + score decisions"
```

---

## After the plan (not code tasks)

These complete the issue but aren't automated steps:

1. **Apply the migration (human):** with project access, run
   `npx supabase link --project-ref <your-project-ref>` then `npx supabase db push`.
   This is where the SQL first hits a real database; a syntax error would surface here.
2. **Open the PR:** push the branch and open a PR that links/closes the migration issue;
   request the co-contributor's review (required by the dev guide, especially across the
   frontend/backend seam).
3. **File the deferred follow-ups** (optional, keeps the board honest): the `0002` RLS +
   anonymous-auth migration, and the hook-layer sync of the new vote shape to the `BLUFF`
   domain value.
