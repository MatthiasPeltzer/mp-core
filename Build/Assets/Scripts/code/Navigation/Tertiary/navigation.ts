/**
 * Handles both desktop and mobile navigation interactions including:
 * - Dropdown visibility
 * - Collapse/expand submenus
 * - Button state management (icons, aria attributes)
 * - Responsive behavior
 */

import BaseComponent from 'bootstrap/js/dist/base-component.js'
import EventHandler from 'bootstrap/js/dist/dom/event-handler.js'
import type { BootstrapEvent } from 'bootstrap/js/dist/dom/event-handler.js'
import {
  closeButtonMessage,
  closeNavMessage,
  closeTitleMessage,
  openButtonMessage,
  openNavMessage,
  openTitleMessage,
} from './../../i18n.js'
import {
  handleMenuVisibility,
  hasOpenDesktopOrMobileNav,
  isMenuNavLinkClick,
  scheduleNavOverlaySync,
  toggleNavState,
  closeOtherSubmenus,
  openCurrentPageParents,
  scrollToCurrentElement,
} from '../../Utils/domUtils.js'
import { asHTMLElement, eventTargetElement } from '../../Utils/domTypes.js'

const NAME = 'tertiaryNavigation'

const CONFIG = {
  desktop: {
    container: '.mainnav-desktop',
    buttonSelector: '.menu-item-button',
    menuButtonSelector: '.first-nav-button',
    menuSelector: '.collapse',
    parentMenuSelector: '.subnav-children',
  },
  mobile: {
    container: '#main-menu',
    buttonSelector: '.menu-item-button',
    menuSelector: '.collapse',
    parentMenuSelector: '.collapse',
  },
  breakpoint: '(min-width: 62rem)',
} as const

type TertiaryNavigationConfig = Record<string, never>

type NavCollapseConfig = {
  container: string
  buttonSelector: string
  menuSelector: string
}

function menuClickEvent(event: Event): Event | null | undefined {
  return (event as BootstrapEvent).clickEvent as Event | null | undefined
}

function updateButtonState(
  button: HTMLElement,
  isOpen: boolean,
  updateVisuallyHidden = false,
  toggleCollapsed = true,
): void {
  const label = isOpen ? closeButtonMessage : openButtonMessage

  button.setAttribute('aria-label', label)
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false')

  if (toggleCollapsed) {
    button.classList.toggle('collapsed', !isOpen)
  }

  const svgTitle = button.querySelector('svg title')
  if (svgTitle) {
    svgTitle.textContent = label
  }

  if (updateVisuallyHidden) {
    const buttonText = button.querySelector('.visually-hidden')
    if (buttonText) {
      buttonText.textContent = label
    }
  }
}

function syncAllButtonStates(
  containerSelector: string,
  buttonSelector: string,
  excludeButton: HTMLElement | null = null,
  updateVisuallyHidden = false,
): void {
  const selector = `${containerSelector} ${buttonSelector}`

  document.querySelectorAll(selector).forEach((node) => {
    const button = asHTMLElement(node)
    if (!button || button === excludeButton) {
      return
    }

    const targetMenuId = button.getAttribute('data-bs-target')
    if (!targetMenuId) {
      return
    }
    const targetMenu = document.querySelector(targetMenuId)
    const isOpen = targetMenu?.classList.contains('show') ?? false

    updateButtonState(button, isOpen, updateVisuallyHidden)
  })
}

function getTriggerButton(event: Event): HTMLElement | null {
  const target = event.target
  if (!(target instanceof Element) || !target.id) {
    return null
  }
  return asHTMLElement(document.querySelector(`[data-bs-target="#${target.id}"]`))
}

function isInContainer(event: Event, containerSelector: string): boolean {
  return Boolean(eventTargetElement(event)?.closest(containerSelector))
}

