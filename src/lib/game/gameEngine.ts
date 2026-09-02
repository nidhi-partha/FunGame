import type { GamePhase } from "@/types";

/**
 * Pure game-state-machine logic. No React, no Supabase — just phase transitions,
 * so it's easy to unit test and easy for one dev to own without touching UI code.
 *
 * The *authoritative* Game row lives in Supabase; this module is the single source of
 * truth for "what phase comes next", called from server-side round orchestration
 * (see docs/architecture.md for where that will live).
 */

const PHASE_ORDER: GamePhase[] = [
  "LOBBY",
  "ANSWERING",
  "REVEAL",
  "VOTING",
  "RESULTS",
  "LEADERBOARD",
];

/**
 * Given the current phase and whether more rounds remain, returns the next phase.
 * LEADERBOARD loops back to REVEAL (next round's statement) unless it was the final round,
 * in which case the game moves to FINISHED.
 */
export function getNextPhase(
  currentPhase: GamePhase,
  { isFinalRound }: { isFinalRound: boolean }
): GamePhase {
  if (currentPhase === "LEADERBOARD") {
    return isFinalRound ? "FINISHED" : "REVEAL";
  }

  if (currentPhase === "FINISHED") {
    return "FINISHED";
  }

  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  return PHASE_ORDER[currentIndex + 1];
}

// TODO: add startGame(room), advancePhase(game), etc. once round orchestration
// (likely a Supabase Edge Function or server action driven by the host client) is designed.
