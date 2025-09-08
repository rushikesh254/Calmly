import mongoose from 'mongoose';

// Represents a single availability slot for a mental health professional (MHP).
// date + startTime uniqueness per professional prevents double booking.
const availabilitySchema = new mongoose.Schema({
	professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'MHP', required: true },
	date: { type: String, required: true },      // Format: YYYY-MM-DD
	startTime: { type: String, required: true }, // Format: HH:MM (24h)
	endTime: { type: String, required: true },
	isBooked: { type: Boolean, default: false },
	bookedAt: { type: Date },                    // Timestamp when booked
	createdAt: { type: Date, default: Date.now },
});

// Fast lookup + prevent duplicate slot creation per professional.
availabilitySchema.index({ professionalId: 1, date: 1, startTime: 1 }, { unique: true });

const Availability = mongoose.model('Availability', availabilitySchema);
export default Availability;
