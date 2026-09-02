"use client";

import type { RoomCode as RoomCodeType } from "@/types";

interface RoomCodeProps {
  code: RoomCodeType;
}

/**
 * Displays the room code prominently for the host to read aloud/share.
 * TODO: add a copy-to-clipboard button and a "copy join link" action once
 * the /join and /room/[roomCode] flows are implemented.
 */
export function RoomCode({ code }: RoomCodeProps) {
  return (
    <div className="rounded-lg border-2 border-dashed border-pink-300 bg-pink-50 px-6 py-3 text-center">
      <p className="text-xs uppercase tracking-wide text-pink-500">Room Code</p>
      <p className="text-2xl font-bold tracking-widest text-pink-700">{code}</p>
    </div>
  );
}
