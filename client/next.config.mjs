/**
 * Next.js Configuration for Calmly Mental Health Platform
 * @author Rushikesh Bodke
 * @type {import('next').NextConfig}
 */
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
	// Enable experimental features for better performance
	experimental: {
		optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
	},
	// Configure images and static assets
	images: {
		domains: ["res.cloudinary.com"],
	},
	// Environment variables
	env: {
		CUSTOM_KEY: process.env.CUSTOM_KEY,
	},
	// Silence monorepo root inference warning when building from root
	outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
