import express from "express";
import {
  createAvailability,
  getAvailabilityForProfessional,
  bookAvailability,
} from "../controllers/availabilityController.js";
import {
  authenticateToken,
  requireMhp,
  requireAttendee,
} from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { availabilityCreateSchema } from "../validation/schemas/availabilitySchemas.js";

const router = express.Router();

// Create availability slots (MHP only)
router.post(
  "/availability",
  authenticateToken,
  requireMhp,
  validate(availabilityCreateSchema),
  createAvailability
);
// Fetch availability for a professional
router.get("/availability/:id", getAvailabilityForProfessional);
// Book a slot (attendee)
router.post(
  "/book/:availabilityId",
  authenticateToken,
  requireAttendee,
  bookAvailability
);

export default router;
