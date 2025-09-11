// Core Express server bootstrap for Calmly backend
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pino from "pino";
import pinoHttp from "pino-http";

import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/error.js";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

// Routes
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import attendeeAuthRoutes from "./routes/attendeeAuthRoutes.js";
import mhpAuthRoutes from "./routes/mhpAuthRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import moodLogRoutes from "./routes/moodLogRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import resourcesRoutes from "./routes/resourcesRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import signUploadRoutes from "./routes/sign-upload.js";
// Missing routes wired for frontend usage
import professionalRoutes from "./routes/professionalRoutes.js";
import adminManagementRoutes from "./routes/adminManagementRoutes.js";
import forgetRoutes from "./routes/forgetRoutes.js";
// Directly import MHP signup controller + schema for isolated alias route
import { signupMHP } from "./controllers/mhpAuthController.js";
import { validate } from "./middleware/validate.js";
import { signupMHPSchema } from "./validation/schemas/authSchemas.js";

// Configuration
const BASE_PORT = Number(process.env.PORT) || 5000;
let PORT = BASE_PORT;
// Support both CLIENT_ORIGIN and legacy CLIENT_URL. Default to localhost:3000 for dev.
// Accept comma-separated list for multiple allowed origins.
const ORIGIN_ENV =
  process.env.CLIENT_ORIGIN ||
  process.env.CLIENT_URL ||
  "http://localhost:3000";
const ALLOWED_ORIGINS = ORIGIN_ENV.split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Logger
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "production"
      ? undefined
      : { target: "pino-pretty" },
});

// Ensure a JWT secret exists in dev to prevent runtime errors
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "dev-secret-change-me";
  console.warn(
    "[WARN] JWT_SECRET not set. Using a dev fallback. Set JWT_SECRET in .env for production."
  );
}

// App init
const app = express();

// Middlewares
app.use(helmet());
// CORS: reflect allowed origins to support credentials; allow non-browser (no origin)
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // non-browser or same-origin
      const allowed = ALLOWED_ORIGINS.some((o) => origin === o);
      return cb(null, allowed);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(pinoHttp({ logger }));

// Basic rate limiting (customize as needed)
app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// API routes namespace
app.use("/api/admin", adminAuthRoutes);

// Auth + profile (attendee)
app.use("/api/attendee", attendeeAuthRoutes); // canonical
app.use("/api/attendees", attendeeAuthRoutes); // alias for frontend pluralization
app.use("/api/auth", attendeeAuthRoutes); // alias for legacy smoke tests (/api/auth/signup/attendee, /api/auth/signin)

// Auth + profile (MHP)
app.use("/api/mhp", mhpAuthRoutes); // canonical
app.use("/api/mhps", mhpAuthRoutes); // alias for frontend pluralization
// Provide only MHP signup under /api/auth, to avoid conflicting /signin handlers
app.post("/api/auth/signup/mhp", validate(signupMHPSchema), signupMHP);

app.use("/api", availabilityRoutes); // contains /availability
app.use("/api/moods", moodLogRoutes); // canonical
app.use("/api/mood", moodLogRoutes); // alias for frontend singular
app.use("/api/sessions", sessionRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api", journalRoutes); // prefixed with /journal inside
// Cloudinary signed upload endpoint
app.use("/api/sign-upload", signUploadRoutes);

// Professionals listing
app.use("/api/professionals", professionalRoutes);

// Admin management dashboard endpoints
app.use("/api/admin/manage", adminManagementRoutes);

// Password reset
app.use("/api/forgot", forgetRoutes);

// 404 fallback
app.use("*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use(errorHandler);

// Ensure default admin accounts exist in the active DB (useful for dev/in-memory DB)
const ensureDefaultAdmins = async () => {
  const shouldSeed = (process.env.SEED_DEFAULT_ADMINS ?? "true").toLowerCase();
  if (!["1", "true", "yes"].includes(shouldSeed)) return;

  const defs = [
    {
      email: process.env.ADMIN_DEFAULT_EMAIL || "admin@gmail.com",
      password: process.env.ADMIN_DEFAULT_PASSWORD || "admin",
      name: process.env.ADMIN_DEFAULT_NAME || "Admin",
      role: process.env.ADMIN_DEFAULT_ROLE || "general-admin",
    },
    {
      email: process.env.MHP_ADMIN_DEFAULT_EMAIL || "mhpadmin@gmail.com",
      password: process.env.MHP_ADMIN_DEFAULT_PASSWORD || "mhpadmin",
      name: process.env.MHP_ADMIN_DEFAULT_NAME || "MHP Admin",
      role: process.env.MHP_ADMIN_DEFAULT_ROLE || "mh-admin",
    },
  ];

  for (const cfg of defs) {
    if (!cfg.email || !cfg.password || !cfg.name || !cfg.role) continue;
    if (!["general-admin", "mh-admin"].includes(cfg.role)) continue;
    const exists = await Admin.findOne({ email: cfg.email });
    if (exists) {
      logger.debug({ email: cfg.email }, "[seed] Admin exists");
      continue;
    }
    const hashed = await bcrypt.hash(cfg.password, 10);
    await Admin.create({
      email: cfg.email.toLowerCase(),
      password: hashed,
      name: cfg.name,
      role: cfg.role,
    });
    logger.info({ email: cfg.email, role: cfg.role }, "[seed] Admin created");
  }
};

// Start server after DB connects
const start = async () => {
  try {
    await connectDB();
    await ensureDefaultAdmins();
    const attemptListen = (p, tried = 0) => {
      const server = app.listen(p, () =>
        logger.info(`Server running on port ${p}`)
      );
      server.on("error", (err) => {
        if (err.code === "EADDRINUSE" && tried < 3) {
          logger.warn(`Port ${p} in use, trying ${p + 1}`);
          attemptListen(p + 1, tried + 1);
        } else {
          logger.error({ err }, "Failed to bind port");
          process.exit(1);
        }
      });
    };
    attemptListen(PORT);
  } catch (err) {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
  }
};

// Only auto-start if run directly (not imported for tests)
// Start unless running under a test environment (so Jest / vitest can import app)
if (process.env.NODE_ENV !== "test") {
  start();
}

export default app;
