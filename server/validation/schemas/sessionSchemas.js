import { z } from "zod";

export const sessionRequestSchema = z.object({
	attendee_email: z.string().email(),
	professional_email: z.string().email(),
	session_type: z.enum(["online", "offline"]),
	session_date: z.string().datetime().or(z.string().min(1)),
});

export const sessionApproveSchema = z.object({
	status: z.enum(["approved", "declined"]),
	scheduled_date: z.string().datetime().optional(),
});

export const sessionPaymentStatusSchema = z.object({
	paymentStatus: z.enum(["pending", "completed"]),
});
