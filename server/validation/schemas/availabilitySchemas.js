import { z } from "zod";

export const availabilityCreateSchema = z.object({
	start: z.string().datetime(), // ISO strings
	end: z.string().datetime(),
	slots: z.number().int().positive().max(100),
});
