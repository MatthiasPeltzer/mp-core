/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-recommended-scss',
    'stylelint-config-standard'
  ],
  plugins: [
    'stylelint-scss',
    'stylelint-order'
  ],
  ignoreFiles: ['**/*.html', '**/*.js', '**/*.php'],
  rules: {
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['first-nested', 'blockless-after-blockless'],
        ignore: 'after-comment'
      }
    ],
    'declaration-block-no-shorthand-property-overrides': true,
    'declaration-empty-line-before': null,
    'declaration-property-value-keyword-no-deprecated': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'declaration-property-value-no-unknown': null,
    'selector-type-no-unknown': [true, {severity: 'warning'}],
    'selector-id-pattern': null,
    'selector-class-pattern': null,
    'scss/at-rule-no-unknown': true,
    'scss/no-global-function-names': null,
    'scss/comment-no-empty': null,
    'function-url-quotes': null,
    'function-no-unknown': null,
    'at-rule-no-unknown': null,
    'at-rule-descriptor-value-no-unknown': null,
    'font-family-no-missing-generic-family-keyword': true,
    'no-descending-specificity': null,
    'order/properties-alphabetical-order': null,
    'nesting-selector-no-missing-scoping-root': null,
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: ['backface-visibility', 'appearance']
      }
    ],
    'import-notation': null
  }
};
