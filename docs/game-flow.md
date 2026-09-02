# Game Flow

## Phase state machine

```typescript
type GamePhase =
  | "LOBBY"
  | "ANSWERING"
  | "REVEAL"
  | "VOTING"
  | "RESULTS"
  | "LEADERBOARD"
  | "FINISHED";
```

```
 LOBBY ──(host starts game)──▶ ANSWERING
                                  │  all players submit a Response
                                  ▼
                               REVEAL ◀─────────────────────────┐
                                  │  one Response shown to group │
                                  ▼                              │
                               VOTING                            │ (more rounds
                                  │  players vote + debate       │  remain)
                                  ▼                              │
                               RESULTS                           │
                                  │  tally shown, author revealed│
                                  ▼                              │
                             LEADERBOARD ─────────────────────────┘
                                  │
                                  │ (final round just finished)
                                  ▼
                              FINISHED
```

- `LOBBY → ANSWERING` happens once, when the host starts the game.
- `REVEAL → VOTING → RESULTS → LEADERBOARD` repeats once per `Round` — i.e. once per
  Response being shown (not once per Prompt, if we ever show multiple statements per
  prompt).
- `LEADERBOARD → REVEAL` for the next round, or `LEADERBOARD → FINISHED` if that was
  the last round. See `getNextPhase()` in `src/lib/game/gameEngine.ts`.

## Per-round walkthrough

1. **ANSWERING** — every player in the room receives the same `Prompt` and privately
   submits their own `Response` on their own device. No one can see anyone else's
   answer yet.
2. **REVEAL** — the game picks one submitted `Response` (anonymized) and shows its
   text to the entire group.
3. **VOTING** — players simultaneously vote on who they think wrote it (a `Vote`
   pointing at either a `PlayerId` or the `BLUFF` sentinel), while debating out loud /
   in chat at the same time. A player cannot vote for their own statement (see
   `getEligibleVoters()` in `roundLogic.ts`).
4. **RESULTS** — the vote breakdown is shown (e.g. "3 votes for Nandini, 2 for
   Neeti"), followed by the actual author (or "it was a bluff").
5. Points are awarded: +1 to every player whose guess was correct (see
   `scoreVotesForResponse()` in `scoring.ts`).
6. **LEADERBOARD** — running scoreboard shown between rounds.
7. Repeat from step 2 for the next round's Response, or end the game.

## Ending

**FINISHED** — after the configured number of rounds (`GAME_CONFIG.defaultTotalRounds`),
the game shows final standings. Highest total score wins.

## Open questions (flagging for review, not deciding here)

- **One Response per Round, or all Responses to a Prompt revealed across multiple
  Rounds?** Current types assume the latter (a `Round` has one `promptId` but reveals
  one `Response` at a time via `revealedResponseId`) — i.e. if 6 players answer the
  same prompt, that could be 6 back-to-back reveal/vote/results cycles, or we group
  them. Needs a decision before `roundLogic.ts` is filled in for real.
- **Who advances phases?** Only the host, on a timer, or first-to-something? Affects
  whether phase transitions are triggered from the host's client or run server-side
  unconditionally.
- **Total rounds vs. "one statement per player"** — fixed round count
  (`GAME_CONFIG.defaultTotalRounds`) vs. scaling to player count.
- **Bluff round frequency** — currently `0` (disabled) in `GAME_CONFIG`. Needs a
  product decision before `roundLogic.ts`'s bluff-generation TODO is implemented.
