import { z } from "zod";

export const signupAttendeeSchema = z.object({
	username: z.string().min(3).max(50),
	email: z.string().email(),
	password: z.string().min(8).max(128),
});

export const signupMHPSchema = z.object({
	username: z.string().min(3).max(50),
	licenseNumber: z.string().min(3).max(50),
	email: z.string().email(),
	password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});
