/**
 * Next.js Configuration for Calmly Mental Health Platform
 * @author Rushikesh Bodke
 * @type {import('next').NextConfig}
 */
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
};

export default nextConfig;
