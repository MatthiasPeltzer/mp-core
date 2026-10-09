/**
 * Keyboard support for main navigation: tiered Escape, focus enter/exit,
 * and Enter/Space on submenu toggles. Arrow keys are handled by Bootstrap.
 */

import Collapse from 'bootstrap/js/dist/collapse.js'
import Menu from 'bootstrap/js/dist/menu.js'
import type { BootstrapEvent } from 'bootstrap/js/dist/dom/event-handler.js'
import { isMenuNavLinkClick } from './domUtils.js'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

let userOpenedPanel = false
let navKeyboardListenersRegistered = false

export type NavKeyboardConfig = {
  desktopRoot: string | null
  mobileRoot: string
  desktopMegaMenuSelector: string
  mobileMenuSelector: string
  mobileToggleSelector: string
  breakpoint: string
}

function focusElement(element: HTMLElement | null | undefined): void {
  if (!element || element.closest('[inert]')) {
    return
  }

  element.focus({ preventScroll: true })
  element.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}

function isFocusableVisible(element: HTMLElement): boolean {
  if (element.closest('[inert]')) {
    return false
  }

  const style = window.getComputedStyle(element)
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false
  }

  return element.getClientRects().length > 0
}

function getVisibleFocusables(container: ParentNode | null | undefined): HTMLElement[] {
  if (!container) {
    return []
  }

  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
    (node): node is HTMLElement => node instanceof HTMLElement && isFocusableVisible(node),
  )
}

function getRowArrowFocusables(row: HTMLLIElement): HTMLElement[] {
  const items: HTMLElement[] = []

  const link = row.querySelector(':scope > a[href]')
  const button = row.querySelector(':scope > button[data-bs-toggle="collapse"]')

  if (link instanceof HTMLElement && isFocusableVisible(link)) {
    items.push(link)
  }

  if (button instanceof HTMLElement && isFocusableVisible(button)) {
    items.push(button)
  }

  return items
}

function isNavKeyboardContext(element: HTMLElement): boolean {
  return Boolean(element.closest('.mainnav-desktop, #nav-desktop, #main-menu'))
}

function getFirstFocusable(container: ParentNode | null | undefined): HTMLElement | null {
  return getVisibleFocusables(container)[0] ?? null
}

function getDeepestOpenCollapse(root: HTMLElement): HTMLElement | null {
  const openCollapses = [...root.querySelectorAll('.collapse.show')].filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  )

  if (openCollapses.length === 0) {
    return null
  }

  return (
    openCollapses.find(
      (collapse) => !openCollapses.some((other) => other !== collapse && collapse.contains(other)),
    ) ?? openCollapses[openCollapses.length - 1]
  )
}

function closeCollapse(collapse: HTMLElement): boolean {
  if (!collapse.classList.contains('show')) {
    return false
  }

  const toggle = document.querySelector(`[data-bs-target="#${collapse.id}"]`)
  if (!(toggle instanceof HTMLElement)) {
    return false
  }

  Collapse.getOrCreateInstance(collapse).hide()
  focusElement(toggle)

  return true
}

function closeDropdownMenu(menu: HTMLElement): boolean {
  const toggle =
    document.querySelector(`[aria-controls="${menu.id}"]`) ??
    menu.previousElementSibling

  if (!(toggle instanceof HTMLElement) || !menu.classList.contains('show')) {
    return false
  }

  Menu.getOrCreateInstance(toggle).hide()
  focusElement(toggle)

  return true
}

function focusPanelForToggle(toggle: HTMLElement): void {
  const controlsId = toggle.getAttribute('aria-controls')
  const targetSelector = toggle.getAttribute('data-bs-target')
  const panel =
    (controlsId ? document.getElementById(controlsId) : null) ??
    (targetSelector ? document.querySelector(targetSelector) : null)

  if (!(panel instanceof HTMLElement)) {
    return
  }

  if (toggle.matches('.btn-search-nav, [id^="solr-button"]')) {
    const searchInput = panel.querySelector('input[type="search"], input[type="text"]')
    if (searchInput instanceof HTMLElement) {
      focusElement(searchInput)
      return
    }
  }

  const menuRoot = panel.querySelector('.mainnav-children, .main-menu')
  if (menuRoot instanceof HTMLElement) {
    const firstRow = menuRoot.querySelector(':scope > li')
    if (firstRow instanceof HTMLLIElement) {
      const firstItem = getRowArrowFocusables(firstRow)[0]
      if (firstItem) {
        focusElement(firstItem)
        return
      }
    }
  }

  focusElement(getFirstFocusable(panel))
}

function getOpenDesktopMegaMenu(
  desktopRootSelector: string | null,
  megaMenuSelector: string,
): HTMLElement | null {
  if (desktopRootSelector) {
    const scopedMenu = document.querySelector(`${desktopRootSelector} ${megaMenuSelector}.show`)
    if (scopedMenu instanceof HTMLElement) {
      return scopedMenu
    }
  }

  const menu = document.querySelector(`${megaMenuSelector}.show`)
  return menu instanceof HTMLElement ? menu : null
}

