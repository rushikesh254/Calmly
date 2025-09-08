import JournalEntry from "../models/JournalEntry.js";

// List entries for the authenticated attendee
export const listJournalEntries = async (req, res) => {
	const { page = 1, limit = 20 } = req.query;
	const skip = (Number(page) - 1) * Number(limit);
	try {
		const [items, total] = await Promise.all([
			JournalEntry.find({ attendeeId: req.user.id })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(Number(limit))
				.lean(),
			JournalEntry.countDocuments({ attendeeId: req.user.id }),
		]);
		res.json({ items, page: Number(page), limit: Number(limit), total });
	} catch (e) {
		res.status(500).json({ error: "Failed to fetch journal entries" });
	}
};

// Create new entry
export const createJournalEntry = async (req, res) => {
	const { title = "", content } = req.body;
	if (!content || String(content).trim().length === 0) {
		return res.status(400).json({ error: "Content is required" });
	}
	try {
		const entry = await JournalEntry.create({
			attendeeId: req.user.id,
			title,
			content,
		});
		res.status(201).json(entry);
	} catch (e) {
		res.status(500).json({ error: "Failed to create journal entry" });
	}
};

// Update entry (only owner)
export const updateJournalEntry = async (req, res) => {
	const { id } = req.params;
	const { title, content } = req.body;
	try {
		const entry = await JournalEntry.findOne({
			_id: id,
			attendeeId: req.user.id,
		});
		if (!entry) return res.status(404).json({ error: "Entry not found" });
		if (title !== undefined) entry.title = title;
		if (content !== undefined) entry.content = content;
		await entry.save();
		res.json(entry);
	} catch (e) {
		res.status(500).json({ error: "Failed to update journal entry" });
	}
};

// Delete entry (only owner)
export const deleteJournalEntry = async (req, res) => {
	const { id } = req.params;
	try {
		const result = await JournalEntry.deleteOne({
			_id: id,
			attendeeId: req.user.id,
		});
		if (result.deletedCount === 0)
			return res.status(404).json({ error: "Entry not found" });
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: "Failed to delete journal entry" });
	}
};
