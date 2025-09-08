import express from "express";
import {
  addResource,
  deleteResource,
  getResource,
  getResourcesByMhpEmail,
} from "../controllers/resourceController.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { resourceCreateSchema } from "../validation/schemas/resourceSchemas.js";

const router = express.Router();

router.get("/", getResource);
router.get("/mr", getResourcesByMhpEmail);

// Allow MHPs or Admins to manage resources
const allowMhpOrAdmin = requireRole(["mhp", "general-admin", "mh-admin"]);
router.delete("/:id", authenticateToken, allowMhpOrAdmin, deleteResource);
router.post(
  "/",
  authenticateToken,
  allowMhpOrAdmin,
  validate(resourceCreateSchema),
  addResource
);

export default router;