function handleEscape(event: KeyboardEvent, config: NavKeyboardConfig): void {
  if (event.key !== 'Escape') {
    return
  }

  const isDesktop = window.matchMedia(config.breakpoint).matches

  if (isDesktop && config.desktopRoot) {
    const openMegaMenu = getOpenDesktopMegaMenu(config.desktopRoot, config.desktopMegaMenuSelector)

    if (openMegaMenu) {
      const openCollapse = getDeepestOpenCollapse(openMegaMenu)
      if (openCollapse instanceof HTMLElement && closeCollapse(openCollapse)) {
        event.preventDefault()
        event.stopImmediatePropagation()
        return
      }

      if (closeDropdownMenu(openMegaMenu)) {
        event.preventDefault()
        event.stopImmediatePropagation()
        return
      }
    }
  }

  const mobileRoot = document.querySelector(config.mobileRoot)
  if (!(mobileRoot instanceof HTMLElement) || mobileRoot.hasAttribute('inert')) {
    return
  }

  const openCollapse = getDeepestOpenCollapse(mobileRoot)
  if (openCollapse instanceof HTMLElement && closeCollapse(openCollapse)) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }

  const mobileMenu = mobileRoot.querySelector(`${config.mobileMenuSelector}.show`)
  const mobileToggle = document.querySelector(config.mobileToggleSelector)

  if (
    mobileMenu instanceof HTMLElement &&
    mobileToggle instanceof HTMLElement &&
    mobileMenu.classList.contains('show')
  ) {
    Menu.getOrCreateInstance(mobileToggle).hide()
    focusElement(mobileToggle)
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}

function markUserTriggeredPanelOpen(): void {
  userOpenedPanel = true
}

function registerUserIntentListeners(): void {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target
      if (
        target instanceof Element &&
        target.closest('[data-bs-toggle="collapse"], [data-bs-toggle="menu"]')
      ) {
        markUserTriggeredPanelOpen()
      }
    },
    true,
  )
}

function handleNavToggleKey(event: KeyboardEvent): void {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return
  }

  const eventTarget = event.target
  if (!(eventTarget instanceof HTMLElement) || !isNavKeyboardContext(eventTarget)) {
    return
  }

  if (eventTarget.matches('button[data-bs-toggle="collapse"]')) {
    event.preventDefault()
    event.stopPropagation()
    markUserTriggeredPanelOpen()

    const panelSelector = eventTarget.getAttribute('data-bs-target')
    const panel = panelSelector ? document.querySelector(panelSelector) : null

    if (panel instanceof HTMLElement) {
      Collapse.getOrCreateInstance(panel).toggle()
    }

    return
  }

  if (eventTarget.matches('[data-bs-toggle="menu"]')) {
    event.preventDefault()
    event.stopPropagation()
    markUserTriggeredPanelOpen()
    Menu.getOrCreateInstance(eventTarget).toggle()
  }
}

function isNavEvent(containerSelector: string | null, event: Event): boolean {
  if (!containerSelector) {
    return false
  }

  const target = event.target
  return target instanceof Element && Boolean(target.closest(containerSelector))
}

function menuClickEvent(event: Event): Event | null | undefined {
  return (event as BootstrapEvent).clickEvent as Event | null | undefined
}

export function initNavKeyboard(config: NavKeyboardConfig): void {
  const roots = [config.desktopRoot, config.mobileRoot].filter(Boolean) as string[]

  if (roots.length === 0) {
    return
  }

  if (!navKeyboardListenersRegistered) {
    navKeyboardListenersRegistered = true
    registerUserIntentListeners()

    document.addEventListener(
      'keydown',
      (event) => {
        if (event instanceof KeyboardEvent) {
          handleEscape(event, config)
          handleNavToggleKey(event)
        }
      },
      true,
    )
  }

  document.addEventListener('shown.bs.menu', (event) => {
    const toggle = event.target
    if (!(toggle instanceof HTMLElement) || !roots.some((root) => isNavEvent(root, event))) {
      return
    }

    if (!userOpenedPanel) {
      return
    }

    userOpenedPanel = false
    focusPanelForToggle(toggle)
  })

  document.addEventListener('hidden.bs.menu', (event) => {
    const toggle = event.target
    if (!(toggle instanceof HTMLElement) || !roots.some((root) => isNavEvent(root, event))) {
      return
    }

    if (isMenuNavLinkClick(menuClickEvent(event))) {
      return
    }

    focusElement(toggle)
  })

  document.addEventListener('shown.bs.collapse', (event) => {
    const collapse = event.target
    if (!(collapse instanceof HTMLElement) || !roots.some((root) => isNavEvent(root, event))) {
      return
    }

    if (!userOpenedPanel) {
      return
    }

    userOpenedPanel = false
    const firstRow = collapse.querySelector(':scope > li')
    const firstItem =
      firstRow instanceof HTMLLIElement ? getRowArrowFocusables(firstRow)[0] : null
    focusElement(firstItem ?? getFirstFocusable(collapse))
  })

  document.addEventListener('hidden.bs.collapse', (event) => {
    const collapse = event.target
    if (!(collapse instanceof HTMLElement) || !roots.some((root) => isNavEvent(root, event))) {
      return
    }

    const toggle = document.querySelector(`[data-bs-target="#${collapse.id}"]`)
    if (toggle instanceof HTMLElement) {
      focusElement(toggle)
    }
  })
}
