import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Small helper to combine class names.
// I kept it simple: it just merges Tailwind classes and handles conditions.
export function cn(...inputs) {
	return twMerge(clsx(inputs));
}
