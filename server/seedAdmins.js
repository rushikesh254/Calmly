import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

async function main() {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "AdminPass123!";
  const name = process.env.ADMIN_NAME || "Super Admin";
  const role = process.env.ADMIN_ROLE || "general-admin"; // or "mh-admin"

  if (!["general-admin", "mh-admin"].includes(role)) {
    console.error("Invalid ADMIN_ROLE. Use 'general-admin' or 'mh-admin'.");
    process.exit(1);
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`[seed] Admin already exists: ${email}`);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ name, email, password: hashed, role });
  console.log(`[seed] Admin created: ${email} (${role})`);
  process.exit(0);
}

main().catch((e) => {
  console.error("[seed] Failed:", e);
  process.exit(1);
});
