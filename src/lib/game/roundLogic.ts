import type { Prompt, Player } from "@/types";

/**
 * Round-setup helpers: picking prompts and deciding reveal order.
 * Kept separate from scoring/gameEngine so "how do we pick what's next" can evolve
 * (e.g. weighted prompt categories, real bluff generation) without touching scoring math.
 */

/** Pick a prompt that hasn't been used yet this game. */
export function pickNextPrompt(allPrompts: Prompt[], usedPromptIds: string[]): Prompt | null {
  const remaining = allPrompts.filter((p) => !usedPromptIds.includes(p.id));
  if (remaining.length === 0) return null;
  return remaining[Math.floor(Math.random() * remaining.length)];
}

/** Shuffle the order in which each round's response gets revealed to the group. */
export function shuffleRevealOrder<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Everyone except the statement's author is allowed to vote on it.
 * (Bluff statements have no author, so every player may vote.)
 */
export function getEligibleVoters(players: Player[], authorPlayerId: string | null): Player[] {
  if (authorPlayerId === null) return players;
  return players.filter((p) => p.id !== authorPlayerId);
}

// TODO: real AI bluff generation lives here eventually — e.g. generateBluffResponse(prompt, player history).
// For now, bluff rounds are out of scope for the initial build (see GAME_CONFIG.bluffRoundFrequency).
