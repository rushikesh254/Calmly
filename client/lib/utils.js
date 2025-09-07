import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes with conditional logic, letting later utilities override earlier ones.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
