import BaseComponent from 'bootstrap/js/dist/base-component.js'
import EventHandler from 'bootstrap/js/dist/dom/event-handler.js'
import {
  closeButtonMessage,
  openButtonMessage,
  closeNavMessage,
  closeTitleMessage,
  openNavMessage,
  openTitleMessage,
} from './../../i18n.js'
import {
  toggleNavState,
  closeOtherSubmenus,
  openCurrentPageParents,
  scrollToCurrentElement,
} from '../../Utils/domUtils.js'
import { asHTMLElement, eventTargetElement } from '../../Utils/domTypes.js'

const NAME = 'primaryNavigation'

const CONFIG = {
  container: '#main-menu',
  buttonSelector: '.btn-open',
  menuSelector: '.collapse',
} as const

type PrimaryNavigationConfig = Record<string, never>

function updateButtonState(button: HTMLElement, isOpen: boolean): void {
  const buttonText = button.querySelector('.visually-hidden')
  if (buttonText) {
    buttonText.textContent = isOpen ? closeButtonMessage : openButtonMessage
  }

  button.setAttribute('title', isOpen ? closeButtonMessage : openButtonMessage)
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
  button.classList.toggle('collapsed', !isOpen)
}

function getTriggerButton(event: Event): HTMLElement | null {
  const target = event.target
  if (!(target instanceof Element) || !target.id) {
    return null
  }
  return asHTMLElement(document.querySelector(`[data-bs-target="#${target.id}"]`))
}

function isInPrimaryContainer(event: Event): boolean {
  const target = eventTargetElement(event)
  return Boolean(target?.closest(CONFIG.container))
}

class PrimaryNavigation extends BaseComponent {
  static NAME = NAME

  static get Default(): PrimaryNavigationConfig {
    return {}
  }

  protected declare _config: PrimaryNavigationConfig

  constructor(element: HTMLElement, config?: Partial<PrimaryNavigationConfig>) {
    super(element, config)
    this._bind()
  }

  protected _bind(): void {
    const mainMenu = this._element
    const body = document.body
    const headerWrapper = asHTMLElement(document.querySelector('.header-wrapper'))
    const navbarToggler = asHTMLElement(document.querySelector('.navbar-toggler'))
    const navbarTogglerText = asHTMLElement(
      document.querySelector('.navbar-toggler span.txt > .visually-hidden'),
    )

    const syncAllButtonStates = (): void => {
      document.querySelectorAll(`${CONFIG.container} ${CONFIG.buttonSelector}`).forEach((node) => {
        const button = asHTMLElement(node)
        if (!button) {
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

    EventHandler.on(mainMenu, 'show.bs.menu', () => {
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
    })

    EventHandler.on(mainMenu, 'shown.bs.menu', () => {
      scrollToCurrentElement(CONFIG.container)
    })

    EventHandler.on(mainMenu, 'hide.bs.menu', () => {
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
    })

    const onCollapseLifecycle = (event: Event, isOpen: boolean): void => {
      if (!isInPrimaryContainer(event)) {
        return
      }
      const triggerButton = getTriggerButton(event)
      if (!triggerButton) {
        return
      }
      if (isOpen) {
        closeOtherSubmenus(triggerButton, CONFIG.buttonSelector, CONFIG.menuSelector)
      }
      updateButtonState(triggerButton, isOpen)
    }

    EventHandler.on(document, 'show.bs.collapse', (event) => {
      onCollapseLifecycle(event, true)
    })
    EventHandler.on(document, 'hide.bs.collapse', (event) => {
      onCollapseLifecycle(event, false)
    })
    EventHandler.on(document, 'shown.bs.collapse', (event) => {
      onCollapseLifecycle(event, true)
    })
    EventHandler.on(document, 'hidden.bs.collapse', (event) => {
      onCollapseLifecycle(event, false)
    })

    setTimeout(() => {
      openCurrentPageParents(CONFIG.menuSelector, closeButtonMessage)
      syncAllButtonStates()
    }, 100)
  }
}

const mainMenu = document.getElementById('main-menu')
if (mainMenu) {
  PrimaryNavigation.getOrCreateInstance(mainMenu)
}

export default PrimaryNavigation
