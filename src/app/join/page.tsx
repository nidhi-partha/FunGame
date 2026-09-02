"use client";

/**
 * Player flow: enter a room code (or arrive here via a /room/[roomCode] link),
 * pick a display name, then join the Room as a Player and redirect into it.
 *
 * TODO: wire up to Supabase — look up the room by code, insert into `players`,
 * then router.push to /room/[roomCode].
 */
export default function JoinRoomPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-pink-50 p-6">
      <h1 className="text-2xl font-bold text-pink-700">Join a Game</h1>
      <p className="text-pink-900">TODO: room-code entry + display-name form.</p>
    </main>
  );
}
