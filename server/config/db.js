import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mem;

const toBool = (v) =>
	["1", "true", "yes"].includes(String(v || "").toLowerCase());

const connectWithUri = async (uri) => {
	// Use conservative timeouts so we fail fast and can fallback in dev
	await mongoose.connect(uri, {
		autoIndex: true, // ensure indexes; can disable in prod if using migrations
		serverSelectionTimeoutMS: 8000,
		connectTimeoutMS: 8000,
	});
};

const startMemoryServer = async () => {
	mem = await MongoMemoryServer.create();
	const memUri = mem.getUri();
	console.warn(
		`[DB] Using ephemeral in-memory MongoDB at ${memUri}. Data will be lost on restart.`
	);
	await connectWithUri(memUri);
};

const connectDB = async () => {
	const requirePersistent = toBool(process.env.REQUIRE_PERSISTENT_DB);
	const wantInMemory = toBool(process.env.USE_INMEMORY_DB);
	const configuredUri =
		process.env.MONGO_URI || process.env.MONGO_URL || process.env.ATLAS_URI; // allow ATLAS_URI alias

	if (!configuredUri) {
		if (requirePersistent) {
			throw new Error(
				"REQUIRE_PERSISTENT_DB=true but no MONGO_URI / ATLAS_URI provided. Set a MongoDB Atlas connection string."
			);
		}
		// No persistent URI configured → go in-memory
		await startMemoryServer();
	} else if (wantInMemory && !requirePersistent) {
		// Explicitly requested in-memory regardless of URI
		await startMemoryServer();
	} else {
		console.info(`[DB] Connecting to MongoDB at ${configuredUri}`);
		try {
			await connectWithUri(configuredUri);
		} catch (err) {
			// If persistent DB is required, surface the error
			if (requirePersistent) {
				console.error("[DB] Persistent DB connection failed and is required.");
				throw err;
			}
			// Otherwise fallback to in-memory for local dev
			console.warn(
				`[DB] Failed to connect to configured MongoDB. Falling back to in-memory. Reason: ${err.message}`
			);
			await startMemoryServer();
		}
	}

	mongoose.connection.on("open", async () => {
		const { host, port, name } = mongoose.connection;
		console.info(`[DB] Connected: ${host}:${port}/${name}`);
	});
};

export default connectDB;
