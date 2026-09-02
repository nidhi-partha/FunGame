import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes conditionally. Standard shadcn/ui helper — used by every ui/ component. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
