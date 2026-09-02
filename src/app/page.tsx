import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-pink-50 p-6 text-center">
      <h1 className="text-4xl font-bold text-pink-700">💗 Guess Who Said It</h1>
      <p className="max-w-md text-pink-900">
        Anonymous confessions, live guessing, and (maybe) an AI bluff or two. Gather your friends
        and find out who really said it.
      </p>
      <div className="flex gap-3">
        <Link href="/create">
          <Button>Host a Game</Button>
        </Link>
        <Link href="/join">
          <Button variant="outline">Join a Game</Button>
        </Link>
      </div>
    </main>
  );
}
