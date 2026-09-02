import type { Prompt } from "@/types";

/**
 * Starter prompt bank. Fill-in-the-blank style statements shown to all players each round.
 * TODO: move this to the `prompts` table once Supabase is wired up (see docs/database-schema.md);
 * this array is just enough to develop against locally.
 */
export const STARTER_PROMPTS: Prompt[] = [
  { id: "p1", text: "I once ________ and never told anyone.", category: "confession" },
  { id: "p2", text: "The pettiest thing I've ever done is ________.", category: "petty" },
  { id: "p3", text: "I'm secretly really good at ________.", category: "flex" },
  { id: "p4", text: "If I could get away with it, I would ________.", category: "confession" },
  { id: "p5", text: "The weirdest thing in my search history is ________.", category: "chaotic" },
];
