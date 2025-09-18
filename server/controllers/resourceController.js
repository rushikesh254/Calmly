// Resources controller: basic CRUD-like actions for articles/videos.
// Added explanations so it's easier to understand.
import Resource from "../models/Resource.js";
import MHP from "../models/MHP.js";

// Fetch resources (optionally filtered by category)
export const getResource = async (req, res) => {
	const { category, type } = req.query;
	try {
		const query = {};
		if (category) query.categories = category;
		if (type && ["article", "video"].includes(String(type))) query.type = type;
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
		// Authorization: allowed roles handled in route (mhp, mh-admin, general-admin)
		// Additional safeguard here in case route changes in the future
		const role = req.user?.role;
		const isAdmin = role === "mh-admin" || role === "general-admin";
		const isMhp = role === "mhp";
		if (!isAdmin && !isMhp) {
			return res.status(403).json({ message: "Forbidden" });
		}
		// If MHP is deleting, and resource has an author email, ensure ownership when email is available via header
		if (isMhp && resource.mhpEmail) {
			try {
				// Resolve authenticated MHP's email from DB to compare with resource author
				const mhp = await MHP.findById(req.user.id).select({ email: 1 });
				const authedEmail = mhp?.email?.toLowerCase();
				const ownerEmail = String(resource.mhpEmail).toLowerCase();
				if (!authedEmail || authedEmail !== ownerEmail) {
					return res
						.status(403)
						.json({ message: "You can delete only your own resources" });
				}
			} catch {
				return res.status(403).json({ message: "Forbidden" });
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

		// Resolve author identity
		let authorName = userName || "";
		let authorEmail = mhpemail || "";
		if (isMhp && req.user?.id) {
			try {
				const mhp = await MHP.findById(req.user.id).select({
					username: 1,
					email: 1,
				});
				if (mhp) {
					authorName = mhp.username || authorName;
					authorEmail = mhp.email || authorEmail;
				}
			} catch {
				// keep fallbacks
			}
		}

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
