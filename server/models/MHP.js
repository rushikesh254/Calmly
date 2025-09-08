import mongoose from "mongoose";

// Mental Health Professional profile.
// Stores core identity, verification status, and schedule references.
const mhpSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  // Was bmdcRegNo originally; exposed via virtual below for backward compatibility.
  licenseNumber: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true }, // Hashed password
  mobileNumber: { type: String },
  location: { type: String },
  rosterOnline: { type: Object, default: {} }, // Structured schedule data
  rosterOffline: { type: Object, default: {} }, // In‑person schedule data
  education: { type: String },
  status: {
    type: String,
    enum: ["approved", "rejected", "pending"],
    default: "pending",
  },
});

// Legacy alias for older code expecting bmdcRegNo.
mhpSchema.virtual("bmdcRegNo").get(function () {
  return this.licenseNumber;
});

mhpSchema.set("toJSON", { virtuals: true });
mhpSchema.set("toObject", { virtuals: true });

const MHP = mongoose.model("MHP", mhpSchema);
export default MHP;
