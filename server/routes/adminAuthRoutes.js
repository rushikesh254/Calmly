import express from "express";
import { adminLogin } from "../controllers/adminAuthController.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validation/schemas/authSchemas.js";

const router = express.Router();

// POST /api/admin/login - Admin authentication
router.post("/login", validate(loginSchema), adminLogin);

export default router;
