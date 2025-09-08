import mongoose from "mongoose";

// Personal reflective note created by an attendee.
const journalEntrySchema = new mongoose.Schema(
  {
    attendeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendee",
      required: true,
    },
    title: { type: String, default: "", trim: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

// Support reverse chronological queries per attendee.
journalEntrySchema.index({ attendeeId: 1, createdAt: -1 });

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);
export default JournalEntry;
