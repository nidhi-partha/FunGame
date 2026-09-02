"use client";

import type { Player, PlayerId } from "@/types";
import { BLUFF, type BluffSentinel } from "@/types/game";
import { Timer } from "@/components/shared/Timer";
import { PlayerAvatar } from "@/components/shared/PlayerAvatar";
import { GAME_CONFIG } from "@/constants/gameConfig";
import { cn } from "@/lib/utils";

interface VotingRoundProps {
  statementText: string;
  eligiblePlayers: Player[];
  /** Include this to also let players guess "this was an AI bluff". */
  allowBluffGuess?: boolean;
  selectedGuess: PlayerId | BluffSentinel | null;
  onVote: (guess: PlayerId | BluffSentinel) => void;
  onTimerExpire?: () => void;
}

/** GamePhase: VOTING. Players guess who said the revealed statement (debate happens live, out of band). */
export function VotingRound({
  statementText,
  eligiblePlayers,
  allowBluffGuess,
  selectedGuess,
  onVote,
  onTimerExpire,
}: VotingRoundProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Timer durationSeconds={GAME_CONFIG.votingDurationSeconds} onExpire={onTimerExpire} />
      <p className="text-xl font-medium">&ldquo;{statementText}&rdquo;</p>

      <div className="flex flex-wrap justify-center gap-3">
        {eligiblePlayers.map((player) => (
          <button
            key={player.id}
            onClick={() => onVote(player.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg p-2",
              selectedGuess === player.id && "bg-pink-100"
            )}
          >
            <PlayerAvatar player={player} />
            <span className="text-sm">{player.displayName}</span>
          </button>
        ))}

        {allowBluffGuess && (
          <button
            onClick={() => onVote(BLUFF)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg p-2",
              selectedGuess === BLUFF && "bg-pink-100"
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-200 text-sm">
              🤖
            </div>
            <span className="text-sm">Bluff</span>
          </button>
        )}
      </div>
    </div>
  );
}
