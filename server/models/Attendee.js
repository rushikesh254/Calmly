import mongoose from "mongoose";

// End user (attendee) profile + authentication fields.
// Keep minimal. Extended profile data should live in separate docs if needed.
const attendeeSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true }, // Hashed password
  address: { type: String, default: "", trim: true },
  phoneNumber: { type: String, default: "" },
  age: { type: Number },
  sex: { type: String }, // Free-form; consider normalizing later
});

const Attendee = mongoose.model("Attendee", attendeeSchema);
export default Attendee;
