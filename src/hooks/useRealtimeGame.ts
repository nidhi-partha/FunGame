"use client";

import type { Game, Round, Player } from "@/types";

interface RealtimeGameState {
  game: Game | null;
  round: Round | null;
  players: Player[];
  isConnected: boolean;
}

/**
 * Subscribes to Supabase Realtime for a given room and keeps game/round/players state
 * in sync across every connected client. This is the one place that should talk to
 * `supabase.channel(...)` for game state — keep other components/hooks reading from
 * this hook (or useGame, which wraps it) rather than opening their own subscriptions.
 *
 * TODO: implement the actual channel subscription (postgres_changes or broadcast) in a
 * `useEffect`, calling `setState` from the subscription's event callback, once the
 * `games`/`rounds`/`players` tables exist. Returning a static empty state for now
 * (rather than an effect with nothing to subscribe to yet) so consumers can be built
 * against a stable shape.
 */
export function useRealtimeGame(roomId: string | null): RealtimeGameState {
  void roomId;
  return { game: null, round: null, players: [], isConnected: false };
}
