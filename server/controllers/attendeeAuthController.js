import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Attendee from "../models/Attendee.js";

// A function to get all attendee profiles.
export const getAllAttendeeProfile = async (req, res) => {
	try {
		// Find all attendees but don't include their password.
		const attendees = await Attendee.find({}, { password: 0, __v: 0 });
		res.status(200).json(attendees);
	} catch (err) {
		// If something goes wrong, send an error (keep original message so UI doesn't change)
		res.status(500).json({ error: "Failed to fetch attendees" });
	}
};

// A function to let a new attendee sign up.
export const signupAttendee = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		// First, check if an account with this email already exists.
		const userAlreadyExists = await Attendee.findOne({ email });
		if (userAlreadyExists) {
			// Email already in use -> 409 Conflict (this was the original behavior)
			return res.status(409).json({ message: "Email already exists" });
		}

		// "Hash" the password to make it secure.
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new attendee with the provided details.
		const newAttendee = new Attendee({
			username,
			email,
			password: hashedPassword,
		});

		// Save the new attendee to the database.
		await newAttendee.save();

		// Let the user know that the signup was successful (original message)
		res.status(201).json({ message: "Attendee signed up successfully" });
	} catch (error) {
		// If there was a problem, send the error message (original behavior)
		res.status(500).json({ message: error.message });
	}
};

// A function to let an existing attendee sign in.
export const signinAttendee = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Find the attendee with the matching email.
		const user = await Attendee.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ message: "No account found with that email." });
		}

		// Check if the password they entered matches the one in the database.
		const passwordMatches = await bcrypt.compare(password, user.password);
		if (!passwordMatches) {
			return res.status(401).json({ message: "Wrong password." });
		}

		// If the password is correct, create a "token" to keep them logged in.
		const token = jwt.sign(
			{ id: user._id, role: "attendee" },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" } // The token will expire in 1 hour.
		);

		// Send back a success message and the token (original message)
		res.status(200).json({
			message: "Login successful",
			token: token,
			role: "attendee",
			userId: user._id,
			userName: user.username,
			email: user.email,
		});
	} catch (error) {
		// If something went wrong, send the error message (original behavior)
		res.status(500).json({ message: error.message });
	}
};

// A function to get a specific attendee's profile.
export const getAttendeeProfile = async (req, res) => {
	const { userName } = req.params; // Get the username from the URL.

	try {
		// Find the attendee by their username.
		const attendee = await Attendee.findOne({ username: userName });
		if (!attendee) {
			return res.status(404).json({ message: "Attendee not found." });
		}

		// Send back the attendee's public profile information.
		res.status(200).json({
			username: attendee.username,
			email: attendee.email,
			address: attendee.address,
			phoneNumber: attendee.phoneNumber,
			age: attendee.age,
			sex: attendee.sex,
		});
	} catch (error) {
		// Keep original error response
		res.status(500).json({ message: error.message });
	}
};

export const updateAttendeeProfile = async (req, res) => {
	const { userName } = req.params; // Get userName from URL params
	// Destructure only the editable fields
	const { address, phoneNumber, age, sex } = req.body;
	try {
		const attendee = await Attendee.findOne({ username: userName });
		if (!attendee) {
			return res.status(404).json({ message: "Attendee not found" });
		}

		attendee.address = address || attendee.address;
		attendee.phoneNumber = phoneNumber || attendee.phoneNumber;
		attendee.age = age || attendee.age;
		attendee.sex = sex || attendee.sex;

		await attendee.save();

		res.status(200).json({
			message: "Profile updated successfully",
			attendee: {
				username: attendee.username,
				email: attendee.email,
				address: attendee.address,
				phoneNumber: attendee.phoneNumber,
				age: attendee.age,
				sex: attendee.sex,
			},
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
