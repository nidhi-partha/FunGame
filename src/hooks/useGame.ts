"use client";

import { useRealtimeGame } from "./useRealtimeGame";
import type { GamePhase } from "@/types";

interface UseGameResult {
  phase: GamePhase;
  currentRoundIndex: number;
  totalRounds: number;
  players: ReturnType<typeof useRealtimeGame>["players"];
  isConnected: boolean;
}

/**
 * Top-level hook game screens should use to read current phase + round info.
 * Thin wrapper over useRealtimeGame — keeps components decoupled from *how*
 * realtime sync works, so that implementation can change without touching every screen.
 */
export function useGame(roomId: string | null): UseGameResult {
  const { game, players, isConnected } = useRealtimeGame(roomId);

  return {
    phase: game?.phase ?? "LOBBY",
    currentRoundIndex: game?.currentRoundIndex ?? 0,
    totalRounds: game?.totalRounds ?? 0,
    players,
    isConnected,
  };
}
