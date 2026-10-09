/**
 * Handles both desktop and mobile navigation:
 * - Desktop: Dropdown menus with collapse submenus
 * - Mobile: Dropdown menu with collapse submenus and body state management
 * - Responsive: Closes menus when switching breakpoints
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
  closeOtherSubmenus,
  hasOpenDesktopOrMobileNav,
  isMenuNavLinkClick,
  openCurrentPageParents,
  scheduleNavOverlaySync,
  scrollToCurrentElement,
} from '../../Utils/domUtils.js'
import { asHTMLElement, eventTargetElement } from '../../Utils/domTypes.js'

const NAME = 'secondaryNavigation'

const CONFIG = {
  desktop: {
    container: '#nav-desktop',
    buttonSelector: '.first-nav-btn',
    collapseButtonSelector: '[data-bs-toggle="collapse"]',
    subnavButtonSelector: '.subnav-children .hassub',
    subnavMenuSelector: '.subnav-children',
  },
  mobile: {
    container: '#main-menu',
    menuButton: '#main-menu-button',
    solrButton: '#solr-button',
    mobileMenuSelector: '#main-menu .menu',
    collapseButtonSelector: '[data-bs-toggle="collapse"]',
    menuSelector: '.collapse',
  },
  breakpoint: '(min-width: 62rem)',
} as const

type SecondaryNavigationConfig = Record<string, never>

const headerWrapper = asHTMLElement(document.querySelector('.header-wrapper'))

function menuClickEvent(event: Event): Event | null | undefined {
  return (event as BootstrapEvent).clickEvent as Event | null | undefined
}

function updateButtonState(button: HTMLElement, isOpen: boolean): void {
  button.setAttribute('title', isOpen ? closeButtonMessage : openButtonMessage)
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
  button.classList.toggle('collapsed', !isOpen)
}

function syncAllButtonStates(
  containerSelector: string,
  buttonSelector: string,
  excludeButton: HTMLElement | null = null,
): void {
  document.querySelectorAll(`${containerSelector} ${buttonSelector}`).forEach((node) => {
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
    updateButtonState(button, isOpen)
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

function updateDesktopButtonTitles(): void {
  document.querySelectorAll(CONFIG.desktop.buttonSelector).forEach((node) => {
    const button = asHTMLElement(node)
    if (!button) {
      return
    }
    const isOpen = button.classList.contains('show')
    button.setAttribute('title', isOpen ? closeButtonMessage : openButtonMessage)
  })
}

function syncActiveNavClasses(): void {
  scheduleNavOverlaySync(document.body, headerWrapper, () =>
    hasOpenDesktopOrMobileNav(CONFIG.desktop.container),
  )
}

function updateMobileMenuButton(button: HTMLElement, isOpen: boolean): void {
  if (button.id !== 'main-menu-button') {
    return
  }

  const textElement = button.querySelector('.txt > .visually-hidden')
  if (textElement) {
    textElement.textContent = isOpen ? closeNavMessage : openNavMessage
  }

  button.setAttribute('title', isOpen ? closeTitleMessage : openTitleMessage)
}

class SecondaryNavigation extends BaseComponent {
  static NAME = NAME

  static get Default(): SecondaryNavigationConfig {
    return {}
  }

  protected declare _config: SecondaryNavigationConfig

  constructor(element: HTMLElement, config?: Partial<SecondaryNavigationConfig>) {
    super(element, config)
    this._initDesktopNavigation()
    this._initMobileNavigation()
    this._initResponsiveBehavior()
  }

  protected _initDesktopNavigation(): void {
    const navDesktop = document.getElementById('nav-desktop')
    if (!navDesktop) {
      return
    }

    EventHandler.on(document, 'show.bs.menu', (event) => {
      if (!isInContainer(event, CONFIG.desktop.container)) {
        return
      }
      syncActiveNavClasses()
    })

    EventHandler.on(document, 'shown.bs.menu', (event) => {
      if (!isInContainer(event, CONFIG.desktop.container)) {
        return
      }
      syncActiveNavClasses()
      updateDesktopButtonTitles()
      scrollToCurrentElement(CONFIG.desktop.container)
    })

    EventHandler.on(document, 'hide.bs.menu', (event) => {
      if (!isInContainer(event, CONFIG.desktop.container)) {
        return
      }
      if (isMenuNavLinkClick(menuClickEvent(event))) {
        return
      }
      syncActiveNavClasses()
    })

    EventHandler.on(document, 'hidden.bs.menu', (event) => {
      if (!isInContainer(event, CONFIG.desktop.container)) {
        return
      }
      if (isMenuNavLinkClick(menuClickEvent(event))) {
        return
      }
      syncActiveNavClasses()
      updateDesktopButtonTitles()
    })

    document.querySelectorAll('.main-menu-desktop .btn-close').forEach((node) => {
      const button = asHTMLElement(node)
      if (!button) {
        return
      }
      button.addEventListener('click', () => {
        asHTMLElement(document.querySelector(`${CONFIG.desktop.buttonSelector}.show`))?.click()
      })
    })

    document.querySelectorAll(CONFIG.desktop.subnavButtonSelector).forEach((node) => {
      const subButton = asHTMLElement(node)
      if (!subButton) {
        return
      }
      subButton.addEventListener('click', () => {
        closeOtherSubmenus(
          subButton,
          CONFIG.desktop.subnavButtonSelector,
          CONFIG.desktop.subnavMenuSelector,
        )
      })
    })

    const onDesktopCollapse = (event: Event, isOpen: boolean, syncOthers = false): void => {
      if (!isInContainer(event, CONFIG.desktop.container)) {
        return
      }
      const triggerButton = getTriggerButton(event)
      if (!triggerButton) {
        return
      }
      if (isOpen) {
        closeOtherSubmenus(
          triggerButton,
          CONFIG.desktop.collapseButtonSelector,
          CONFIG.desktop.subnavMenuSelector,
        )
        syncAllButtonStates(
          CONFIG.desktop.container,
          CONFIG.desktop.collapseButtonSelector,
          triggerButton,
        )
      }
      updateButtonState(triggerButton, isOpen)
      if (syncOthers) {
        syncAllButtonStates(CONFIG.desktop.container, CONFIG.desktop.collapseButtonSelector)
      }
    }

    EventHandler.on(document, 'show.bs.collapse', (event) => {
      onDesktopCollapse(event, true)
    })
    EventHandler.on(document, 'hide.bs.collapse', (event) => {
      onDesktopCollapse(event, false)
    })
    EventHandler.on(document, 'shown.bs.collapse', (event) => {
      onDesktopCollapse(event, true, true)
    })
    EventHandler.on(document, 'hidden.bs.collapse', (event) => {
      onDesktopCollapse(event, false, true)
    })

    setTimeout(() => {
      openCurrentPageParents(CONFIG.desktop.subnavMenuSelector, closeButtonMessage)
      syncAllButtonStates(CONFIG.desktop.container, CONFIG.desktop.collapseButtonSelector)
    }, 100)
  }

  protected _initMobileNavigation(): void {
    if (!document.getElementById('main-menu')) {
      return
    }

    const handleMobileDropdown = (event: Event, isOpening: boolean): void => {
      const button = asHTMLElement(
        eventTargetElement(event)?.closest(`${CONFIG.mobile.menuButton}, ${CONFIG.mobile.solrButton}`),
      )
      if (!button) {
        return
      }

      if (!isOpening && isMenuNavLinkClick(menuClickEvent(event))) {
        return
      }

      if (isOpening) {
        document.body.classList.add('active-nav-body')
        headerWrapper?.classList.add('active-nav')
        scrollToCurrentElement(CONFIG.mobile.container)
      } else {
        scheduleNavOverlaySync(document.body, headerWrapper, () =>
          Boolean(document.querySelector(`${CONFIG.mobile.mobileMenuSelector}.show, #main-menu.show`)),
        )
      }

      updateMobileMenuButton(button, isOpening)
    }

    EventHandler.on(document, 'show.bs.menu', (event) => {
      handleMobileDropdown(event, true)
    })
    EventHandler.on(document, 'hide.bs.menu', (event) => {
      handleMobileDropdown(event, false)
    })

    EventHandler.on(document, 'click', (event) => {
      const button = asHTMLElement(
        eventTargetElement(event)?.closest(
          `${CONFIG.mobile.container} ${CONFIG.mobile.collapseButtonSelector}`,
        ),
      )
      if (!button) {
        return
      }

      const isCurrentlyCollapsed = button.classList.contains('collapsed')
      if (isCurrentlyCollapsed) {
        button.classList.remove('collapsed')
        button.setAttribute('aria-expanded', 'true')
        button.setAttribute('title', closeButtonMessage)
      } else {
        button.classList.add('collapsed')
        button.setAttribute('aria-expanded', 'false')
        button.setAttribute('title', openButtonMessage)
      }
    })

    const onMobileCollapse = (event: Event, isOpen: boolean, syncOthers = false): void => {
      if (!isInContainer(event, CONFIG.mobile.container)) {
        return
      }
      const triggerButton = getTriggerButton(event)
      if (!triggerButton) {
        return
      }
      if (isOpen) {
        closeOtherSubmenus(
          triggerButton,
          CONFIG.mobile.collapseButtonSelector,
          CONFIG.mobile.menuSelector,
        )
        syncAllButtonStates(
          CONFIG.mobile.container,
          CONFIG.mobile.collapseButtonSelector,
          triggerButton,
        )
      }
      updateButtonState(triggerButton, isOpen)
      if (syncOthers) {
        syncAllButtonStates(CONFIG.mobile.container, CONFIG.mobile.collapseButtonSelector)
      }
    }

    EventHandler.on(document, 'show.bs.collapse', (event) => {
      onMobileCollapse(event, true)
    })
    EventHandler.on(document, 'hide.bs.collapse', (event) => {
      onMobileCollapse(event, false)
    })
    EventHandler.on(document, 'shown.bs.collapse', (event) => {
      onMobileCollapse(event, true, true)
    })
    EventHandler.on(document, 'hidden.bs.collapse', (event) => {
      onMobileCollapse(event, false, true)
    })

    setTimeout(() => {
      openCurrentPageParents(CONFIG.mobile.menuSelector, closeButtonMessage)
      syncAllButtonStates(CONFIG.mobile.container, CONFIG.mobile.collapseButtonSelector)
    }, 100)
  }

  protected _initResponsiveBehavior(): void {
    const mediaQuery = window.matchMedia(CONFIG.breakpoint)
    const body = document.body

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
        .querySelectorAll('.first-nav-button.show, .first-nav-btn.show, #nav-desktop [data-bs-toggle="menu"].show')
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

function initSecondaryNavigation(): void {
  const root = document.getElementById('nav-desktop') ?? document.body
  SecondaryNavigation.getOrCreateInstance(root)
}

initSecondaryNavigation()

export default SecondaryNavigation
