/**
 * Keeps mobile and desktop navigation landmarks in the DOM but marks the
 * inactive variant inert for assistive technology (replaces DOM detachment).
 */

(function () {
  if (!document.getElementById('main-menu-list')) return;

  const mqLg = window.matchMedia('(min-width: 62rem)');
  const mobileNav = document.getElementById('main-menu');
  const desktopNav = document.querySelector('nav.mainnav-desktop');

  /**
   * @param {HTMLElement|null} element
   * @param {boolean} inactive
   */
  function setNavInactiveState(element, inactive) {
    if (!element) return;

    if (inactive) {
      element.setAttribute('inert', '');
      element.setAttribute('aria-hidden', 'true');
    } else {
      element.removeAttribute('inert');
      element.removeAttribute('aria-hidden');
    }
  }

  /**
   * @param {MediaQueryListEvent|MediaQueryList} event
   */
  function handleBreakpoint(event) {
    const isDesktop = event.matches;

    setNavInactiveState(mobileNav, isDesktop);
    setNavInactiveState(desktopNav, !isDesktop);
  }

  window.addEventListener('load', () => {
    handleBreakpoint(mqLg);
  });

  mqLg.addEventListener('change', handleBreakpoint);
})();
