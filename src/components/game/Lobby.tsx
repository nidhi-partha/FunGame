import type { Player, RoomCode as RoomCodeType } from "@/types";
import { RoomCode } from "@/components/shared/RoomCode";
import { PlayerAvatar } from "@/components/shared/PlayerAvatar";
import { Button } from "@/components/ui/button";
import { GAME_CONFIG } from "@/constants/gameConfig";

interface LobbyProps {
  roomCode: RoomCodeType;
  players: Player[];
  isHost: boolean;
  onStartGame?: () => void;
}

/** GamePhase: LOBBY. Waiting room shown before the host starts the game. */
export function Lobby({ roomCode, players, isHost, onStartGame }: LobbyProps) {
  const canStart = isHost && players.length >= GAME_CONFIG.minPlayers;

  return (
    <div className="flex flex-col items-center gap-6">
      <RoomCode code={roomCode} />

      <ul className="flex flex-wrap justify-center gap-3">
        {players.map((player) => (
          <li key={player.id} className="flex flex-col items-center gap-1">
            <PlayerAvatar player={player} />
            <span className="text-sm">{player.displayName}</span>
          </li>
        ))}
      </ul>

      {isHost && (
        <Button disabled={!canStart} onClick={onStartGame}>
          {canStart
            ? "Start Game"
            : `Waiting for ${GAME_CONFIG.minPlayers - players.length} more player(s)...`}
        </Button>
      )}
    </div>
  );
}
