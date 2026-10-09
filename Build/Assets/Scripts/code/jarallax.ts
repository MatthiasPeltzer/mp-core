/**
 * Lazy-loads the Jarallax vendor bundle when the page contains parallax containers.
 */

const parallaxElements = [...document.querySelectorAll('.grid-parallax')].filter(
  (el): el is HTMLElement => el instanceof HTMLElement
)

if (parallaxElements.length) {
  import('jarallax')
    .then(({ jarallax }) => {
      jarallax(parallaxElements, {
        speed: 0.5,
        imgPosition: '100%'
      })
    })
    .catch((err) => {
      // eslint-disable-next-line no-console -- vendor load failures must reach DevTools
      console.error('[mp-core/jarallax] failed to load vendor bundle', err)
    })
}
