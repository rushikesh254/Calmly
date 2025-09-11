// Flat ESLint config for the client app (Next.js / React)
// Kept minimal to avoid resolution issues with eslint-config-next in workspaces
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  // Ignore build artifacts and vendor
  { ignores: ["**/.next/**", "**/node_modules/**", "**/out/**", "**/dist/**"] },
  js.configs.recommended,
  // Node-style configs
  {
    files: [
      "next.config.mjs",
      "postcss.config.mjs",
      "tailwind.config.mjs",
      "eslint.config.mjs",
    ],
    languageOptions: {
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
      },
    },
    rules: {
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    ignores: ["node_modules/**", ".next/**", "out/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        navigator: "readonly",
        fetch: "readonly",
        process: "readonly",
        FormData: "readonly",
        HTMLElement: "readonly",
        AbortController: "readonly",
        URL: "readonly",
        trustedTypes: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      // React 17+ with JSX transform: no need for React in scope
      "react/react-in-jsx-scope": "off",
      // Common hooks checks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // Project hygiene
      "no-unused-vars": "warn",
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
      // Reduce noise from placeholder blocks and legacy spacing
      "no-empty": "warn",
      "no-mixed-spaces-and-tabs": "warn",
    },
    settings: {
      react: { version: "detect" },
    },
  },
];
