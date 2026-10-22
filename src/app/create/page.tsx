"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  generateRoomCode,
  validateDisplayName,
  DISPLAY_NAME_MAX_LENGTH,
} from "@/lib/room";

/** How many times to retry if a generated room code collides with an existing one. */
const MAX_CODE_ATTEMPTS = 5;

/**
 * Host flow: pick a display name, atomically create a Room + host Player via the
 * create_room_with_host RPC, then redirect to /room/[roomCode].
 */
export default function CreateRoomPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const check = validateDisplayName(displayName);
    if (!check.valid) {
      setError(check.error);
      return;
    }

    setError("");
    setIsSubmitting(true);

    const supabase = createClient();

    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const code = generateRoomCode();
      const { error: rpcError } = await supabase.rpc("create_room_with_host", {
        p_display_name: check.value,
        p_code: code,
      });

      if (!rpcError) {
        router.push(`/room/${code}`);
        return;
      }

      // 23505 = unique_violation: this code is taken, generate another and retry.
      if (rpcError.code !== "23505") {
        setError("Something went wrong creating your room. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    setError("Couldn't find a free room code. Please try again.");
    setIsSubmitting(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-pink-50 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-pink-700">Host a Game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm text-pink-900">
              Your display name
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={DISPLAY_NAME_MAX_LENGTH}
                autoFocus
                disabled={isSubmitting}
                placeholder="e.g. Nidhi"
                className="rounded-md border border-pink-300 px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
              />
            </label>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create Room"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
