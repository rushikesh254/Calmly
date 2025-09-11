import express from "express";
import {
  attendeeSummary,
  attendeeSummaryStream,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/dashboard/attendee/summary", attendeeSummary);
router.get("/dashboard/attendee/stream", attendeeSummaryStream);

export default router;
