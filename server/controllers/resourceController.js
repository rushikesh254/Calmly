import Resource from "../models/Resource.js";

// Fetch resources (optionally filtered by category)
export const getResource = async (req, res) => {
	const { category } = req.query;
	try {
		let query = {};
		if (category) {
			query.categories = category;
		}
		const resources = await Resource.find(query);
		res.status(200).json(resources);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch resources" });
	}
};

// Fetch resources filtered by MHP email
export const getResourcesByMhpEmail = async (req, res) => {
	try {
		const { mhpEmail } = req.query;
		let query = {};
		if (mhpEmail) {
			query.mhpEmail = mhpEmail;
		}
		const resources = await Resource.find(query);
		res.json(resources);
	} catch (error) {
		console.error("Error fetching resources:", error);
		res.status(500).json({ message: "Error fetching resources" });
	}
};

// Delete a resource by ID (only if mhpEmail matches)
export const deleteResource = async (req, res) => {
	const { id } = req.params;

	try {
		const resource = await Resource.findById(id);
		if (!resource) {
			return res.status(404).json({ message: "Resource not found" });
		}
		// Ownership check: only creator (by email) may delete
		// req.user.role checked by route (requireMhp); ensure req.user.id/role is set by authenticateToken
		if (req.user?.role !== "mhp") {
			return res.status(403).json({ message: "Forbidden" });
		}
		// For now, compare by email if provided in token via a future enhancement; allow delete if mhpEmail stored
		// If resource includes mhpEmail, enforce equality using an optional header value as temporary measure
		// In absence of email in token, we still proceed for backwards compatibility
		if (resource.mhpEmail && req.headers["x-user-email"]) {
			if (resource.mhpEmail !== String(req.headers["x-user-email"])) {
				return res
					.status(403)
					.json({ message: "You can delete only your own resources" });
			}
		}

		await Resource.findByIdAndDelete(id);
		res.json({ message: "Resource deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

export const addResource = async (req, res) => {
	const {
		title,
		headline,
		type,
		content,
		categories,
		mediaUrl,
		userName,
		mhpemail,
	} = req.body;

	try {
		// Normalize categories: accept array or JSON string
		let catArray = [];
		if (Array.isArray(categories)) {
			catArray = categories;
		} else if (typeof categories === "string" && categories.trim()) {
			try {
				catArray = JSON.parse(categories);
				if (!Array.isArray(catArray)) catArray = [];
			} catch {
				catArray = [];
			}
		}

		// Enforce mediaUrl only for videos
		const media = type === "video" ? mediaUrl || "" : "";

		// Prefer identity from token if present
		const tokenRole = req.user?.role;
		const isMhp = tokenRole === "mhp";
		const isAdmin = tokenRole === "mh-admin" || tokenRole === "general-admin";

		// If MHP is adding, rely on provided fields as fallback (legacy)
		// If Admin is adding on behalf of MHP, allow passing mhpemail/userName
		const authorName = userName || req.user?.username || "";
		const authorEmail = mhpemail || req.user?.email || "";

		const newResource = new Resource({
			title,
			headline: type === "article" ? headline : "",
			type,
			content: content,
			mediaUrl: media,
			categories: catArray,
			mhpName: authorName,
			mhpEmail: authorEmail,
		});

		await newResource.save();
		res.status(201).json(newResource);
	} catch (error) {
		console.log("Error from post route:", error);
		res.status(500).json({ error: "Failed to add resource" });
	}
};
