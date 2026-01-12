/**
 * Meta Navigation Mover Module
 * Moves meta navigation and theme switch between desktop and mobile containers
 * 
 * Behavior:
 * - On < lg (< 62rem): Move content from .meta-desktop to .meta-mobile
 * - On >= lg (min-width: 62rem): Move content back to .meta-desktop
 * 
 * Uses DOM manipulation (no cloning) to preserve event listeners
 */

(function () {
  const mqLg = window.matchMedia('(min-width: 62rem)');

  // =============================================================================
  // DOM OPERATIONS
  // =============================================================================

  /**
   * Moves all child nodes from one element to another
   * @param {HTMLElement} fromEl - Source element
   * @param {HTMLElement} toEl - Target element
   */
  function moveAllChildren(fromEl, toEl) {
    if (!fromEl || !toEl) return;
    
    while (fromEl.firstChild) {
      toEl.appendChild(fromEl.firstChild);
    }
  }

  /**
   * Syncs content between desktop and mobile containers
   * @param {HTMLElement} desktopEl - Desktop container
   * @param {HTMLElement} mobileEl - Mobile container
   * @param {boolean} toDesktop - Whether to move content to desktop
   */
  function syncPair(desktopEl, mobileEl, toDesktop) {
    if (!desktopEl || !mobileEl) return;

    if (toDesktop) {
      // >= lg: Ensure content is in desktop container
      if (desktopEl.childNodes.length === 0 && mobileEl.childNodes.length > 0) {
        moveAllChildren(mobileEl, desktopEl);
      }
    } else {
      // < lg: Ensure content is in mobile container
      if (mobileEl.childNodes.length === 0 && desktopEl.childNodes.length > 0) {
        moveAllChildren(desktopEl, mobileEl);
      }
    }
  }

  // =============================================================================
  // BREAKPOINT HANDLING
  // =============================================================================

  /**
   * Handles breakpoint changes
   * @param {MediaQueryList|MediaQueryListEvent} e - Media query state
   */
  function handleBreakpoint(e) {
    const toDesktop = !!e.matches;
    const desktops = Array.from(document.querySelectorAll('.meta-desktop'));
    const mobiles = Array.from(document.querySelectorAll('.meta-mobile'));

    if (!desktops.length || !mobiles.length) return;

    // Pair by index if same count
    if (desktops.length === mobiles.length) {
      desktops.forEach((desktopEl, idx) => {
        syncPair(desktopEl, mobiles[idx], toDesktop);
      });
      return;
    }

    // Common case: Single desktop with one or more mobile placeholders
    if (desktops.length === 1) {
      const desktopEl = desktops[0];
      const mobileEl = mobiles.find(m => m.childNodes.length > 0) || mobiles[0];
      syncPair(desktopEl, mobileEl, toDesktop);
    }
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  function init() {
    handleBreakpoint(mqLg);
    mqLg.addEventListener('change', handleBreakpoint);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
