"use client";

import { useState } from "react";
import type { Prompt } from "@/types";
import { Timer } from "@/components/shared/Timer";
import { Button } from "@/components/ui/button";
import { GAME_CONFIG } from "@/constants/gameConfig";

interface PromptRoundProps {
  prompt: Prompt;
  hasSubmitted: boolean;
  onSubmit: (text: string) => void;
  onTimerExpire?: () => void;
}

/** GamePhase: ANSWERING. Each player privately fills in the prompt on their own device. */
export function PromptRound({ prompt, hasSubmitted, onSubmit, onTimerExpire }: PromptRoundProps) {
  const [answer, setAnswer] = useState("");

  if (hasSubmitted) {
    return <p className="text-center text-pink-700">Answer submitted — waiting on everyone else...</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Timer durationSeconds={GAME_CONFIG.answeringDurationSeconds} onExpire={onTimerExpire} />
      <p className="text-xl font-medium">{prompt.text}</p>
      <input
        className="w-full max-w-md rounded-md border border-pink-200 px-3 py-2"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="type your answer..."
      />
      <Button disabled={answer.trim().length === 0} onClick={() => onSubmit(answer.trim())}>
        Submit
      </Button>
    </div>
  );
}
