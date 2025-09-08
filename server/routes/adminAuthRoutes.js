import express from "express";
import { adminLogin } from "../controllers/adminAuthController.js";

const router = express.Router();

// POST /api/admin/login - Admin authentication
router.post("/login", adminLogin);

export default router;
