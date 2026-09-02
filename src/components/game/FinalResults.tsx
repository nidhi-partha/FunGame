import type { Player } from "@/types";
import { PlayerAvatar } from "@/components/shared/PlayerAvatar";

interface FinalResultsProps {
  standings: Player[]; // sorted highest score first
}

/** GamePhase: FINISHED. Final winner screen shown at the end of the game. */
export function FinalResults({ standings }: FinalResultsProps) {
  const winner = standings[0];

  return (
    <div className="flex flex-col items-center gap-6">
      {winner && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm uppercase tracking-wide text-pink-500">Winner</p>
          <PlayerAvatar player={winner} size="lg" />
          <p className="text-2xl font-bold">{winner.displayName}</p>
          <p className="text-pink-600">{winner.score} points</p>
        </div>
      )}

      <ol className="flex w-full max-w-sm flex-col gap-2">
        {standings.slice(1).map((player, index) => (
          <li key={player.id} className="flex items-center gap-3">
            <span className="w-5 text-right font-mono text-pink-400">{index + 2}</span>
            <PlayerAvatar player={player} size="sm" />
            <span className="flex-1">{player.displayName}</span>
            <span className="font-semibold">{player.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
