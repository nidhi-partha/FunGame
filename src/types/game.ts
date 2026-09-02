import type { RoomId } from "./room";
import type { PlayerId } from "./player";

/**
 * Central game state machine. Every screen/component should derive what it renders
 * from `Game.phase` rather than tracking its own "which screen am I on" state.
 *
 *   LOBBY -> ANSWERING -> REVEAL -> VOTING -> RESULTS -> LEADERBOARD -> (next round: REVEAL...) -> FINISHED
 */
export type GamePhase =
  | "LOBBY"
  | "ANSWERING"
  | "REVEAL"
  | "VOTING"
  | "RESULTS"
  | "LEADERBOARD"
  | "FINISHED";

export type PromptId = string;
export type RoundId = string;
export type ResponseId = string;
export type VoteId = string;

/** Sentinel used in place of a PlayerId when a vote/guess is "this was an AI bluff". */
export const BLUFF = "BLUFF" as const;
export type BluffSentinel = typeof BLUFF;

export interface Prompt {
  id: PromptId;
  text: string; // e.g. "I once ________ and never told anyone."
  category: string | null;
}

export interface Game {
  id: string;
  roomId: RoomId;
  phase: GamePhase;
  currentRoundIndex: number;
  totalRounds: number;
  createdAt: string;
  updatedAt: string;
}

export interface Round {
  id: RoundId;
  gameId: string;
  promptId: PromptId;
  roundIndex: number;
  /** Which response is currently on screen for reveal/voting. Null before REVEAL. */
  revealedResponseId: ResponseId | null;
  createdAt: string;
}

/**
 * A single player's private answer to a round's prompt.
 * Referred to as a "statement" in the UI once it's revealed to the group.
 */
export interface Response {
  id: ResponseId;
  roundId: RoundId;
  playerId: PlayerId | null; // null when this response is an AI-generated bluff
  text: string;
  isBluff: boolean;
  submittedAt: string;
}

export interface Vote {
  id: VoteId;
  roundId: RoundId;
  responseId: ResponseId; // which statement is being voted on
  voterId: PlayerId; // who cast the vote
  guessedPlayerId: PlayerId | BluffSentinel; // who they think said it, or BLUFF
  createdAt: string;
}

export type ScoreReason = "CORRECT_GUESS" | "CORRECT_BLUFF_CALL" | "BONUS";

export interface Score {
  playerId: PlayerId;
  roundId: RoundId;
  points: number;
  reason: ScoreReason;
}
