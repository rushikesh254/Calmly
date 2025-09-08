import mongoose from 'mongoose';

// Mental Health Professional (therapist / counselor) profile.
const MHPSchema = new mongoose.Schema({
	username: { type: String, required: true },
	// Previously named bmdcRegNo. Kept a virtual for backward compatibility.
	licenseNumber: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true }, // Hashed password
	mobileNumber: { type: String },
	location: { type: String },
	rosterOnline: { type: Object, default: {} },  // Structured schedule data
	rosterOffline: { type: Object, default: {} }, // In-person schedule
	education: { type: String },
	status: { type: String, enum: ['approved', 'rejected', 'pending'], default: 'pending' },
});

// Support legacy property access (bmdcRegNo) without duplicating data.
MHPSchema.virtual('bmdcRegNo').get(function () {
	return this.licenseNumber;
});

MHPSchema.set('toJSON', { virtuals: true });
MHPSchema.set('toObject', { virtuals: true });

const MHP = mongoose.model('MHP', MHPSchema);
export default MHP;
