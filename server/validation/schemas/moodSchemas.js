import { z } from "zod";

export const moodLogCreateSchema = z.object({
	// Align with controller/model: mood is a number between 1 and 10
	mood: z.number().int().min(1).max(10),
	// Optional note up to 500 chars; allow empty string as well
	note: z.string().max(500).optional().or(z.literal("")),
});
