import jwt from "jsonwebtoken";

// Authenticate request via JWT and attach normalized user { id, role } to req.user.
// Supports several legacy claim names for backward compatibility.
export const authenticateToken = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded)
      return res.status(401).json({ error: "Invalid token" });
    req.user = {
      id: decoded.id || decoded.userId || decoded._id || decoded.sub,
      role:
        decoded.role || decoded.userType || decoded.type || decoded.roleName,
    };
    if (!req.user.id || !req.user.role) {
      return res.status(400).json({ error: "Token missing required claims" });
    }
    next();
  });
};

// Role authorization middleware factory.
export const requireRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};

// Quick role helpers.
export const requireAttendee = requireRole("attendee");
export const requireMhp = requireRole("mhp");
export const requireAdmin = requireRole(["general-admin", "mh-admin"]);
