import { GAME_CONFIG } from "@/constants/gameConfig";

/** Room-code characters. Excludes easily-confused glyphs (0/O, 1/I/L). */
const ROOM_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Longest display name a host may enter. */
export const DISPLAY_NAME_MAX_LENGTH = 20;

/**
 * Generate a random, human-shareable room code of GAME_CONFIG.roomCodeLength
 * characters. Uniqueness is enforced by the rooms.code unique constraint, not
 * here — callers retry on collision.
 */
export function generateRoomCode(): string {
  const length = GAME_CONFIG.roomCodeLength;
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ROOM_CODE_ALPHABET[bytes[i] % ROOM_CODE_ALPHABET.length];
  }
  return code;
}

export interface DisplayNameValidation {
  valid: boolean;
  /** Trimmed name, safe to send to the database when valid. */
  value: string;
  /** User-facing message when invalid; empty string when valid. */
  error: string;
}

/** Validate and normalise a host's display name. */
export function validateDisplayName(raw: string): DisplayNameValidation {
  const value = raw.trim();
  if (value.length === 0) {
    return { valid: false, value, error: "Please enter a display name." };
  }
  if (value.length > DISPLAY_NAME_MAX_LENGTH) {
    return {
      valid: false,
      value,
      error: `Display name must be ${DISPLAY_NAME_MAX_LENGTH} characters or fewer.`,
    };
  }
  return { valid: true, value, error: "" };
}
