import express from "express";
import {
  signupMHP,
  signinMHP,
  getProfile,
  updateProfile,
  updateRegistrationStatus,
  getPendingMHPRequests,
} from "../controllers/mhpAuthController.js";
import {
  authenticateToken,
  requireMhp,
  requireAdmin,
} from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  signupMHPSchema,
  loginSchema,
} from "../validation/schemas/authSchemas.js";

const router = express.Router();

// Auth
router.post("/signup/mhp", validate(signupMHPSchema), signupMHP);
router.post("/signin", validate(loginSchema), signinMHP);

// Admin-only registration actions
router.get("/requests", authenticateToken, requireAdmin, getPendingMHPRequests);
router.put(
  "/status/:userName",
  authenticateToken,
  requireAdmin,
  updateRegistrationStatus
);

// Profile access + update
router.get("/:userName", getProfile);
router.put("/:userName", authenticateToken, requireMhp, updateProfile);

export default router;
