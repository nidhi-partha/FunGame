import type { Player } from "@/types";
import { cn } from "@/lib/utils";

interface PlayerAvatarProps {
  player: Pick<Player, "displayName" | "avatarEmoji">;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "h-6 w-6 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

/** Circular avatar: shows the player's chosen emoji, or their initial as a fallback. */
export function PlayerAvatar({ player, size = "md" }: PlayerAvatarProps) {
  const fallback = player.displayName.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-pink-100 font-semibold text-pink-700",
        SIZE_CLASSES[size]
      )}
      aria-label={player.displayName}
      title={player.displayName}
    >
      {player.avatarEmoji ?? fallback}
    </div>
  );
}
