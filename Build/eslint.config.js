import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
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
    files: ["**/*.vue"],
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
      "no-unused-vars": "off",
      "vue/no-unused-vars": ["error", { ignorePattern: "^_" }],
      "vue/multi-word-component-names": "off",
      // Trusted editor/server HTML only; CSP is the primary control (see component comments).
      "vue/no-v-html": "off",
      "vue/max-attributes-per-line": "off",
      "vue/html-self-closing": "off",
      "vue/attributes-order": "off",
      "vue/html-closing-bracket-spacing": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
    },
  },
  {
    // Node-only build tooling (analyzer wrapper, bundle-size gate, etc.).
    // These run via `node scripts/*.js`, not in the browser.
    files: [
      "scripts/**/*.js",
      "Scripts/**/*.js",
      "vite.config.js",
      "postcss.config.js",
      "stylelint.config.js",
      "eslint.config.js"
    ],
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
