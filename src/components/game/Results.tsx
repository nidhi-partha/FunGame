import type { Player, PlayerId } from "@/types";
import { BLUFF, type BluffSentinel } from "@/types/game";
import { PlayerAvatar } from "@/components/shared/PlayerAvatar";

interface VoteTally {
  guessedPlayerId: PlayerId | BluffSentinel;
  count: number;
}

interface ResultsProps {
  statementText: string;
  voteTally: VoteTally[];
  actualAuthor: Player | null; // null when the statement was a bluff
  players: Player[]; // used to resolve guessedPlayerId -> display info
}

/** GamePhase: RESULTS. Shows the vote breakdown, then reveals who actually said it. */
export function Results({ statementText, voteTally, actualAuthor, players }: ResultsProps) {
  const getLabel = (id: PlayerId | BluffSentinel) =>
    id === BLUFF ? "Bluff" : players.find((p) => p.id === id)?.displayName ?? "Unknown";

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg">&ldquo;{statementText}&rdquo;</p>

      <ul className="flex flex-col gap-1">
        {voteTally.map((entry) => (
          <li key={entry.guessedPlayerId}>
            {entry.count} vote{entry.count === 1 ? "" : "s"} for {getLabel(entry.guessedPlayerId)}
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-1">
        <p className="text-sm text-pink-500">It was actually...</p>
        {actualAuthor ? (
          <div className="flex items-center gap-2">
            <PlayerAvatar player={actualAuthor} />
            <span className="font-semibold">{actualAuthor.displayName}</span>
          </div>
        ) : (
          <span className="font-semibold">🤖 An AI bluff!</span>
        )}
      </div>
    </div>
  );
}
