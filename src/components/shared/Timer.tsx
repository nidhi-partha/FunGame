"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  durationSeconds: number;
  onExpire?: () => void;
}

/**
 * Simple countdown display used during ANSWERING/VOTING phases.
 * TODO: once round timing is authoritative in Supabase (a `phase_ends_at` timestamp),
 * derive `durationSeconds` from that instead of trusting the client's own clock.
 */
export function Timer({ durationSeconds, onExpire }: TimerProps) {
  const [trackedDuration, setTrackedDuration] = useState(durationSeconds);
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);

  // Reset the countdown when the parent gives us a new duration (e.g. next round).
  // Setting state during render (rather than in an effect) is the recommended way
  // to adjust state in response to a prop change: https://react.dev/learn/you-might-not-need-an-effect
  if (durationSeconds !== trackedDuration) {
    setTrackedDuration(durationSeconds);
    setSecondsLeft(durationSeconds);
  }

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire?.();
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, onExpire]);

  return (
    <div className="font-mono text-sm text-pink-700" role="timer">
      {secondsLeft}s
    </div>
  );
}
