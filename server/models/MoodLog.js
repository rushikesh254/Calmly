import mongoose from 'mongoose';

// Mood tracking entries (1–10 scale) to monitor emotional trends.
const moodLogSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendee', required: true },
		mood: {
			type: Number,
			required: true,
			min: 1,
			max: 10,
			validate: {
				validator: (v) => v >= 1 && v <= 10,
				message: 'Mood must be between 1 and 10',
			},
		},
		note: { type: String, maxlength: 500, trim: true },
		date: { type: Date, default: Date.now }, // Separate from createdAt for explicit tracking
	},
	{ timestamps: true }
);

// Efficient retrieval of recent logs per user.
moodLogSchema.index({ userId: 1, date: -1 });

// Human friendly mood description derived from numeric value.
moodLogSchema.virtual('moodDescription').get(function () {
	const map = {
		1: 'Very Low',
		2: 'Low',
		3: 'Somewhat Low',
		4: 'Below Average',
		5: 'Neutral',
		6: 'Above Average',
		7: 'Good',
		8: 'Very Good',
		9: 'Excellent',
		10: 'Perfect',
	};
	return map[this.mood] || 'Unknown';
});

moodLogSchema.set('toJSON', { virtuals: true });
moodLogSchema.set('toObject', { virtuals: true });

const MoodLog = mongoose.model('MoodLog', moodLogSchema);
export default MoodLog;
