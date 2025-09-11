import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mem;

const connectDB = async () => {
  const useInMemory = String(process.env.USE_INMEMORY_DB || "").toLowerCase();
  let uri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!uri || ["1", "true", "yes"].includes(useInMemory)) {
    // Spin up ephemeral in-memory Mongo for local dev if flagged or no URI provided
    mem = await MongoMemoryServer.create();
    uri = mem.getUri();
    console.warn(`[DB] Using in-memory MongoDB at ${uri}`);
  } else {
    console.info(`[DB] Connecting to MongoDB at ${uri}`);
  }

  await mongoose.connect(uri);
};

export default connectDB;
