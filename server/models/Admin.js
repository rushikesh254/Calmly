import mongoose from 'mongoose';

// Admin users who manage platform operations.
// Keep schema minimal; auth & role-based access handled elsewhere.
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  role: { type: String, enum: ['general-admin', 'mh-admin'], required: true },
});

// Single point of export for consistency across codebase.
const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
