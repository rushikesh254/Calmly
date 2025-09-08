import express from "express";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgotPasswordController.js";

const router = express.Router();

// Password recovery and reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
