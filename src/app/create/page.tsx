"use client";

/**
 * Host flow: pick a display name, create a Room row (+ get a generated room code),
 * then redirect to /room/[roomCode] as the host.
 *
 * TODO: wire up to Supabase — insert into `rooms`, insert the host into `players`,
 * generate a unique code (see GAME_CONFIG.roomCodeLength), then router.push to the room.
 */
export default function CreateRoomPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-pink-50 p-6">
      <h1 className="text-2xl font-bold text-pink-700">Host a Game</h1>
      <p className="text-pink-900">TODO: display-name form + room creation.</p>
    </main>
  );
}
