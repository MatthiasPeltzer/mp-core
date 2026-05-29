/**
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * @param {boolean} isShow
 * @param {HTMLElement} body
 * @param {HTMLElement} headerWrapper
 * @param {HTMLElement} navbarToggler
 * @param {HTMLElement} navbarTogglerText
 * @param {string} openTitle
 * @param {string} closeTitle
 * @param {string} openNav
 * @param {string} closeNav
 */
export function toggleNavState(
  isShow,
  body,
  headerWrapper,
  navbarToggler,
  navbarTogglerText,
  openTitle,
  closeTitle,
  openNav,
  closeNav
) {
  body.classList.toggle('active-nav-body', isShow);
  headerWrapper?.classList.toggle('active-nav', isShow);

  if (navbarToggler) {
    navbarToggler.setAttribute('title', isShow ? closeTitle : openTitle);
  }

  if (navbarTogglerText) {
    navbarTogglerText.textContent = isShow ? closeNav : openNav;
  }
}

let navOverlaySyncFrame = 0;

/**
 * @param {string} desktopSelector
 * @returns {boolean}
 */
export function hasOpenDesktopOrMobileNav(desktopSelector = '.mainnav-desktop') {
  return !!document.querySelector(
    `${desktopSelector} .dropdown-menu.show, #nav-desktop .dropdown-menu.show, #main-menu.show`
  );
}

/**
 * @param {Event|null|undefined} clickEvent
 * @returns {boolean}
 */
export function isDropdownNavLinkClick(clickEvent) {
  if (!clickEvent) return false;

  const link = clickEvent.target?.closest?.('a[href]');
  if (!link) return false;

  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return false;
  if (link.target === '_blank') return false;

  return true;
}

/**
 * Defers overlay sync so hide/show sequences (e.g. switching top-level menus) settle first.
 *
 * @param {HTMLElement} body
 * @param {HTMLElement|null|undefined} headerWrapper
 * @param {() => boolean} hasOpenNav
 */
export function scheduleNavOverlaySync(body, headerWrapper, hasOpenNav) {
  cancelAnimationFrame(navOverlaySyncFrame);
  navOverlaySyncFrame = requestAnimationFrame(() => {
    navOverlaySyncFrame = requestAnimationFrame(() => {
      const isOpen = hasOpenNav();
      body.classList.toggle('active-nav-body', isOpen);
      headerWrapper?.classList.toggle('active-nav', isOpen);
    });
  });
}

/**
 * @param {HTMLElement} element
 * @param {Function} showCallback
 * @param {Function} hideCallback
 */
export function handleDropdownVisibility(element, showCallback, hideCallback) {
  if (!element) return;
  element.addEventListener('show.bs.dropdown', showCallback);
  element.addEventListener('hide.bs.dropdown', (event) => hideCallback(event));
}

/**
 * @param {HTMLElement} element
 * @param {string} openLabel
 * @param {string} closeLabel
 */
export function toggleAriaLabelAndTitle(element, openLabel, closeLabel) {
  if (!element) return;

  const currentLabel = element.getAttribute('aria-label') || element.getAttribute('title');
  const newLabel = currentLabel === openLabel ? closeLabel : openLabel;

  element.setAttribute('aria-label', newLabel);
  element.setAttribute('title', newLabel);
}

/**
 * Opens parent collapse menus for the current page's nav item.
 * Looks for [aria-current="page"] or .current; opens ancestor menus matching
 * `menuSelector` without opening child menus below the current element.
 *
 * @param {string} menuSelector
 * @param {string} openText
 */
export function openCurrentPageParents(menuSelector = '.collapse', openText = 'Close Submenu') {
  const currentPageElements = document.querySelectorAll('[aria-current="page"], .current');

  currentPageElements.forEach(currentElement => {
    const parentsToOpen = [];
    let parent = currentElement.parentElement;

    while (parent) {
      if (parent.matches(menuSelector)) {
        parentsToOpen.unshift(parent);
      }
      parent = parent.parentElement;
    }

    parentsToOpen.forEach(menu => {
      menu.classList.add('show');

      const button = document.querySelector(`[data-bs-target="#${menu.id}"]`);
      if (button) {
        button.classList.remove('collapsed');
        button.setAttribute('aria-expanded', 'true');
        button.setAttribute('title', openText);

        const buttonText = button.querySelector('.visually-hidden');
        if (buttonText) {
          buttonText.textContent = openText;
        }
      }
    });
  });
}

/**
 * Focuses and scrolls to [aria-current="page"] or .current within the container.
 *
 * @param {string} containerSelector
 * @param {Object} options
 * @param {string} options.behavior
 * @param {string} options.block
 */
export function scrollToCurrentElement(containerSelector, options = {}) {
  const {behavior = 'smooth', block = 'center'} = options;
  const container = document.querySelector(containerSelector);

  if (!container) return;

  const currentElement = container.querySelector('[aria-current="page"]')
    || container.querySelector('.current');

  if (currentElement) {
    if (!currentElement.hasAttribute('tabindex') && !currentElement.matches('a, button, input, select, textarea')) {
      currentElement.setAttribute('tabindex', '-1');
    }

    currentElement.focus({preventScroll: true});
    currentElement.scrollIntoView({behavior, block});
  }
}

/**
 * @param {HTMLElement} menu
 * @param {string} menuSelector
 * @returns {number}
 */
function getMenuLevel(menu, menuSelector) {
  let level = 0;
  let current = menu;

  while (current?.parentElement) {
    const parentMenu = current.parentElement.closest(menuSelector);
    if (parentMenu) {
      level++;
      current = parentMenu;
    } else {
      break;
    }
  }

  return level;
}

/**
 * Closes open sibling/child submenus at the same nesting level or deeper.
 *
 * @param {HTMLElement} targetButton
 * @param {string} buttonSelector
 * @param {string} menuSelector
 */
export function closeOtherSubmenus(targetButton, buttonSelector = '.btn-open', menuSelector = '.collapse') {
  if (!targetButton) return;

  const targetMenuId = targetButton.getAttribute('data-bs-target');
  const targetMenu = document.querySelector(targetMenuId);

  if (!targetMenu) return;

  const targetLevel = getMenuLevel(targetMenu, menuSelector);

  document.querySelectorAll(`${menuSelector}.show`).forEach(menu => {
    const menuLevel = getMenuLevel(menu, menuSelector);
    const menuId = `#${menu.id}`;

    if (menuLevel >= targetLevel && menuId !== targetMenuId) {
      menu.classList.remove('show');

      menu.querySelectorAll(`${menuSelector}.show`).forEach(childMenu => {
        childMenu.classList.remove('show');
      });
    }
  });

  document.querySelectorAll(buttonSelector).forEach(button => {
    const buttonMenuId = button.getAttribute('data-bs-target');
    const buttonMenu = document.querySelector(buttonMenuId);

    if (buttonMenu) {
      const isOpen = buttonMenu.classList.contains('show');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      button.classList.toggle('collapsed', !isOpen);
    }
  });
}
