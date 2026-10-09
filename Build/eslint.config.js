import js from "@eslint/js"
import pluginVue from "eslint-plugin-vue"
import globals from "globals"
import tseslint from "typescript-eslint"

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts"],
  })),
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser
      }
    },
    rules: {
      semi: ["error", "never"],
      "prefer-const": "error",
      "no-undef": "warn",
      "no-console": [
        "warn"
      ],
      "no-redeclare": "error",
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    }
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"]
      },
      globals: {
        ...globals.browser
      }
    },
    rules: {
      semi: ["error", "never"],
      "prefer-const": "error",
      "no-unused-vars": "off",
      "vue/no-unused-vars": ["error", { ignorePattern: "^_" }],
      "vue/multi-word-component-names": "off",
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
    files: ["Assets/Static/**/*.js"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "no-unused-expressions": "off",
    },
  },
  {
    files: [
      "scripts/**/*.js",
      "scripts/**/*.mjs",
      "Scripts/**/*.js",
      "Scripts/**/*.mjs",
      "vite.config.js",
      "postcss.config.js",
      "stylelint.config.js",
      "eslint.config.js",
      "vitest.config.mts"
    ],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-console": "off"
    }
  }
]