function registerCollapseHandlers(config: NavCollapseConfig, updateVisuallyHidden = false): void {
  const { container, buttonSelector, menuSelector } = config

  EventHandler.on(document, 'show.bs.collapse', (event) => {
    if (!isInContainer(event, container)) {
      return
    }

    const triggerButton = getTriggerButton(event)
    if (!triggerButton) {
      return
    }

    closeOtherSubmenus(triggerButton, buttonSelector, menuSelector)
    syncAllButtonStates(container, buttonSelector, triggerButton, updateVisuallyHidden)
    updateButtonState(triggerButton, true, updateVisuallyHidden)
  })

  EventHandler.on(document, 'hide.bs.collapse', (event) => {
    if (!isInContainer(event, container)) {
      return
    }

    const triggerButton = getTriggerButton(event)
    if (triggerButton) {
      updateButtonState(triggerButton, false, updateVisuallyHidden)
    }
  })

  EventHandler.on(document, 'shown.bs.collapse', (event) => {
    if (!isInContainer(event, container)) {
      return
    }

    const triggerButton = getTriggerButton(event)
    if (triggerButton) {
      updateButtonState(triggerButton, true, updateVisuallyHidden)
    }
    syncAllButtonStates(container, buttonSelector, null, updateVisuallyHidden)
  })

  EventHandler.on(document, 'hidden.bs.collapse', (event) => {
    if (!isInContainer(event, container)) {
      return
    }

    const triggerButton = getTriggerButton(event)
    if (triggerButton) {
      updateButtonState(triggerButton, false, updateVisuallyHidden)
    }
    syncAllButtonStates(container, buttonSelector, null, updateVisuallyHidden)
  })
}

function registerClickHandler(selector: string, updateVisuallyHidden = false): void {
  EventHandler.on(document, 'click', (event) => {
    const button = asHTMLElement(eventTargetElement(event)?.closest(selector))
    if (!button) {
      return
    }

    const isCurrentlyCollapsed = button.classList.contains('collapsed')
    updateButtonState(button, isCurrentlyCollapsed, updateVisuallyHidden)
  })
}

function syncDesktopNavOverlay(): void {
  scheduleNavOverlaySync(
    document.body,
    asHTMLElement(document.querySelector('.header-wrapper')),
    () => hasOpenDesktopOrMobileNav(CONFIG.desktop.container),
  )
}

function syncDesktopDropdownButtonStates(): void {
  const { container, menuButtonSelector } = CONFIG.desktop

  document.querySelectorAll(`${container} ${menuButtonSelector}`).forEach((node) => {
    const button = asHTMLElement(node)
    if (!button) {
      return
    }
    const isOpen = button.classList.contains('show')
    updateButtonState(button, isOpen, false, false)
  })
}

class TertiaryNavigation extends BaseComponent {
  static NAME = NAME

  static get Default(): TertiaryNavigationConfig {
    return {}
  }

  protected declare _config: TertiaryNavigationConfig

  constructor(element: HTMLElement, config?: Partial<TertiaryNavigationConfig>) {
    super(element, config)
    if (document.querySelector(CONFIG.desktop.container)) {
      this._initDesktopNavigation()
    }
    if (document.getElementById('main-menu')) {
      this._initMobileNavigation()
    }
    this._initResponsiveBehavior()
  }

  protected _initDesktopNavigation(): void {
    const desktopRoot = CONFIG.desktop.container

    EventHandler.on(document, 'show.bs.menu', (event) => {
      if (!isInContainer(event, desktopRoot)) {
        return
      }
      syncDesktopNavOverlay()
    })

    EventHandler.on(document, 'shown.bs.menu', (event) => {
      if (!isInContainer(event, desktopRoot)) {
        return
      }
      scrollToCurrentElement(CONFIG.desktop.container)
      syncDesktopNavOverlay()
      syncDesktopDropdownButtonStates()
    })

    EventHandler.on(document, 'hide.bs.menu', (event) => {
      if (!isInContainer(event, desktopRoot)) {
        return
      }
      if (isMenuNavLinkClick(menuClickEvent(event))) {
        return
      }
      syncDesktopNavOverlay()
    })

    EventHandler.on(document, 'hidden.bs.menu', (event) => {
      if (!isInContainer(event, desktopRoot)) {
        return
      }
      if (isMenuNavLinkClick(menuClickEvent(event))) {
        return
      }
      syncDesktopNavOverlay()
      syncDesktopDropdownButtonStates()
    })

    registerClickHandler(`${CONFIG.desktop.container} ${CONFIG.desktop.buttonSelector}`)
    registerCollapseHandlers(CONFIG.desktop, false)

    setTimeout(() => {
      openCurrentPageParents(CONFIG.desktop.parentMenuSelector, closeButtonMessage)
      syncAllButtonStates(CONFIG.desktop.container, CONFIG.desktop.buttonSelector, null, false)
      syncDesktopDropdownButtonStates()
    }, 100)
  }

