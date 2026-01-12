/**
 * Navigation Toggle Module
 * Manages DOM detachment/reattachment of mobile/desktop navigation
 * for performance optimization across breakpoints
 */

(function () {
  if (!document.getElementById('main-menu-list')) return;

  // =============================================================================
  // CONFIGURATION
  // =============================================================================

  const mqLg = window.matchMedia('(min-width: 62rem)');

  const navCache = {
    mobile: { el: null, placeholder: null, parent: null },
    desktop: { el: null, placeholder: null, parent: null }
  };

  // =============================================================================
  // CACHE MANAGEMENT
  // =============================================================================

  /**
   * Initializes navigation element cache
   * Creates placeholders for DOM manipulation
   */
  function initNavCache() {
    if (!navCache.mobile.el) {
      const mobile = document.getElementById('main-menu');
      if (mobile) {
        navCache.mobile.el = mobile;
        navCache.mobile.parent = mobile.parentNode;
        navCache.mobile.placeholder = document.createComment('placeholder-main-menu');
      }
    }

    if (!navCache.desktop.el) {
      const desktop = document.querySelector('nav.mainnav-desktop');
      if (desktop) {
        navCache.desktop.el = desktop;
        navCache.desktop.parent = desktop.parentNode;
        navCache.desktop.placeholder = document.createComment('placeholder-mainnav-desktop');
      }
    }
  }

  // =============================================================================
  // DOM OPERATIONS
  // =============================================================================

  /**
   * Detaches an element from the DOM, leaving a placeholder
   * @param {Object} cache - Cache object with el, parent, placeholder
   */
  function detachNode(cache) {
    if (!cache?.el?.parentNode || !cache.parent) return;

    cache.parent.insertBefore(cache.placeholder, cache.el);
    cache.parent.removeChild(cache.el);
  }

  /**
   * Restores an element to the DOM, replacing its placeholder
   * @param {Object} cache - Cache object with el, placeholder
   */
  function restoreNode(cache) {
    if (!cache?.el || cache.el.parentNode) return;
    if (!cache.placeholder?.parentNode) return;

    cache.placeholder.parentNode.replaceChild(cache.el, cache.placeholder);
  }

  // =============================================================================
  // BREAKPOINT HANDLING
  // =============================================================================

  /**
   * Handles breakpoint changes by swapping navigation elements
   * @param {MediaQueryList|MediaQueryListEvent} e - Media query state
   */
  function handleBreakpoint(e) {
    initNavCache();

    if (e.matches) {
      // >= lg: Show desktop, hide mobile
      restoreNode(navCache.desktop);
      detachNode(navCache.mobile);
    } else {
      // < lg: Show mobile, hide desktop
      restoreNode(navCache.mobile);
      detachNode(navCache.desktop);
    }
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  // Initial setup after page load
  window.addEventListener('load', () => {
    handleBreakpoint(mqLg);
  });

  // Re-initialize mobile nav when entering mobile breakpoint
  mqLg.addEventListener('change', (e) => {
    handleBreakpoint(e);

    if (!e.matches) {
      // Call re-initialization functions if available
      window.mpcInitMainNav?.();
      window.mpcInitMainNavigationMobile?.();
      window.mpcInitThemeSwitch?.();
    }
  });
})();
