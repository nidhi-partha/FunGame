import { describe, it, expect } from "vitest";
import {
  generateRoomCode,
  validateDisplayName,
  DISPLAY_NAME_MAX_LENGTH,
} from "@/lib/room";
import { GAME_CONFIG } from "@/constants/gameConfig";

describe("generateRoomCode", () => {
  it("returns a code of the configured length", () => {
    expect(generateRoomCode()).toHaveLength(GAME_CONFIG.roomCodeLength);
  });

  it("uses only unambiguous uppercase letters and digits", () => {
    for (let i = 0; i < 100; i++) {
      expect(generateRoomCode()).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]+$/);
    }
  });
});

describe("validateDisplayName", () => {
  it("rejects an empty name", () => {
    expect(validateDisplayName("").valid).toBe(false);
  });

  it("rejects a whitespace-only name", () => {
    expect(validateDisplayName("   ").valid).toBe(false);
  });

  it("accepts and trims a valid name", () => {
    const result = validateDisplayName("  Nidhi  ");
    expect(result.valid).toBe(true);
    expect(result.value).toBe("Nidhi");
    expect(result.error).toBe("");
  });

  it("rejects a name longer than the max length", () => {
    const tooLong = "x".repeat(DISPLAY_NAME_MAX_LENGTH + 1);
    expect(validateDisplayName(tooLong).valid).toBe(false);
  });
});
