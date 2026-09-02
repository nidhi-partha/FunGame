import type { Player } from "@/types";
import { PlayerAvatar } from "@/components/shared/PlayerAvatar";
import { Button } from "@/components/ui/button";

interface LeaderboardProps {
  standings: Player[]; // sorted highest score first
  isHost: boolean;
  onNextRound?: () => void;
}

/** GamePhase: LEADERBOARD. Running scoreboard shown between rounds. */
export function Leaderboard({ standings, isHost, onNextRound }: LeaderboardProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <ol className="flex w-full max-w-sm flex-col gap-2">
        {standings.map((player, index) => (
          <li key={player.id} className="flex items-center gap-3">
            <span className="w-5 text-right font-mono text-pink-400">{index + 1}</span>
            <PlayerAvatar player={player} size="sm" />
            <span className="flex-1">{player.displayName}</span>
            <span className="font-semibold">{player.score}</span>
          </li>
        ))}
      </ol>

      {isHost && <Button onClick={onNextRound}>Next Round</Button>}
    </div>
  );
}
