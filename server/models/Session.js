import mongoose from 'mongoose';

// Scheduled therapy / consultation session record.
const sessionSchema = new mongoose.Schema({
	attendee_email: { type: String, required: true },          // Attendee identifier (denormalized)
	professional_email: { type: String, required: true },      // MHP identifier (denormalized)
	session_type: { type: String, enum: ['online', 'offline'], required: true },
	session_status: { type: String, enum: ['pending', 'approved', 'declined', 'completed'], default: 'pending' },
	session_date: { type: Date, required: true },              // Scheduled date/time
	recommendations: { type: String, default: '' },            // Professional notes post-session
	payment_status: { type: String, enum: ['pending', 'completed'], default: 'pending' }, // For online billing
});

// Common query patterns: recent sessions per attendee/professional.
sessionSchema.index({ attendee_email: 1, session_date: -1 });
sessionSchema.index({ professional_email: 1, session_date: -1 });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