  protected _initMobileNavigation(): void {
    const body = document.body
    const headerWrapper = asHTMLElement(document.querySelector('.header-wrapper'))
    const navbarToggler = asHTMLElement(document.querySelector('.navbar-toggler'))
    const navbarTogglerText = asHTMLElement(
      document.querySelector('.navbar-toggler span.txt > .visually-hidden'),
    )
    const mainMenu = document.getElementById('main-menu')

    if (!mainMenu) {
      return
    }

    handleMenuVisibility(
      mainMenu,
      () => {
        toggleNavState(
          true,
          body,
          headerWrapper,
          navbarToggler,
          navbarTogglerText,
          openTitleMessage,
          closeTitleMessage,
          openNavMessage,
          closeNavMessage,
        )
        scrollToCurrentElement(CONFIG.mobile.container)
      },
      (event) => {
        if (isMenuNavLinkClick(menuClickEvent(event))) {
          return
        }
        toggleNavState(
          false,
          body,
          headerWrapper,
          navbarToggler,
          navbarTogglerText,
          openTitleMessage,
          closeTitleMessage,
          openNavMessage,
          closeNavMessage,
        )
      },
    )

    document.querySelectorAll('.main-menu-desktop .btn-close').forEach((node) => {
      const button = asHTMLElement(node)
      if (!button) {
        return
      }
      button.addEventListener('click', () => {
        asHTMLElement(document.querySelector('.first-nav-button.show'))?.click()
      })
    })

    document.querySelectorAll('.subnav-children .hassub').forEach((node) => {
      const subButton = asHTMLElement(node)
      if (!subButton) {
        return
      }
      subButton.addEventListener('click', () => {
        closeOtherSubmenus(subButton, '.subnav-children .hassub', '.subnav-children')
      })
    })

    registerClickHandler(`${CONFIG.mobile.container} ${CONFIG.mobile.buttonSelector}`, true)
    registerCollapseHandlers(CONFIG.mobile, true)

    setTimeout(() => {
      openCurrentPageParents(CONFIG.mobile.parentMenuSelector, closeButtonMessage)
      syncAllButtonStates(CONFIG.mobile.container, CONFIG.mobile.buttonSelector, null, true)
    }, 100)
  }

  protected _initResponsiveBehavior(): void {
    const mediaQuery = window.matchMedia(CONFIG.breakpoint)
    const body = document.body
    const headerWrapper = asHTMLElement(document.querySelector('.header-wrapper'))

    const closeMobileMenus = (): void => {
      const mainMenu = document.getElementById('main-menu')
      const navbarToggler = asHTMLElement(document.querySelector('.navbar-toggler'))

      if (mainMenu?.classList.contains('show') && navbarToggler) {
        navbarToggler.click()
      }

      document.querySelectorAll(`${CONFIG.mobile.container} .collapse.show`).forEach((menu) => {
        if (!(menu instanceof Element)) {
          return
        }
        const button = asHTMLElement(document.querySelector(`[data-bs-target="#${menu.id}"]`))
        if (button && !button.classList.contains('collapsed')) {
          button.click()
        }
      })
    }

    const closeDesktopMenus = (): void => {
      document
        .querySelectorAll('.first-nav-button.show, .mainnav-desktop [data-bs-toggle="menu"].show')
        .forEach((node) => {
          asHTMLElement(node)?.click()
        })

      document.querySelectorAll(`${CONFIG.desktop.container} .collapse.show`).forEach((menu) => {
        if (!(menu instanceof Element)) {
          return
        }
        const button = asHTMLElement(document.querySelector(`[data-bs-target="#${menu.id}"]`))
        if (button && !button.classList.contains('collapsed')) {
          button.click()
        }
      })
    }

    const handleBreakpointChange = (event: MediaQueryListEvent | null): void => {
      if (!event) {
        return
      }

      if (event.matches) {
        closeMobileMenus()
      } else {
        closeDesktopMenus()
      }

      body.classList.remove('active-nav-body')
      headerWrapper?.classList.remove('active-nav')
    }

    mediaQuery.addEventListener('change', handleBreakpointChange)
  }
}

function initTertiaryNavigation(): void {
  const root =
    asHTMLElement(document.querySelector(CONFIG.desktop.container)) ??
    document.getElementById('main-menu') ??
    document.body
  TertiaryNavigation.getOrCreateInstance(root)
}

initTertiaryNavigation()

export default TertiaryNavigation
