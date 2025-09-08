import express from "express";
import {
  saveMoodLog,
  getMoodHistory,
  getMoodStats,
} from "../controllers/moodLogController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { moodLogCreateSchema } from "../validation/schemas/moodSchemas.js";

const router = express.Router();

// All mood log routes require auth
router.use(authenticateToken);

router.post("/", validate(moodLogCreateSchema), saveMoodLog); // Create mood entry
router.get("/history", getMoodHistory); // List history
router.get("/stats", getMoodStats); // Aggregate stats

export default router;
