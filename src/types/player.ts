import type { RoomId } from "./room";

export type PlayerId = string; // uuid

export interface Player {
  id: PlayerId;
  roomId: RoomId;
  displayName: string;
  avatarEmoji: string | null;
  isHost: boolean;
  joinedAt: string; // ISO timestamp
  score: number;
}
