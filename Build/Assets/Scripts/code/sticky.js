/**
 * Sticky Header Module
 *
 * When a .toplogo-container exists (banner / extra logos above the nav),
 * a progressive negative margin hides the toplogo pixel-by-pixel as the
 * user scrolls, keeping the navigation pinned at the viewport top.
 *
 * The .sticky class is still toggled for cosmetic CSS changes (logo swap,
 * meta-nav hide, etc.) once the toplogo is fully scrolled out.
 */

// =============================================================================
// INITIALIZATION
// =============================================================================

const body = document.body;
const header = document.querySelector('.header-wrapper-bg');

// Exit early if header doesn't exist
if (header) {
  const toplogo = header.querySelector('.toplogo-container');
  let headerHeight = header.offsetHeight;
  let toplogoHeight = toplogo ? toplogo.offsetHeight : 0;

  // =============================================================================
  // SCROLL HANDLING
  // =============================================================================

  let ticking = false;

  function handleScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      if (toplogo && toplogoHeight > 0) {
        const offset = Math.min(scrollY, toplogoHeight + 17);
        toplogo.style.marginTop = `${-offset / 16}rem`;
      }
      const threshold = toplogoHeight > 0 ? toplogoHeight : headerHeight;
      body.classList.toggle('sticky', scrollY >= threshold);
      ticking = false;
    });
  }

  window.addEventListener('scroll', handleScroll, {passive: true});

  // =============================================================================
  // RESPONSIVE PADDING
  // =============================================================================

  function measureToplogo() {
    if (toplogo) {
      toplogoHeight = toplogo.offsetHeight;
    }
  }

  /**
   * Updates body padding based on current header height
   */
  function updatePadding() {
    headerHeight = header.offsetHeight;
    body.style.paddingTop = `${headerHeight / 16}rem`;
    measureToplogo();
  }

  /**
   * Initializes responsive padding behavior
   */
  function initResponsivePadding() {
    const mediaQuery = window.matchMedia('(min-width: 62rem)');

    const handleMediaChange = () => {
      // Debounce slightly to ensure layout is complete
      setTimeout(updatePadding, 50);
    };

    // Initial call and listener
    handleMediaChange();
    mediaQuery.addEventListener('change', handleMediaChange);
  }

  initResponsivePadding();

  // Re-measure after late-loading content (images, fonts) settles
  if (toplogo) {
    new ResizeObserver(() => measureToplogo()).observe(toplogo);
  }
}
