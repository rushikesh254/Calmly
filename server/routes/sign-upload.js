import express from "express";
import { generateSignature } from "../controllers/sign-upload.js";

const router = express.Router();

// POST /api/sign-upload - Generate cloud upload signature
router.post("/", generateSignature);

export default router;
