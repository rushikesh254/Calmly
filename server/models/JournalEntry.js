import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
	{
		attendeeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Attendee",
			required: true,
		},
		title: { type: String, default: "" },
		content: { type: String, required: true },
	},
	{ timestamps: true }
);

journalEntrySchema.index({ attendeeId: 1, createdAt: -1 });

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);
export default JournalEntry;
