/**
 * Lazy-loads the Jarallax vendor bundle, but only when the rendered page
 * actually contains at least one parallax container (i.e. an editor toggled
 * `grid_parallax` on a `ce_container` / similar element, which causes
 * fluid_styled_content/Layouts/Container.html to emit the `.grid-parallax`
 * wrapper around a `.jarallax-img`).
 *
 * Pages without a parallax container therefore never request the
 * `vendor-jarallax-*.js` chunk produced by the manualChunks config in
 * `vite.config.js` — the chunk stays a separate, on-demand asset.
 */

const parallaxElements = document.querySelectorAll('.grid-parallax');

if (parallaxElements.length) {
  import('jarallax')
    .then(({jarallax}) => {
      jarallax(parallaxElements, {
        speed: 0.5,
        imgPosition: '100%'
      });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console -- vendor load failures must reach DevTools
      console.error('[mp-core/jarallax] failed to load vendor bundle', err);
    });
}
