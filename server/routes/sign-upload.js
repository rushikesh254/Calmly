import express from "express";
import { generateSignature } from "../controllers/sign-upload.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/sign-upload - Generate cloud upload signature
// Only allow MHPs and Admins to request upload signatures
router.post(
  "/",
  authenticateToken,
  requireRole(["mhp", "mh-admin", "general-admin"]),
  generateSignature
);

export default router;
