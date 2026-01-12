/**
 * Secondary Navigation Module
 * Handles both desktop and mobile navigation:
 * - Desktop: Dropdown menus with collapse submenus
 * - Mobile: Dropdown menu with collapse submenus and body state management
 * - Responsive: Closes menus when switching breakpoints
 */

import {
  closeButtonMessage,
  closeNavMessage,
  closeTitleMessage,
  openButtonMessage,
  openNavMessage,
  openTitleMessage
} from './../../i18n.js';

import {
  closeOtherSubmenus,
  openCurrentPageParents
} from '../../Utils/domUtils.js';

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  desktop: {
    container: '#nav-desktop',
    buttonSelector: '.first-nav-btn',
    // Collapse buttons in desktop flyout
    collapseButtonSelector: '[data-bs-toggle="collapse"]',
    subnavButtonSelector: '.subnav-children .hassub',
    subnavMenuSelector: '.subnav-children'
  },
  mobile: {
    container: '#main-menu',
    menuButton: '#main-menu-button',
    solrButton: '#solr-button',
    dropdownSelector: '#main-menu .dropdown-menu',
    // All collapse buttons in mobile menu
    collapseButtonSelector: '[data-bs-toggle="collapse"]',
    menuSelector: '.collapse'
  },
  breakpoint: '(min-width: 62rem)'
};

// =============================================================================
// SHARED STATE
// =============================================================================

const headerWrapper = document.querySelector('.header-wrapper');
const navDesktop = document.getElementById('nav-desktop');

// =============================================================================
// SHARED UTILITY FUNCTIONS
// =============================================================================

/**
 * Updates a button's visual and accessibility state
 * @param {HTMLElement} button - The button element to update
 * @param {boolean} isOpen - Whether the associated menu is open
 */
function updateButtonState(button, isOpen) {
  if (!button) return;

  button.setAttribute('title', isOpen ? closeButtonMessage : openButtonMessage);
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  button.classList.toggle('collapsed', !isOpen);
}

/**
 * Syncs all button states within a container based on menu state
 * @param {string} containerSelector - Container selector
 * @param {string} buttonSelector - Button selector
 * @param {HTMLElement|null} excludeButton - Button to exclude
 */
function syncAllButtonStates(containerSelector, buttonSelector, excludeButton = null) {
  document.querySelectorAll(`${containerSelector} ${buttonSelector}`).forEach(button => {
    if (button === excludeButton) return;

    const targetMenuId = button.getAttribute('data-bs-target');
    const targetMenu = document.querySelector(targetMenuId);
    const isOpen = targetMenu?.classList.contains('show') ?? false;
    updateButtonState(button, isOpen);
  });
}

/**
 * Finds the trigger button for a collapse event
 * @param {Event} event - Bootstrap collapse event
 * @returns {HTMLElement|null}
 */
function getTriggerButton(event) {
  const targetId = event.target.id;
  return document.querySelector(`[data-bs-target="#${targetId}"]`);
}

// =============================================================================
// DESKTOP NAVIGATION
// =============================================================================

/**
 * Updates button titles based on open/closed state
 */
function updateDesktopButtonTitles() {
  document.querySelectorAll(CONFIG.desktop.buttonSelector).forEach(button => {
    const isOpen = button.classList.contains('show');
    button.setAttribute('title', isOpen ? closeButtonMessage : openButtonMessage);
  });
}

/**
 * Syncs body/header active classes based on dropdown state
 */
function syncActiveNavClasses() {
  if (!headerWrapper) return;

  const root = navDesktop ?? document;
  const hasOpenDropdown = !!root.querySelector('.dropdown.show, .dropdown-menu.show');

  document.body.classList.toggle('active-nav-body', hasOpenDropdown);
  headerWrapper.classList.toggle('active-nav', hasOpenDropdown);
}

/**
 * Initializes desktop navigation event handlers
 */
function initDesktopNavigation() {
  // Handle dropdown show/hide events
  document.addEventListener('shown.bs.dropdown', (event) => {
    if (!event.target.closest(CONFIG.desktop.container)) return;
    syncActiveNavClasses();
    updateDesktopButtonTitles();
  });

  document.addEventListener('hidden.bs.dropdown', (event) => {
    if (!event.target.closest(CONFIG.desktop.container)) return;
    syncActiveNavClasses();
    updateDesktopButtonTitles();
  });

  // Close button in flyout menu
  document.querySelectorAll('.main-menu-desktop .btn-close').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector(`${CONFIG.desktop.buttonSelector}.show`)?.click();
    });
  });

  // Handle subnav collapse interactions
  document.querySelectorAll(CONFIG.desktop.subnavButtonSelector).forEach(subButton => {
    subButton.addEventListener('click', () => {
      closeOtherSubmenus(subButton, CONFIG.desktop.subnavButtonSelector, CONFIG.desktop.subnavMenuSelector);
    });
  });

  // Handle Bootstrap collapse events for desktop flyout submenus
  document.addEventListener('show.bs.collapse', (event) => {
    if (!event.target.closest(CONFIG.desktop.container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      closeOtherSubmenus(triggerButton, CONFIG.desktop.collapseButtonSelector, CONFIG.desktop.subnavMenuSelector);
      syncAllButtonStates(CONFIG.desktop.container, CONFIG.desktop.collapseButtonSelector, triggerButton);
      updateButtonState(triggerButton, true);
    }
  });

  document.addEventListener('hide.bs.collapse', (event) => {
    if (!event.target.closest(CONFIG.desktop.container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, false);
    }
  });

  document.addEventListener('shown.bs.collapse', (event) => {
    if (!event.target.closest(CONFIG.desktop.container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, true);
    }
    syncAllButtonStates(CONFIG.desktop.container, CONFIG.desktop.collapseButtonSelector);
  });

  document.addEventListener('hidden.bs.collapse', (event) => {
    if (!event.target.closest(CONFIG.desktop.container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, false);
    }
    syncAllButtonStates(CONFIG.desktop.container, CONFIG.desktop.collapseButtonSelector);
  });

  // Initialize: Open parent submenus for current page
  setTimeout(() => {
    openCurrentPageParents(CONFIG.desktop.subnavMenuSelector, closeButtonMessage);
    syncAllButtonStates(CONFIG.desktop.container, CONFIG.desktop.collapseButtonSelector);
  }, 100);
}

