/**
 * Keeps mobile and desktop navigation landmarks in the DOM but marks the
 * inactive variant inert for assistive technology (replaces DOM detachment).
 */

import { asHTMLElement } from './Utils/domTypes.js'

function initNavToggle(): void {
  if (!document.getElementById('main-menu-list')) {
    return
  }

  const mqLg = window.matchMedia('(min-width: 62rem)')
  const mobileNav = document.getElementById('main-menu')
  const desktopNav = asHTMLElement(document.querySelector('nav.mainnav-desktop'))

  function setNavInactiveState(element: HTMLElement | null, inactive: boolean): void {
    if (!element) {
      return
    }

    if (inactive) {
      element.setAttribute('inert', '')
      element.setAttribute('aria-hidden', 'true')
    } else {
      element.removeAttribute('inert')
      element.removeAttribute('aria-hidden')
    }
  }

  function handleBreakpoint(event: MediaQueryList | MediaQueryListEvent): void {
    const isDesktop = event.matches

    setNavInactiveState(mobileNav, isDesktop)
    setNavInactiveState(desktopNav, !isDesktop)
  }

  window.addEventListener('load', () => {
    handleBreakpoint(mqLg)
  })

  mqLg.addEventListener('change', handleBreakpoint)
}

initNavToggle()
