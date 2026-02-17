import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Global ignore patterns so ESLint doesn't lint build output or Astro internals
  {
    ignores: ["dist/**", ".astro/**", "public/**"],
  },
  {
    // Limit linting to source and root config files
    files: [
      "src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
