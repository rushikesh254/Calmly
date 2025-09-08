import { z } from "zod";

// Schema accepts categories either as JSON string or array of strings
const categoriesSchema = z
	.union([
		z.string().transform((val) => {
			try {
				const parsed = JSON.parse(val);
				return Array.isArray(parsed) ? parsed : [];
			} catch {
				return [];
			}
		}),
		z.array(z.string()),
	])
	.optional();

export const resourceCreateSchema = z
	.object({
		title: z.string().min(3).max(120),
		type: z.enum(["article", "video"]),
		content: z.string().min(1),
		headline: z.string().max(200).optional(),
		mediaUrl: z.string().url().optional(),
		categories: categoriesSchema,
		userName: z.string().optional(),
		mhpemail: z.string().email().optional(),
	})
	.refine(
		(data) =>
			data.type === "video"
				? typeof data.mediaUrl === "string" && data.mediaUrl.length > 0
				: true,
		{ message: "mediaUrl is required for video type", path: ["mediaUrl"] }
	);
