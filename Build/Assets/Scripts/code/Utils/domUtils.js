/**
 * DOM Utilities Module
 * Shared utility functions for DOM manipulation and navigation handling
 */

// =============================================================================
// GENERAL UTILITIES
// =============================================================================

/**
 * Creates a debounced version of a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds (default: 100)
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// =============================================================================
// NAVIGATION STATE UTILITIES
// =============================================================================

/**
 * Toggles navigation state classes and updates button attributes
 * @param {boolean} isShow - Whether navigation is showing
 * @param {HTMLElement} body - Document body element
 * @param {HTMLElement} headerWrapper - Header wrapper element
 * @param {HTMLElement} navbarToggler - Navbar toggler button
 * @param {HTMLElement} navbarTogglerText - Text element inside toggler
 * @param {string} openTitle - Title text for closed state
 * @param {string} closeTitle - Title text for open state
 * @param {string} openNav - Button text for closed state
 * @param {string} closeNav - Button text for open state
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

/**
 * Registers Bootstrap dropdown visibility event handlers
 * @param {HTMLElement} element - Element to attach handlers to
 * @param {Function} showCallback - Called when dropdown shows
 * @param {Function} hideCallback - Called when dropdown hides
 */
export function handleDropdownVisibility(element, showCallback, hideCallback) {
  if (!element) return;
  element.addEventListener('show.bs.dropdown', showCallback);
  element.addEventListener('hide.bs.dropdown', hideCallback);
}

/**
 * Toggles aria-label and title between two values
 * @param {HTMLElement} element - Element to update
 * @param {string} openLabel - Label for closed state
 * @param {string} closeLabel - Label for open state
 */
export function toggleAriaLabelAndTitle(element, openLabel, closeLabel) {
  if (!element) return;

  const currentLabel = element.getAttribute('aria-label') || element.getAttribute('title');
  const newLabel = currentLabel === openLabel ? closeLabel : openLabel;

  element.setAttribute('aria-label', newLabel);
  element.setAttribute('title', newLabel);
}

// =============================================================================
// SUBMENU UTILITIES
// =============================================================================

/**
 * Opens parent submenus for current page menu items
 * Looks for elements with aria-current="page" or .current class
 * Provides navigation context by showing the current page's location
 * Only opens parent collapses, not child collapses controlled by the current element
 * @param {string} menuSelector - CSS selector for menu containers (default: '.collapse')
 * @param {string} openText - Text to display when submenu is open (default: 'Close Submenu')
 */
export function openCurrentPageParents(menuSelector = '.collapse', openText = 'Close Submenu') {
  // Find current elements - prioritize aria-current, then fallback to .current class
  const currentPageElements = document.querySelectorAll('[aria-current="page"], .current');

  currentPageElements.forEach(currentElement => {
    const parentsToOpen = [];
    let parent = currentElement.parentElement;

    // Traverse up the DOM tree to find all parent submenus
    while (parent) {
      if (parent.matches(menuSelector)) {
        parentsToOpen.unshift(parent);
      }
      parent = parent.parentElement;
    }

    // Open all parent submenus (but not child submenus controlled by the current element)
    parentsToOpen.forEach(menu => {
      menu.classList.add('show');

      // Find and update the corresponding button
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
 * Focuses and scrolls to the current page element in the navigation
 * Looks for elements with aria-current="page" or .current class
 * @param {string} containerSelector - CSS selector for the navigation container
 * @param {Object} options - Scroll options
 * @param {string} options.behavior - Scroll behavior ('smooth' or 'instant', default: 'smooth')
 * @param {string} options.block - Vertical alignment ('center', 'start', 'end', 'nearest', default: 'center')
 */
export function scrollToCurrentElement(containerSelector, options = {}) {
  const {behavior = 'smooth', block = 'center'} = options;
  const container = document.querySelector(containerSelector);

  if (!container) return;

  // Find the current element - prioritize aria-current, then fallback to .current class
  const currentElement = container.querySelector('[aria-current="page"]')
    || container.querySelector('.current');

  if (currentElement) {
    // Make element focusable if it isn't already
    if (!currentElement.hasAttribute('tabindex') && !currentElement.matches('a, button, input, select, textarea')) {
      currentElement.setAttribute('tabindex', '-1');
    }

    // Focus the element (this also scrolls it into view in most browsers)
    currentElement.focus({preventScroll: true});

    // Ensure it's scrolled into view with the desired positioning
    currentElement.scrollIntoView({behavior, block});
  }
}

/**
 * Calculates menu nesting level by counting ancestors
 * @param {HTMLElement} menu - Menu element to check
 * @param {string} menuSelector - CSS selector for menu containers
 * @returns {number} Nesting level (0 = top level)
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
 * Closes all other open submenus except the one being opened
 * Handles nested levels by closing menus at the same level or deeper
 * @param {HTMLElement} targetButton - The button that was clicked to open a submenu
 * @param {string} buttonSelector - CSS selector for submenu buttons (default: '.btn-open')
 * @param {string} menuSelector - CSS selector for submenu containers (default: '.collapse')
 */
export function closeOtherSubmenus(targetButton, buttonSelector = '.btn-open', menuSelector = '.collapse') {
  if (!targetButton) return;

  const targetMenuId = targetButton.getAttribute('data-bs-target');
  const targetMenu = document.querySelector(targetMenuId);

  if (!targetMenu) return;

  const targetLevel = getMenuLevel(targetMenu, menuSelector);

  // Close all open menus at the same level or deeper
  document.querySelectorAll(`${menuSelector}.show`).forEach(menu => {
    const menuLevel = getMenuLevel(menu, menuSelector);
    const menuId = `#${menu.id}`;

    if (menuLevel >= targetLevel && menuId !== targetMenuId) {
      menu.classList.remove('show');

      // Also close any child menus
      menu.querySelectorAll(`${menuSelector}.show`).forEach(childMenu => {
        childMenu.classList.remove('show');
      });
    }
  });

  // Update button states for all affected buttons
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
