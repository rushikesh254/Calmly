import express from "express";
import {
  authenticateToken,
  requireAttendee,
} from "../middleware/authMiddleware.js";
import {
  listJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "../controllers/journalController.js";

const router = express.Router();

// CRUD for attendee journal entries
router.get("/journal", authenticateToken, requireAttendee, listJournalEntries);
router.post("/journal", authenticateToken, requireAttendee, createJournalEntry);
router.put(
  "/journal/:id",
  authenticateToken,
  requireAttendee,
  updateJournalEntry
);
router.delete(
  "/journal/:id",
  authenticateToken,
  requireAttendee,
  deleteJournalEntry
);

export default router;
