"use client";

import { use } from "react";

interface RoomPageProps {
  params: Promise<{ roomCode: string }>;
}

/**
 * The main game screen. Renders whichever components/game/*.tsx matches the
 * current GamePhase (see useGame()) — this page should stay a thin switch
 * statement; put actual screen logic in the components/game files.
 *
 * TODO: use useRoom(roomCode) + useGame(room.id) once Supabase is wired up,
 * then switch on `phase` to render Lobby / PromptRound / StatementReveal /
 * VotingRound / Results / Leaderboard / FinalResults.
 */
export default function RoomPage({ params }: RoomPageProps) {
  const { roomCode } = use(params);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-pink-50 p-6">
      <h1 className="text-2xl font-bold text-pink-700">Room {roomCode}</h1>
      <p className="text-pink-900">TODO: render the current GamePhase screen.</p>
    </main>
  );
}
