import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginAstro from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Global ignore patterns so ESLint doesn't lint build output or Astro internals
  {
    ignores: ["dist/**", ".astro/**", "public/**"],
  },
  // TypeScript configs
  ...tseslint.configs.recommended,
  // General JS/TS files
  {
    files: [
      "src/**/*.{js,mjs,cjs,ts,mts,cts}",
      "*.{js,mjs,cjs,ts,mts,cts}",
    ],
    languageOptions: { globals: globals.browser },
  },
  // React/JSX files only
  {
    files: ["src/**/*.{jsx,tsx}"],
    ...pluginReact.configs.flat.recommended,
    plugins: { "jsx-a11y": pluginJsxA11y },
    rules: { ...pluginJsxA11y.configs.strict.rules },
    languageOptions: { globals: globals.browser },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Astro files - use Astro-specific linting
  ...pluginAstro.configs.recommended,
  {
    files: ["src/**/*.astro"],
    plugins: { "jsx-a11y": pluginJsxA11y },
    rules: { ...pluginJsxA11y.configs.strict.rules },
  },
]);
