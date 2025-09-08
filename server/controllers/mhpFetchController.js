import MHP from "../models/MHP.js";

/**
 * GET all mental health professionals.
 * Future: add pagination, status filtering, and projection for privacy.
 */
export const getAllProfessionals = async (req, res) => {
	try {
		const professionals = await MHP.find().lean();
		res.status(200).json(professionals);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch professionals" });
	}
};
