/** @type {import('eslint').Linter.Config} */

module.exports = {
    ignorePatterns: ["eslint.config.js"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    env: {
        browser: true,
        node: true
    },
    extends: ["eslint:recommended"],
    rules: {
        semi: "error",
        "prefer-const": "error",
        "no-undef": "warn",
        "no-console": [
            "warn"
        ],
    },
};
