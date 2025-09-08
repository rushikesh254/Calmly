/**
 * MoodLog Model for Calmly Mental Health Platform
 * @author Rushikesh Bodke
 */
import mongoose from "mongoose";

const moodLogSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Attendee",
			required: true,
		},
		mood: {
			type: Number,
			required: true,
			min: 1,
			max: 10,
			validate: {
				validator: function (v) {
					return v >= 1 && v <= 10;
				},
				message: "Mood must be between 1 and 10",
			},
		},
		note: {
			type: String,
			maxlength: 500,
			trim: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

// Index for efficient queries
moodLogSchema.index({ userId: 1, date: -1 });

// Virtual for mood description
moodLogSchema.virtual("moodDescription").get(function () {
	const moodDescriptions = {
		1: "Very Low",
		2: "Low",
		3: "Somewhat Low",
		4: "Below Average",
		5: "Neutral",
		6: "Above Average",
		7: "Good",
		8: "Very Good",
		9: "Excellent",
		10: "Perfect",
	};
	return moodDescriptions[this.mood] || "Unknown";
});

// Ensure virtuals are serialized
moodLogSchema.set("toJSON", { virtuals: true });
moodLogSchema.set("toObject", { virtuals: true });

const MoodLog = mongoose.model("MoodLog", moodLogSchema);

export default MoodLog;
