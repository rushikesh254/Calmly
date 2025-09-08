/**
 * MoodLog Controller for Calmly Mental Health Platform
 * @author Rushikesh Bodke
 */
import MoodLog from "../models/MoodLog.js";

// Save a new mood log
export const saveMoodLog = async (req, res) => {
	try {
		const { mood, note } = req.body;
		const userId = req.user.id; // From auth middleware

		// Validate mood value
		if (!mood || mood < 1 || mood > 10) {
			return res.status(400).json({
				success: false,
				message: "Mood must be a number between 1 and 10",
			});
		}

		// Create new mood log
		const moodLog = new MoodLog({
			userId,
			mood,
			note: note || "",
			date: new Date(),
		});

		await moodLog.save();

		res.status(201).json({
			success: true,
			message: "Mood log saved successfully",
			data: moodLog,
		});
	} catch (error) {
		console.error("Error saving mood log:", error);
		res.status(500).json({
			success: false,
			message: "Failed to save mood log",
			error: error.message,
		});
	}
};

// Get mood history for the logged-in user
export const getMoodHistory = async (req, res) => {
	try {
		const userId = req.user.id; // From auth middleware
		const { limit = 30, page = 1 } = req.query; // Default to last 30 entries

		const skip = (parseInt(page) - 1) * parseInt(limit);

		// Get mood logs with pagination
		const moodLogs = await MoodLog.find({ userId })
			.sort({ date: -1 })
			.limit(parseInt(limit))
			.skip(skip)
			.lean();

		// Get total count for pagination
		const totalCount = await MoodLog.countDocuments({ userId });

		// Calculate average mood for the period
		const averageMood =
			moodLogs.length > 0
				? moodLogs.reduce((sum, log) => sum + log.mood, 0) / moodLogs.length
				: 0;

		// Get mood trends (last 7 days)
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const recentLogs = await MoodLog.find({
			userId,
			date: { $gte: sevenDaysAgo },
		})
			.sort({ date: 1 })
			.lean();

		res.status(200).json({
			success: true,
			data: {
				moodLogs,
				pagination: {
					currentPage: parseInt(page),
					totalPages: Math.ceil(totalCount / parseInt(limit)),
					totalCount,
					hasNextPage: skip + moodLogs.length < totalCount,
					hasPrevPage: parseInt(page) > 1,
				},
				analytics: {
					averageMood: Math.round(averageMood * 10) / 10,
					totalEntries: totalCount,
					recentTrend: recentLogs,
				},
			},
		});
	} catch (error) {
		console.error("Error fetching mood history:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch mood history",
			error: error.message,
		});
	}
};

// Get mood statistics
export const getMoodStats = async (req, res) => {
	try {
		const userId = req.user.id;

		// Get mood distribution for the last 30 days
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const recentLogs = await MoodLog.find({
			userId,
			date: { $gte: thirtyDaysAgo },
		}).lean();

		// Calculate statistics
		const moodDistribution = {};
		let totalMood = 0;
		let totalEntries = recentLogs.length;

		recentLogs.forEach((log) => {
			moodDistribution[log.mood] = (moodDistribution[log.mood] || 0) + 1;
			totalMood += log.mood;
		});

		const averageMood = totalEntries > 0 ? totalMood / totalEntries : 0;

		// Get most common mood safely
		let mostCommonMood = 0;
		const moodKeys = Object.keys(moodDistribution);
		if (moodKeys.length > 0) {
			const key = moodKeys.reduce((a, b) =>
				moodDistribution[a] > moodDistribution[b] ? a : b
			);
			mostCommonMood = parseInt(key, 10) || 0;
		}

		res.status(200).json({
			success: true,
			data: {
				averageMood: Math.round(averageMood * 10) / 10,
				mostCommonMood,
				moodDistribution,
				totalEntries,
				period: "30 days",
			},
		});
	} catch (error) {
		console.error("Error fetching mood stats:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch mood statistics",
			error: error.message,
		});
	}
};
