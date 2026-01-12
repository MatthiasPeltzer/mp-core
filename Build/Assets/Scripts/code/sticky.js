/**
 * Sticky Header Module
 * Adds/removes sticky class based on scroll position
 * and adjusts body padding to compensate for fixed header
 */

// =============================================================================
// INITIALIZATION
// =============================================================================

const body = document.body;
const header = document.querySelector('.header-wrapper-bg');

// Exit early if header doesn't exist
if (!header) {
  console.warn('Sticky: .header-wrapper-bg not found');
} else {
  let headerHeight = header.offsetHeight;

  // =============================================================================
  // SCROLL HANDLING
  // =============================================================================

  /**
   * Adds/removes sticky class based on scroll position
   */
  function handleScroll() {
    body.classList.toggle('sticky', window.scrollY > headerHeight);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // =============================================================================
  // RESPONSIVE PADDING
  // =============================================================================

  /**
   * Updates body padding based on current header height
   */
  function updatePadding() {
    headerHeight = header.offsetHeight;
    body.style.paddingTop = `${headerHeight / 16}rem`;
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
}
