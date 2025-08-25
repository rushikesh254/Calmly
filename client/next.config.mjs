import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Silence monorepo root inference warnings when building from parent
	turbopack: {
		root: __dirname,
	},
};

export default nextConfig;
