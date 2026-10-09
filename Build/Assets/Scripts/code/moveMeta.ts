/**
 * Moves meta navigation and theme switch between desktop and mobile containers.
 *
 * - < lg (< 62rem):      content lives in .meta-mobile
 * - >= lg (min-width: 62rem): content lives in .meta-desktop
 *
 * Uses DOM manipulation (no cloning) to preserve event listeners.
 */

function initMoveMeta(): void {
  const mqLg = window.matchMedia('(min-width: 62rem)')

  function moveAllChildren(fromEl: HTMLElement, toEl: HTMLElement): void {
    while (fromEl.firstChild) {
      toEl.appendChild(fromEl.firstChild)
    }
  }

  function syncPair(desktopEl: HTMLElement, mobileEl: HTMLElement, toDesktop: boolean): void {
    if (toDesktop) {
      if (desktopEl.childNodes.length === 0 && mobileEl.childNodes.length > 0) {
        moveAllChildren(mobileEl, desktopEl)
      }
    } else if (mobileEl.childNodes.length === 0 && desktopEl.childNodes.length > 0) {
      moveAllChildren(desktopEl, mobileEl)
    }
  }

  function handleBreakpoint(e: MediaQueryList | MediaQueryListEvent): void {
    const toDesktop = e.matches
    const desktops = [...document.querySelectorAll('.meta-desktop')].filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    )
    const mobiles = [...document.querySelectorAll('.meta-mobile')].filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    )

    if (!desktops.length || !mobiles.length) {
      return
    }

    if (desktops.length === mobiles.length) {
      desktops.forEach((desktopEl, idx) => {
        syncPair(desktopEl, mobiles[idx], toDesktop)
      })
      return
    }

    if (desktops.length === 1) {
      const desktopEl = desktops[0]
      const mobileEl = mobiles.find((m) => m.childNodes.length > 0) ?? mobiles[0]
      syncPair(desktopEl, mobileEl, toDesktop)
    }
  }

  function init(): void {
    handleBreakpoint(mqLg)
    mqLg.addEventListener('change', handleBreakpoint)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
}

initMoveMeta()
