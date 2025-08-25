/**
 * ESLint Configuration for Calmly Mental Health Platform
 * @author Rushikesh Bodke
 */
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals"),
	{
		rules: {
			// Custom rules for better code quality
			"no-unused-vars": "warn",
			"no-console": "warn",
			"prefer-const": "error",
			"no-var": "error",
		},
	},
];

export default eslintConfig;
