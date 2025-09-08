import mongoose from "mongoose";

// Scheduled therapy / consultation session.
const sessionSchema = new mongoose.Schema({
  attendee_email: { type: String, required: true, lowercase: true, trim: true }, // Denormalized attendee id
  professional_email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  }, // Denormalized professional id
  session_type: { type: String, enum: ["online", "offline"], required: true },
  session_status: {
    type: String,
    enum: ["pending", "approved", "declined", "completed"],
    default: "pending",
  },
  session_date: { type: Date, required: true }, // Scheduled start datetime
  recommendations: { type: String, default: "" }, // Post-session notes
  payment_status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  }, // Billing state
});

// Recent sessions per participant.
sessionSchema.index({ attendee_email: 1, session_date: -1 });
sessionSchema.index({ professional_email: 1, session_date: -1 });

const Session = mongoose.model("Session", sessionSchema);
export default Session;
