import Availability from "../models/Availability.js";
import MHP from "../models/MHP.js";

/**
 * Create availability slots for the authenticated professional.
 * Accepts bulk array of slots: [{ date, startTime, endTime }].
 * Ignores duplicate key errors (same slot) silently.
 */
export const createAvailability = async (req, res) => {
	try {
		const professionalId = req.user.id; // from auth
		const { slots } = req.body; // [{date, startTime, endTime}]
		if (!Array.isArray(slots) || slots.length === 0)
			return res.status(400).json({ error: "slots array required" });

		const docs = slots.map((s) => ({
			professionalId,
			date: s.date,
			startTime: s.startTime,
			endTime: s.endTime,
		}));
		const created = await Availability.insertMany(docs, {
			ordered: false,
		}).catch((e) => {
			// ignore duplicate errors
			return [];
		});
		res
			.status(201)
			.json({ message: "Availability saved", count: created.length });
	} catch (err) {
		res.status(500).json({ error: "Failed to create availability" });
	}
};

/**
 * Retrieve unbooked slots for a given professional ordered by date/time.
 */
export const getAvailabilityForProfessional = async (req, res) => {
	try {
		const { id } = req.params; // professionalId
		const slots = await Availability.find({
			professionalId: id,
			isBooked: false,
		}).sort({ date: 1, startTime: 1 });
		res.json(slots);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch availability" });
	}
};

/**
 * Book a specific availability slot for the authenticated attendee.
 * Marks slot as booked; future enhancement: associate attendee & create session.
 */
export const bookAvailability = async (req, res) => {
	try {
		const { availabilityId } = req.params;
		const attendeeId = req.user.id; // we might store attendee later

		const slot = await Availability.findById(availabilityId)
			.select("isBooked")
			.exec();
		if (!slot) return res.status(404).json({ error: "Slot not found" });
		if (slot.isBooked)
			return res.status(400).json({ error: "Slot already booked" });

		slot.isBooked = true;
		slot.bookedAt = new Date();
		await slot.save();
		res.json({ message: "Slot booked", slotId: slot._id });
	} catch (err) {
		res.status(500).json({ error: "Failed to book slot" });
	}
};
