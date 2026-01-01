/**
 * Move meta navigation + theme switch between desktop container and mobile menu container.
 *
 * - On < lg (< 62rem): move all child nodes from `.meta-desktop` to `.meta-mobile`
 * - On ≥ lg (min-width: 62rem): move them back
 *
 * This keeps a single DOM instance (no cloning), so event listeners remain intact.
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
      // ≥ lg: ensure content is in desktop container
      if (desktopEl.childNodes.length === 0 && mobileEl.childNodes.length > 0) {
        moveAllChildren(mobileEl, desktopEl);
      }
      return;
    }

    // < lg: ensure content is in mobile container
    if (mobileEl.childNodes.length === 0 && desktopEl.childNodes.length > 0) {
      moveAllChildren(desktopEl, mobileEl);
    }
  }

  function handle(e) {
    const toDesktop = !!e.matches;
    const desktops = Array.from(document.querySelectorAll('.meta-desktop'));
    const mobiles = Array.from(document.querySelectorAll('.meta-mobile'));

    if (!desktops.length || !mobiles.length) {
      return;
    }

    // Best case: same amount of sources/targets -> pair by index
    if (desktops.length === mobiles.length) {
      desktops.forEach((desktopEl, idx) => {
        syncPair(desktopEl, mobiles[idx], toDesktop);
      });
      return;
    }

    // Common in this project: one `.meta-desktop` and one (or more) `.meta-mobile` placeholders.
    if (desktops.length === 1) {
      const desktopEl = desktops[0];
      // prefer the one currently holding the nodes (if any), otherwise the first
      const mobileEl = mobiles.find((m) => m.childNodes.length > 0) || mobiles[0];
      syncPair(desktopEl, mobileEl, toDesktop);
    }
  }

  function init() {
    handle(mqLg);
    mqLg.addEventListener('change', handle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


