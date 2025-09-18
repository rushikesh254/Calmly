import jwt from "jsonwebtoken";

// authenticateToken: basic check to see if a token is present and valid.
// We also try a few different claim names because older tokens might use them.
export const authenticateToken = (req, res, next) => {
	// The token usually comes in the Authorization header like: "Bearer <token>"
	const authHeader = req.headers.authorization || "";
	const token = authHeader.startsWith("Bearer ")
		? authHeader.split(" ")[1]
		: authHeader;

	if (!token) {
		// keep same shape as before to avoid breaking clients
		return res.status(401).json({ error: "Unauthorized" });
	}

	// verify the token; if it's good, we grab the user info
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err || !decoded) {
			return res.status(401).json({ error: "Invalid token" });
		}

		// Try several keys for id/role so older tokens still work
		const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;
		const userRole =
			decoded.role || decoded.userType || decoded.type || decoded.roleName;

		req.user = { id: userId, role: userRole };

		if (!req.user.id || !req.user.role) {
			return res.status(400).json({ error: "Token missing required claims" });
		}

		next();
	});
};

// requireRole: only allow certain roles to access a route
export const requireRole = (roles) => {
	// Accept string or array, normalize to array for simple includes check
	const allowed = Array.isArray(roles) ? roles : [roles];
	return (req, res, next) => {
		// authenticateToken should run before this and fill req.user
		if (!req.user || !allowed.includes(req.user.role)) {
			return res.status(403).json({ error: "Forbidden" });
		}
		next();
	};
};

// quick helpers so routes read nicely
export const requireAttendee = requireRole("attendee");
export const requireMhp = requireRole("mhp");
export const requireAdmin = requireRole(["general-admin", "mh-admin"]);

// Optional student-style aliases (keeps our simpler names if needed elsewhere)
export const checkToken = authenticateToken;
export const checkRole = requireRole;
export const isAttendee = requireAttendee;
export const isMhp = requireMhp;
export const isAdmin = requireAdmin;
