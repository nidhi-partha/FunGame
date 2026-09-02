/**
 * A Room is the top-level container players join via a code or link.
 * One Room has many Players and (at most) one active Game at a time.
 */

export type RoomId = string; // uuid
export type RoomCode = string; // short human-friendly code shown to players, e.g. "PINK42"

export interface Room {
  id: RoomId;
  code: RoomCode;
  hostId: string; // Player.id of whoever created the room
  createdAt: string; // ISO timestamp
  maxPlayers: number | null;
  isActive: boolean;
}
