import mongoose from "mongoose";

// Admin account for managing platform operations.
// Only core identity + role are stored here; permissions handled elsewhere.
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true }, // Hashed password (never store plain text)
  role: { type: String, enum: ["general-admin", "mh-admin"], required: true },
});

// Centralized model export.
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
