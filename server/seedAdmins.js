import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

const VALID_ROLES = ["general-admin", "mh-admin"];

const buildAdminConfigs = () => {
  const entries = [
    {
      email:
        process.env.ADMIN_EMAIL ||
        process.env.ADMIN_DEFAULT_EMAIL ||
        "admin@gmail.com",
      password:
        process.env.ADMIN_PASSWORD ||
        process.env.ADMIN_DEFAULT_PASSWORD ||
        "admin",
      name: process.env.ADMIN_NAME || process.env.ADMIN_DEFAULT_NAME || "Admin",
      role: process.env.ADMIN_ROLE || process.env.ADMIN_DEFAULT_ROLE || "general-admin",
    },
    {
      email:
        process.env.MHP_ADMIN_EMAIL ||
        process.env.MHP_ADMIN_DEFAULT_EMAIL ||
        "mhpadmin@gmail.com",
      password:
        process.env.MHP_ADMIN_PASSWORD ||
        process.env.MHP_ADMIN_DEFAULT_PASSWORD ||
        "mhpadmin",
      name:
        process.env.MHP_ADMIN_NAME ||
        process.env.MHP_ADMIN_DEFAULT_NAME ||
        "MHP Admin",
      role: process.env.MHP_ADMIN_ROLE || process.env.MHP_ADMIN_DEFAULT_ROLE || "mh-admin",
    },
  ];

  const seen = new Set();

  return entries
    .map((cfg) => ({
      ...cfg,
      email: cfg.email?.trim().toLowerCase(),
      name: cfg.name?.trim(),
      role: cfg.role?.trim(),
    }))
    .filter((cfg) => {
      if (!cfg.email || !cfg.password || !cfg.name || !cfg.role) return false;
      if (!VALID_ROLES.includes(cfg.role)) return false;
      if (seen.has(cfg.email)) return false;
      seen.add(cfg.email);
      return true;
    });
};

async function seedAdmins() {
  await connectDB();
  const configs = buildAdminConfigs();

  if (!configs.length) {
    console.warn("[seed] No valid admin configuration found. Nothing to do.");
    return;
  }

  for (const cfg of configs) {
    const existing = await Admin.findOne({ email: cfg.email });
    if (existing) {
      console.log(`[seed] Admin already exists: ${cfg.email}`);
      continue;
    }

    const hashed = await bcrypt.hash(cfg.password, 10);
    await Admin.create({
      name: cfg.name,
      email: cfg.email,
      password: hashed,
      role: cfg.role,
    });
    console.log(`[seed] Admin created: ${cfg.email} (${cfg.role})`);
  }
}

seedAdmins()
  .then(() => {
    console.log("[seed] Complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("[seed] Failed:", error);
    process.exit(1);
  });
