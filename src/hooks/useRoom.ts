"use client";

import type { Room } from "@/types";

interface UseRoomResult {
  room: Room | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Loads a Room by its code. Used on the /room/[roomCode] screen to resolve the
 * code in the URL into a Room row before rendering the lobby/game.
 *
 * TODO: replace this with a real Supabase query
 * (`supabase.from("rooms").select().eq("code", roomCode).single()`), run from a
 * `useEffect` that sets isLoading/error/room from the query's callback, once the
 * `rooms` table exists (see docs/database-schema.md). Left as a static "not loaded"
 * placeholder for now rather than a fake effect, since there's no real async work yet.
 */
export function useRoom(roomCode: string): UseRoomResult {
  void roomCode;
  return { room: null, isLoading: false, error: null };
}
