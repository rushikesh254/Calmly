import mongoose from 'mongoose';

// Platform end user (attendee) account information.
// Only core profile + auth related fields are stored here.
const attendeeSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Unique login identity
  password: { type: String, required: true }, // Hashed password
  address: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  age: { type: Number },
  sex: { type: String }, // Free-form; could be normalized later
});

const Attendee = mongoose.model('Attendee', attendeeSchema);
export default Attendee;
