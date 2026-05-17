/**
 * Moves meta navigation and theme switch between desktop and mobile containers.
 *
 * - < lg (< 62rem):      content lives in .meta-mobile
 * - >= lg (min-width: 62rem): content lives in .meta-desktop
 *
 * Uses DOM manipulation (no cloning) to preserve event listeners.
 */

(function () {
  const mqLg = window.matchMedia('(min-width: 62rem)');

  function moveAllChildren(fromEl, toEl) {
    if (!fromEl || !toEl) return;
    
    while (fromEl.firstChild) {
      toEl.appendChild(fromEl.firstChild);
    }
  }

  function syncPair(desktopEl, mobileEl, toDesktop) {
    if (!desktopEl || !mobileEl) return;

    if (toDesktop) {
      if (desktopEl.childNodes.length === 0 && mobileEl.childNodes.length > 0) {
        moveAllChildren(mobileEl, desktopEl);
      }
    } else {
      if (mobileEl.childNodes.length === 0 && desktopEl.childNodes.length > 0) {
        moveAllChildren(desktopEl, mobileEl);
      }
    }
  }

  function handleBreakpoint(e) {
    const toDesktop = !!e.matches;
    const desktops = Array.from(document.querySelectorAll('.meta-desktop'));
    const mobiles = Array.from(document.querySelectorAll('.meta-mobile'));

    if (!desktops.length || !mobiles.length) return;

    if (desktops.length === mobiles.length) {
      desktops.forEach((desktopEl, idx) => {
        syncPair(desktopEl, mobiles[idx], toDesktop);
      });
      return;
    }

    if (desktops.length === 1) {
      const desktopEl = desktops[0];
      const mobileEl = mobiles.find(m => m.childNodes.length > 0) || mobiles[0];
      syncPair(desktopEl, mobileEl, toDesktop);
    }
  }

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
