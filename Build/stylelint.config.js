/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended',
    'stylelint-config-recommended-scss'
  ],
  plugins: [
    'stylelint-scss',
    'stylelint-order'
  ],
  ignoreFiles: ['**/*.html', '**/*.js', '**/*.php'],
  rules: {
    'declaration-property-value-keyword-no-deprecated': null,
    'selector-class-pattern': null,
    'scss/no-global-function-names': null,
    'import-notation': null,
    'color-function-alias-notation': null
  }
};