// =============================================================================
// MOBILE NAVIGATION
// =============================================================================

/**
 * Updates mobile menu button text and title
 * @param {HTMLElement} button - The button that triggered the dropdown
 * @param {boolean} isOpen - Whether the dropdown is opening
 */
function updateMobileMenuButton(button, isOpen) {
  if (!button || button.id !== 'main-menu-button') return;

  const textElement = button.querySelector('.txt > .visually-hidden');
  if (textElement) {
    textElement.textContent = isOpen ? closeNavMessage : openNavMessage;
  }

  button.setAttribute('title', isOpen ? closeTitleMessage : openTitleMessage);
}

/**
 * Handles mobile dropdown show/hide events
 * @param {Event} event - Bootstrap dropdown event
 * @param {boolean} isOpening - Whether the dropdown is opening
 */
function handleMobileDropdown(event, isOpening) {
  const button = event.target.closest(`${CONFIG.mobile.menuButton}, ${CONFIG.mobile.solrButton}`);
  if (!button) return;

  setTimeout(() => {
    if (isOpening) {
      document.body.classList.add('active-nav-body');
    } else {
      // Only remove if no dropdown is still open
      const anyOpen = document.querySelector(`${CONFIG.mobile.dropdownSelector}.show`);
      if (!anyOpen) {
        document.body.classList.remove('active-nav-body');
      }
    }
    updateMobileMenuButton(button, isOpening);
  }, 0);
}

/**
 * Initializes mobile navigation event handlers
 */
function initMobileNavigation() {
  // Main dropdown toggle events
  document.addEventListener('show.bs.dropdown', (event) => handleMobileDropdown(event, true));
  document.addEventListener('hide.bs.dropdown', (event) => handleMobileDropdown(event, false));

  // Direct click handler for immediate button state toggle on mobile collapse buttons
  document.addEventListener('click', (event) => {
    const button = event.target.closest(`${CONFIG.mobile.container} ${CONFIG.mobile.collapseButtonSelector}`);
    if (!button) return;

    const isCurrentlyCollapsed = button.classList.contains('collapsed');
    // Toggle immediately on click
    if (isCurrentlyCollapsed) {
      button.classList.remove('collapsed');
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('title', closeButtonMessage);
    } else {
      button.classList.add('collapsed');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('title', openButtonMessage);
    }
  });

  // Handle Bootstrap collapse events for mobile submenus
  document.addEventListener('show.bs.collapse', (event) => {
    if (!event.target.closest(CONFIG.mobile.container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      closeOtherSubmenus(triggerButton, CONFIG.mobile.collapseButtonSelector, CONFIG.mobile.menuSelector);
      syncAllButtonStates(CONFIG.mobile.container, CONFIG.mobile.collapseButtonSelector, triggerButton);
      updateButtonState(triggerButton, true);
    }
  });

  document.addEventListener('hide.bs.collapse', (event) => {
    if (!event.target.closest(CONFIG.mobile.container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, false);
    }
  });

  document.addEventListener('shown.bs.collapse', (event) => {
    if (!event.target.closest(CONFIG.mobile.container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, true);
    }
    syncAllButtonStates(CONFIG.mobile.container, CONFIG.mobile.collapseButtonSelector);
  });

  document.addEventListener('hidden.bs.collapse', (event) => {
    if (!event.target.closest(CONFIG.mobile.container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, false);
    }
    syncAllButtonStates(CONFIG.mobile.container, CONFIG.mobile.collapseButtonSelector);
  });

  // Initialize: Open parent submenus for current page
  setTimeout(() => {
    openCurrentPageParents(CONFIG.mobile.menuSelector, closeButtonMessage);
    syncAllButtonStates(CONFIG.mobile.container, CONFIG.mobile.collapseButtonSelector);
  }, 100);
}

// =============================================================================
// RESPONSIVE BEHAVIOR
// =============================================================================

/**
 * Handles breakpoint changes - closes open menus
 */
function initResponsiveBehavior() {
  const mediaQuery = window.matchMedia(CONFIG.breakpoint);
  const body = document.body;

  const handleResize = () => {
    const navbarToggler = document.querySelector('.navbar-toggler.show');
    const firstNavShow = document.querySelector('.first-nav.show');

    if (mediaQuery.matches) {
      // Switching to desktop
      navbarToggler?.click();
      firstNavShow?.click();
    } else {
      // Switching to mobile
      firstNavShow?.click();
      navbarToggler?.click();
    }

    body.classList.remove('active-nav-body');
    headerWrapper?.classList.remove('active-nav');
  };

  mediaQuery.addEventListener('change', handleResize);
  handleResize();
}

// =============================================================================
// INITIALIZATION
// =============================================================================

function init() {
  if (navDesktop) {
    initDesktopNavigation();
  }

  if (document.getElementById('main-menu')) {
    initMobileNavigation();
  }

  initResponsiveBehavior();
}

init();
