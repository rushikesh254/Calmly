import Attendee from "../models/Attendee.js";
import MHP from "../models/MHP.js";
import bcrypt from "bcryptjs";
import { sendOTP } from "../services/emailService.js";

// In-memory store for OTPs. For production, use a persistent store like Redis.
const otpStore = new Map(); // key: `${role}:${email}` -> { otp, expiresAt }

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
	const { role, email } = req.body;

	let user;
	if (role === "attendee") user = await Attendee.findOne({ email });
	else if (role === "mhp") user = await MHP.findOne({ email });

	if (!user) return res.status(404).json({ error: "Invalid email" });

	const otp = Math.floor(1000 + Math.random() * 9000).toString();

	try {
		await sendOTP(email, otp);
		// store otp with 10 minute expiry
		otpStore.set(`${role}:${email}`, {
			otp,
			expiresAt: Date.now() + 10 * 60 * 1000,
		});
		res.json({ message: "OTP sent" });
	} catch (error) {
		res.status(500).json({ error: "Error sending email" });
	}
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
	const { role, email, newPassword, otp } = req.body;

	if (!otp) return res.status(400).json({ error: "OTP required" });

	const record = otpStore.get(`${role}:${email}`);
	if (!record)
		return res.status(400).json({ error: "No OTP requested for this email" });
	if (record.expiresAt < Date.now()) {
		otpStore.delete(`${role}:${email}`);
		return res.status(400).json({ error: "OTP expired" });
	}
	if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

	let user;
	if (role === "attendee") user = await Attendee.findOne({ email });
	else if (role === "mhp") user = await MHP.findOne({ email });

	if (!user) return res.status(404).json({ error: "User not found" });

	const hashedPassword = await bcrypt.hash(newPassword, 10);
	user.password = hashedPassword;
	await user.save();

	// remove used otp
	otpStore.delete(`${role}:${email}`);

	res.json({ message: "Password updated" });
};
