import jwt from 'jsonwebtoken';

// Verify JWT and attach a normalized user object to req.user.
// Expected claims: { id, role }. Accepts legacy keys for backward compatibility.
export const authenticateToken = (req, res, next) => {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
	if (!token) return res.status(401).json({ error: 'Unauthorized' });

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err || !decoded) return res.status(401).json({ error: 'Invalid token' });
		req.user = {
			id: decoded.id || decoded.userId || decoded._id || decoded.sub,
			role: decoded.role || decoded.userType || decoded.type || decoded.roleName,
		};
		if (!req.user.id || !req.user.role) {
			return res.status(400).json({ error: 'Token missing required claims' });
		}
		next();
	});
};

// Role gate factory. Example: requireRole('attendee') or requireRole(['general-admin','mh-admin']).
export const requireRole = (roles) => {
	const roleList = Array.isArray(roles) ? roles : [roles];
	return (req, res, next) => {
		if (!req.user || !roleList.includes(req.user.role)) {
			return res.status(403).json({ error: 'Forbidden' });
		}
		next();
	};
};

// Convenience exports.
export const requireAttendee = requireRole('attendee');
export const requireMhp = requireRole('mhp');
export const requireAdmin = requireRole(['general-admin', 'mh-admin']);
