import express from "express";
import {
  addRecommendations,
  approveSession,
  completeSession,
  getAllSessions,
  getSessionsByAttendee,
  getSessionsByProfessional,
  initiateSessionPayment,
  requestSession,
  updatePaymentStatus,
} from "../controllers/sessionController.js";
import {
  authenticateToken,
  requireAttendee,
  requireMhp,
  requireAdmin,
} from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  sessionRequestSchema,
  sessionApproveSchema,
  sessionPaymentStatusSchema,
} from "../validation/schemas/sessionSchemas.js";

const router = express.Router();

// Admin: view all sessions
router.get("/all", authenticateToken, requireAdmin, getAllSessions);
// MHP: sessions assigned to them
router.get("/", authenticateToken, requireMhp, getSessionsByProfessional);
// Attendee: their sessions
router.get(
  "/attendee",
  authenticateToken,
  requireAttendee,
  getSessionsByAttendee
);

// Session lifecycle
router.post(
  "/request",
  authenticateToken,
  requireAttendee,
  validate(sessionRequestSchema),
  requestSession
);
router.post(
  "/approve/:sessionId",
  authenticateToken,
  requireMhp,
  validate(sessionApproveSchema),
  approveSession
);
router.post(
  "/complete/:sessionId",
  authenticateToken,
  requireMhp,
  completeSession
);
router.post(
  "/recommendations/:sessionId",
  authenticateToken,
  requireMhp,
  addRecommendations
);
router.post(
  "/updatePaymentStatus/:sessionId",
  authenticateToken,
  requireMhp,
  validate(sessionPaymentStatusSchema),
  updatePaymentStatus
);

// Payment initiation (attendee)
router.post(
  "/initiatePayment",
  authenticateToken,
  requireAttendee,
  initiateSessionPayment
);

export default router;
