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
];
