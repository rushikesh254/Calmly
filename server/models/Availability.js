import mongoose from "mongoose";

// A single availability slot for a mental health professional (MHP).
// Uniqueness on professional + date + start time avoids double booking.
const availabilitySchema = new mongoose.Schema({
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MHP",
    required: true,
  },
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:MM (24h)
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  bookedAt: { type: Date }, // Set when a booking occurs
  createdAt: { type: Date, default: Date.now },
});

availabilitySchema.index(
  { professionalId: 1, date: 1, startTime: 1 },
  { unique: true }
);

const Availability = mongoose.model("Availability", availabilitySchema);
export default Availability;
