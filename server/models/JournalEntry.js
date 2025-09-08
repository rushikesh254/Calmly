import mongoose from 'mongoose';

// Personal reflective notes written by attendees.
const journalEntrySchema = new mongoose.Schema(
	{
		attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendee', required: true },
		title: { type: String, default: '' },
		content: { type: String, required: true },
	},
	{ timestamps: true }
);

// Query recent entries per attendee efficiently.
journalEntrySchema.index({ attendeeId: 1, createdAt: -1 });

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);
export default JournalEntry;
