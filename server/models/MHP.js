import mongoose from "mongoose";

const MHPSchema = new mongoose.Schema({
	username: { type: String, required: true },
	// Renamed from bmdcRegNo -> licenseNumber
	licenseNumber: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	mobileNumber: { type: String },
	location: { type: String },
	rosterOnline: { type: Object, default: {} },
	rosterOffline: { type: Object, default: {} },
	education: { type: String },
	status: {
		type: String,
		enum: ["approved", "rejected", "pending"],
		default: "pending",
	},
});

// Backward compatibility virtual (legacy reads expecting bmdcRegNo)
MHPSchema.virtual("bmdcRegNo").get(function () {
	return this.licenseNumber;
});

MHPSchema.set("toJSON", { virtuals: true });
MHPSchema.set("toObject", { virtuals: true });

const MHP = mongoose.model("MHP", MHPSchema);
export default MHP;
