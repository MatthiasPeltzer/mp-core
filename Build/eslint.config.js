import js from "@eslint/js";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser
      }
    },
    rules: {
      semi: "error",
      "prefer-const": "error",
      "no-undef": "warn",
      "no-console": [
        "warn"
      ],
      "no-redeclare": "error",
    },
  },
  {
    // Node-only build tooling (analyzer wrapper, bundle-size gate, etc.).
    // These run via `node scripts/*.js`, not in the browser.
    files: ["scripts/**/*.js", "vite.config.js", "postcss.config.js", "stylelint.config.js", "eslint.config.js"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      // Build scripts intentionally write to stdout/stderr.
      "no-console": "off"
    }
  }
];
