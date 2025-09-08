import express from "express";
import { getAllProfessionals } from "../controllers/mhpFetchController.js";

const router = express.Router();

// GET /api/professionals - list all professionals (future: filters/pagination)
router.get("/", getAllProfessionals);

export default router;
