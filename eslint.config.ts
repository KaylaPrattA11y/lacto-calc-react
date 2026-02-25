import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
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
    plugins: { js, "jsx-a11y": pluginJsxA11y },
    rules: { ...pluginJsxA11y.configs.strict.rules },
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
