/**
 * Manages DOM detachment/reattachment of mobile/desktop navigation elements
 * across breakpoints for performance.
 */

(function () {
  if (!document.getElementById('main-menu-list')) return;

  const mqLg = window.matchMedia('(min-width: 62rem)');

  const navCache = {
    mobile: { el: null, placeholder: null, parent: null },
    desktop: { el: null, placeholder: null, parent: null }
  };

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

  function detachNode(cache) {
    if (!cache?.el?.parentNode || !cache.parent) return;

    cache.parent.insertBefore(cache.placeholder, cache.el);
    cache.parent.removeChild(cache.el);
  }

  function restoreNode(cache) {
    if (!cache?.el || cache.el.parentNode) return;
    if (!cache.placeholder?.parentNode) return;

    cache.placeholder.parentNode.replaceChild(cache.el, cache.placeholder);
  }

  function handleBreakpoint(e) {
    initNavCache();

    if (e.matches) {
      restoreNode(navCache.desktop);
      detachNode(navCache.mobile);
    } else {
      restoreNode(navCache.mobile);
      detachNode(navCache.desktop);
    }
  }

  window.addEventListener('load', () => {
    handleBreakpoint(mqLg);
  });

  mqLg.addEventListener('change', (e) => {
    handleBreakpoint(e);

    if (!e.matches) {
      window.mpcInitMainNav?.();
      window.mpcInitMainNavigationMobile?.();
      window.mpcInitThemeSwitch?.();
    }
  });
})();
