export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait = 100
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

export function toggleNavState(
  isShow: boolean,
  body: HTMLElement,
  headerWrapper: HTMLElement | null | undefined,
  navbarToggler: HTMLElement | null | undefined,
  navbarTogglerText: HTMLElement | null | undefined,
  openTitle: string,
  closeTitle: string,
  openNav: string,
  closeNav: string
): void {
  body.classList.toggle('active-nav-body', isShow)
  headerWrapper?.classList.toggle('active-nav', isShow)

  if (navbarToggler) {
    navbarToggler.setAttribute('title', isShow ? closeTitle : openTitle)
  }

  if (navbarTogglerText) {
    navbarTogglerText.textContent = isShow ? closeNav : openNav
  }
}

let navOverlaySyncFrame = 0

export function hasOpenDesktopOrMobileNav(desktopSelector = '.mainnav-desktop'): boolean {
  return !!document.querySelector(
    `${desktopSelector} .menu.show, #nav-desktop .menu.show, #main-menu.show`
  )
}

export function isMenuNavLinkClick(clickEvent: Event | null | undefined): boolean {
  if (!clickEvent) return false

  const target = clickEvent.target
  if (!(target instanceof Element)) return false

  const link = target.closest('a[href]')
  if (!(link instanceof HTMLAnchorElement)) return false

  const href = link.getAttribute('href')
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return false
  if (link.target === '_blank') return false

  return true
}

export function scheduleNavOverlaySync(
  body: HTMLElement,
  headerWrapper: HTMLElement | null | undefined,
  hasOpenNav: () => boolean
): void {
  cancelAnimationFrame(navOverlaySyncFrame)
  navOverlaySyncFrame = requestAnimationFrame(() => {
    navOverlaySyncFrame = requestAnimationFrame(() => {
      const isOpen = hasOpenNav()
      body.classList.toggle('active-nav-body', isOpen)
      headerWrapper?.classList.toggle('active-nav', isOpen)
    })
  })
}

export function handleMenuVisibility(
  element: HTMLElement | null | undefined,
  showCallback: EventListener,
  hideCallback: EventListener
): void {
  if (!element) return
  element.addEventListener('show.bs.menu', showCallback)
  element.addEventListener('hide.bs.menu', hideCallback)
}

export function toggleAriaLabelAndTitle(
  element: HTMLElement | null | undefined,
  openLabel: string,
  closeLabel: string
): void {
  if (!element) return

  const currentLabel = element.getAttribute('aria-label') || element.getAttribute('title')
  const newLabel = currentLabel === openLabel ? closeLabel : openLabel

  element.setAttribute('aria-label', newLabel)
  element.setAttribute('title', newLabel)
}

export function openCurrentPageParents(menuSelector = '.collapse', openText = 'Close Submenu'): void {
  const currentPageElements = document.querySelectorAll('[aria-current="page"], .current')

  currentPageElements.forEach(currentElement => {
    const parentsToOpen: Element[] = []
    let parent: Element | null = currentElement.parentElement

    while (parent) {
      if (parent.matches(menuSelector)) {
        parentsToOpen.unshift(parent)
      }
      parent = parent.parentElement
    }

    parentsToOpen.forEach(menu => {
      menu.classList.add('show')

      const button = document.querySelector(`[data-bs-target="#${menu.id}"]`)
      if (button instanceof HTMLElement) {
        button.classList.remove('collapsed')
        button.setAttribute('aria-expanded', 'true')
        button.setAttribute('aria-label', openText)
        button.setAttribute('title', openText)

        const svgTitle = button.querySelector('svg title')
        if (svgTitle) {
          svgTitle.textContent = openText
        }

        const buttonText = button.querySelector('.visually-hidden')
        if (buttonText) {
          buttonText.textContent = openText
        }
      }
    })
  })
}

export type ScrollToCurrentOptions = {
  behavior?: ScrollBehavior
  block?: ScrollLogicalPosition
}

export function scrollToCurrentElement(
  containerSelector: string,
  options: ScrollToCurrentOptions = {}
): void {
  const { behavior = 'smooth', block = 'center' } = options
  const container = document.querySelector(containerSelector)

  if (!container) return

  const currentElement = container.querySelector('[aria-current="page"]')
    || container.querySelector('.current')

  if (!(currentElement instanceof HTMLElement)) return

  if (!currentElement.hasAttribute('tabindex') && !currentElement.matches('a, button, input, select, textarea')) {
    currentElement.setAttribute('tabindex', '-1')
  }

  currentElement.focus({ preventScroll: true })
  currentElement.scrollIntoView({ behavior, block })
}

function getMenuLevel(menu: Element, menuSelector: string): number {
  let level = 0
  let current: Element | null = menu

  while (current?.parentElement) {
    const parentMenu: Element | null = current.parentElement.closest(menuSelector)
    if (parentMenu) {
      level++
      current = parentMenu
    } else {
      break
    }
  }

  return level
}

export function closeOtherSubmenus(
  targetButton: HTMLElement | null | undefined,
  buttonSelector = '.btn-open',
  menuSelector = '.collapse'
): void {
  if (!targetButton) return

  const targetMenuId = targetButton.getAttribute('data-bs-target')
  if (!targetMenuId) return

  const targetMenu = document.querySelector(targetMenuId)

  if (!targetMenu) return

  const targetLevel = getMenuLevel(targetMenu, menuSelector)

  document.querySelectorAll(`${menuSelector}.show`).forEach(menu => {
    const menuLevel = getMenuLevel(menu, menuSelector)
    const menuId = `#${menu.id}`

    if (menuLevel >= targetLevel && menuId !== targetMenuId) {
      menu.classList.remove('show')

      menu.querySelectorAll(`${menuSelector}.show`).forEach(childMenu => {
        childMenu.classList.remove('show')
      })
    }
  })

  document.querySelectorAll(buttonSelector).forEach(button => {
    if (!(button instanceof HTMLElement)) return

    const buttonMenuId = button.getAttribute('data-bs-target')
    if (!buttonMenuId) return

    const buttonMenu = document.querySelector(buttonMenuId)

    if (buttonMenu) {
      const isOpen = buttonMenu.classList.contains('show')
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
      button.classList.toggle('collapsed', !isOpen)
    }
  })
}
