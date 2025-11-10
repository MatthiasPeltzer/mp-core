(function () {
    if (!document.getElementById('main-menu-list')) {
        return;
    }

    const mqLg = window.matchMedia('(min-width: 62rem)');

    const navCache = {
        mobile: {el: null, placeholder: null, parent: null},
        desktop: {el: null, placeholder: null, parent: null}
    };

    function initNavCache() {
        if (!navCache.mobile.el) {
            const m = document.getElementById('main-menu');
            if (m) {
                navCache.mobile.el = m;
                navCache.mobile.parent = m.parentNode;
                navCache.mobile.placeholder = document.createComment('placeholder-main-menu');
            }
        }
        if (!navCache.desktop.el) {
            const d = document.querySelector('nav.mainnav-desktop');
            if (d) {
                navCache.desktop.el = d;
                navCache.desktop.parent = d.parentNode;
                navCache.desktop.placeholder = document.createComment('placeholder-mainnav-desktop');
            }
        }
    }

    function detachNode(cache) {
        if (!cache || !cache.el || !cache.parent) return;
        if (cache.el.parentNode) {
            cache.parent.insertBefore(cache.placeholder, cache.el);
            cache.parent.removeChild(cache.el);
        }
    }

    function restoreNode(cache) {
        if (!cache || !cache.el) return;
        if (!cache.el.parentNode && cache.placeholder && cache.placeholder.parentNode) {
            cache.placeholder.parentNode.replaceChild(cache.el, cache.placeholder);
        }
    }

    function handle(e) {
        initNavCache();
        if (e.matches) {
            // ≥ lg: show desktop, hide mobile
            restoreNode(navCache.desktop);
            detachNode(navCache.mobile);
        } else {
            // < lg: show mobile, hide desktop
            restoreNode(navCache.mobile);
            detachNode(navCache.desktop);
        }
    }

    // run first pass after page load so other initializers can bind
    window.addEventListener('load', function () {
        handle(mqLg);
    });

    // on breakpoint change, re-init mobile nav when entering < lg
    mqLg.addEventListener('change', function (e) {
        handle(e);
        if (!e.matches) {
            if (typeof window.mpcInitMainNav === 'function') {
                window.mpcInitMainNav();
            }
            if (typeof window.mpcInitMainNavigationMobile === 'function') {
                window.mpcInitMainNavigationMobile();
            }
            if (typeof window.mpcInitThemeSwitch === 'function') {
                window.mpcInitThemeSwitch();
            }
        }
    });
})();
