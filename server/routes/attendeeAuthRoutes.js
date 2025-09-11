import express from "express";
import {
  signupAttendee,
  signinAttendee,
  getAttendeeProfile,
  updateAttendeeProfile,
  getAllAttendeeProfile,
} from "../controllers/attendeeAuthController.js";
import {
  authenticateToken,
  requireAttendee,
  requireAdmin,
} from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  signupAttendeeSchema,
  loginSchema,
} from "../validation/schemas/authSchemas.js";

const router = express.Router();

// Signup / Signin
router.post("/signup/attendee", validate(signupAttendeeSchema), signupAttendee);
router.post("/signin", validate(loginSchema), signinAttendee);

// Listing and profile access
router.get("/all", authenticateToken, requireAdmin, getAllAttendeeProfile);
router.get("/:userName", getAttendeeProfile); // public fetch by username

// Protected profile update (self)
router.put(
  "/:userName",
  authenticateToken,
  requireAttendee,
  updateAttendeeProfile
);

export default router;
