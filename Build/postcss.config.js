import postcssPresetEnv from 'postcss-preset-env';
import pxtorem from 'postcss-pxtorem';

/** @type {import('postcss').Config} */

// Custom plugin to remove vendor-prefixed properties
const removeVendorPrefixes = () => ({
  postcssPlugin: 'remove-vendor-prefixes',
  Declaration(decl) {
    // Remove properties starting with -webkit-, -moz-, -ms-, -o-
    if (/^-(webkit|moz|ms|o)-/.test(decl.prop)) {
      decl.remove();
    }
  }
});
removeVendorPrefixes.postcss = true;

export default {
  map: {
    inline: false, // Generate external .map files
    annotation: true, // Add sourceMappingURL comment
    sourcesContent: true // Include original source in map
  },
  plugins: [
    // preset-env
    postcssPresetEnv({
      browsers: 'last 1 Chrome version, not dead, fully supports es6',
      autoprefixer: false, // Don't add -webkit- and other vendor prefixes
      features: {
        // Keep :is() as-is (97%+ browser support)
        'is-pseudo-class': false
      }
    }),

    // Remove existing vendor prefixes (from Bootstrap etc.)
    removeVendorPrefixes(),

    // pxtorem
    pxtorem({
      rootValue: 16,
      propList: ['*']
    })
  ]
};
