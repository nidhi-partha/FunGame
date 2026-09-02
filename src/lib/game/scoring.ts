import type { Vote, Response, Score, ScoreReason } from "@/types";
import { BLUFF } from "@/types/game";
import { GAME_CONFIG } from "@/constants/gameConfig";

/**
 * Pure scoring logic — kept separate from gameEngine/roundLogic so it's trivial to unit test
 * and tune (e.g. bonus points) without touching phase-transition or round-selection code.
 */

/** Was this single vote a correct guess (either the right player, or correctly called BLUFF)? */
export function isCorrectVote(vote: Vote, response: Response): boolean {
  if (response.isBluff) {
    return vote.guessedPlayerId === BLUFF;
  }
  return vote.guessedPlayerId === response.playerId;
}

/** Score every vote cast on a single revealed response. */
export function scoreVotesForResponse(votes: Vote[], response: Response): Score[] {
  return votes
    .filter((vote) => isCorrectVote(vote, response))
    .map((vote) => ({
      playerId: vote.voterId,
      roundId: vote.roundId,
      points: GAME_CONFIG.pointsPerCorrectGuess,
      reason: (response.isBluff ? "CORRECT_BLUFF_CALL" : "CORRECT_GUESS") as ScoreReason,
    }));
}

/** Sum a list of Score entries into a per-player leaderboard, sorted highest first. */
export function tallyLeaderboard(scores: Score[]): { playerId: string; total: number }[] {
  const totals = new Map<string, number>();
  for (const score of scores) {
    totals.set(score.playerId, (totals.get(score.playerId) ?? 0) + score.points);
  }
  return Array.from(totals.entries())
    .map(([playerId, total]) => ({ playerId, total }))
    .sort((a, b) => b.total - a.total);
}
