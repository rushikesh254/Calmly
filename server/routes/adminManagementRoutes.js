import express from "express";
import Attendee from "../models/Attendee.js";
import MHP from "../models/MHP.js";
import Admin from "../models/Admin.js";
import Session from "../models/Session.js";
import MoodLog from "../models/MoodLog.js";
import Resource from "../models/Resource.js";
import {
  authenticateToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/admin/manage/users - Unified list of all user types
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [attendees, mhps, admins] = await Promise.all([
      Attendee.find({}, "-password").lean(),
      MHP.find({}, "-password").lean(),
      Admin.find({}, "-password").lean(),
    ]);
    const users = [
      ...attendees.map((a) => ({
        ...a,
        role: "attendee",
        name: a.username,
        status: "n/a",
      })),
      ...mhps.map((m) => ({
        _id: m._id,
        role: "mhp",
        name: m.username,
        email: m.email,
        status: m.status,
      })),
      ...admins.map((ad) => ({
        _id: ad._id,
        role: ad.role,
        name: ad.name,
        email: ad.email,
        status: "admin",
      })),
    ];
    res.json({ users });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// PATCH /api/admin/manage/users/:id - Approve or reject an MHP
router.patch(
  "/users/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!["approved", "rejected"].includes(status))
        return res.status(400).json({ error: "Invalid status" });
      const mhp = await MHP.findById(id);
      if (!mhp) return res.status(404).json({ error: "MHP not found" });
      mhp.status = status;
      await mhp.save();
      res.json({ message: "Status updated", id: mhp._id, status: mhp.status });
    } catch (e) {
      res.status(500).json({ error: "Failed to update status" });
    }
  }
);

// DELETE /api/admin/manage/users/:id?role=attendee|mhp - Remove user & related data
router.delete(
  "/users/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const role = (req.query.role || "").toString();
      if (!["attendee", "mhp"].includes(role))
        return res.status(400).json({ error: "Invalid or missing role" });

      if (role === "attendee") {
        const doc = await Attendee.findById(id);
        if (!doc) return res.status(404).json({ error: "Attendee not found" });
        const email = doc.email;
        await Attendee.deleteOne({ _id: id });
        const sessionResult = await Session.deleteMany({
          attendee_email: email,
        });
        return res.json({
          message: "Attendee deleted",
          deleted: { userId: id, role },
          removed: { sessions: sessionResult.deletedCount || 0 },
        });
      }

      if (role === "mhp") {
        const doc = await MHP.findById(id);
        if (!doc) return res.status(404).json({ error: "MHP not found" });
        const email = doc.email;
        await MHP.deleteOne({ _id: id });
        const [sessionResult, resourceResult] = await Promise.all([
          Session.deleteMany({ professional_email: email }),
          Resource.deleteMany({ mhpEmail: email }),
        ]);
        return res.json({
          message: "MHP deleted",
          deleted: { userId: id, role },
          removed: {
            sessions: sessionResult.deletedCount || 0,
            resources: resourceResult.deletedCount || 0,
          },
        });
      }
    } catch (e) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

// GET /api/admin/manage/stats - Aggregate counts for dashboard
router.get("/stats", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [attendeeCount, mhpCount, adminCount, sessionCount, moodLogCount] =
      await Promise.all([
        Attendee.countDocuments(),
        MHP.countDocuments(),
        Admin.countDocuments(),
        Session.countDocuments(),
        MoodLog.countDocuments(),
      ]);
    res.json({
      totals: {
        attendees: attendeeCount,
        mhps: mhpCount,
        admins: adminCount,
        users: attendeeCount + mhpCount + adminCount,
        sessions: sessionCount,
        moodLogs: moodLogCount,
      },
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
