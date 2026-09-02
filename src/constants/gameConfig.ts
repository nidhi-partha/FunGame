/** Tunable gameplay constants. Keep all "magic numbers" here so both devs edit one place. */

export const GAME_CONFIG = {
  minPlayers: 3,
  maxPlayers: 12,
  defaultTotalRounds: 8,
  answeringDurationSeconds: 45,
  votingDurationSeconds: 30,
  resultsDurationSeconds: 8,
  pointsPerCorrectGuess: 1,
  roomCodeLength: 6,
  // TODO: tune once we decide how often bluff rounds should appear (e.g. 1 in N rounds).
  bluffRoundFrequency: 0,
} as const;
