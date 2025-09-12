import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mem;

const connectDB = async () => {
  const rawFlag = String(process.env.USE_INMEMORY_DB || "").toLowerCase();
  const wantInMemory = ["1", "true", "yes"].includes(rawFlag);
  const requirePersistent = ["1", "true", "yes"].includes(
    String(process.env.REQUIRE_PERSISTENT_DB || "").toLowerCase()
  );
  let uri =
    process.env.MONGO_URI || process.env.MONGO_URL || process.env.ATLAS_URI; // allow ATLAS_URI alias

  if (!uri) {
    if (requirePersistent) {
      throw new Error(
        "REQUIRE_PERSISTENT_DB=true but no MONGO_URI / ATLAS_URI provided. Set a MongoDB Atlas connection string."
      );
    }
    // No persistent URI configured → fall back to ephemeral DB
    mem = await MongoMemoryServer.create();
    uri = mem.getUri();
    console.warn(
      `[DB] No MONGO_URI provided. Using ephemeral in-memory MongoDB at ${uri}. All data clears on restart.`
    );
  } else if (wantInMemory) {
    // Developer likely left USE_INMEMORY_DB=true while also supplying a URI.
    // For safety, prefer the real database so accounts persist.
    console.warn(
      `[DB] Both MONGO_URI and USE_INMEMORY_DB flag detected. Ignoring in-memory flag and connecting to ${uri} for persistence. Remove USE_INMEMORY_DB to silence this.`
    );
  } else {
    console.info(`[DB] Connecting to MongoDB at ${uri}`);
  }

  await mongoose.connect(uri, {
    autoIndex: true, // ensure indexes; can disable in prod if using migrations
  });

  mongoose.connection.on("open", async () => {
    const { host, port, name } = mongoose.connection;
    console.info(`[DB] Connected: ${host}:${port}/${name}`);
  });
};

export default connectDB;
