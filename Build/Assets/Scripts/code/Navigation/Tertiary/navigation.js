/**
 * Tertiary Navigation Module
 * Handles both desktop and mobile navigation interactions including:
 * - Dropdown visibility
 * - Collapse/expand submenus
 * - Button state management (icons, aria attributes)
 * - Responsive behavior
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
  handleDropdownVisibility,
  toggleNavState,
  closeOtherSubmenus,
  openCurrentPageParents
} from '../../Utils/domUtils.js';

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  desktop: {
    container: '.mainnav-desktop',
    buttonSelector: '.dropdown-item-button',
    menuSelector: '.collapse',
    parentMenuSelector: '.subnav-children'
  },
  mobile: {
    container: '#main-menu',
    buttonSelector: '.dropdown-item-button',
    menuSelector: '.collapse',
    parentMenuSelector: '.collapse'
  },
  breakpoint: '(min-width: 62rem)'
};

// =============================================================================
// SHARED UTILITY FUNCTIONS
// =============================================================================

/**
 * Updates a button's visual and accessibility state
 * @param {HTMLElement} button - The button element to update
 * @param {boolean} isOpen - Whether the associated menu is open
 * @param {boolean} updateVisuallyHidden - Whether to update .visually-hidden text (mobile only)
 */
function updateButtonState(button, isOpen, updateVisuallyHidden = false) {
  if (!button) return;

  // Update accessibility attributes
  button.setAttribute('title', isOpen ? closeButtonMessage : openButtonMessage);
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

  // Update collapsed class (controls icon rotation via CSS)
  button.classList.toggle('collapsed', !isOpen);

  // Update visually hidden text if present (for screen readers)
  if (updateVisuallyHidden) {
    const buttonText = button.querySelector('.visually-hidden');
    if (buttonText) {
      buttonText.textContent = isOpen ? closeButtonMessage : openButtonMessage;
    }
  }
}

/**
 * Syncs all button states within a container based on their menu's current state
 * @param {string} containerSelector - CSS selector for the navigation container
 * @param {string} buttonSelector - CSS selector for buttons within the container
 * @param {HTMLElement|null} excludeButton - Button to exclude from sync (usually the one being clicked)
 * @param {boolean} updateVisuallyHidden - Whether to update .visually-hidden text
 */
function syncAllButtonStates(containerSelector, buttonSelector, excludeButton = null, updateVisuallyHidden = false) {
  const selector = `${containerSelector} ${buttonSelector}`;
  
  document.querySelectorAll(selector).forEach(button => {
    if (button === excludeButton) return;

    const targetMenuId = button.getAttribute('data-bs-target');
    const targetMenu = document.querySelector(targetMenuId);
    const isOpen = targetMenu?.classList.contains('show') ?? false;
    
    updateButtonState(button, isOpen, updateVisuallyHidden);
  });
}

/**
 * Finds the trigger button for a collapse event
 * @param {Event} event - Bootstrap collapse event
 * @returns {HTMLElement|null} - The button that triggered the collapse
 */
function getTriggerButton(event) {
  const targetId = event.target.id;
  return document.querySelector(`[data-bs-target="#${targetId}"]`);
}

// =============================================================================
// COLLAPSE EVENT HANDLERS FACTORY
// =============================================================================

/**
 * Creates and registers Bootstrap collapse event handlers for a navigation container
 * @param {Object} config - Configuration object with container, buttonSelector, menuSelector
 * @param {boolean} updateVisuallyHidden - Whether to update .visually-hidden text
 */
function registerCollapseHandlers(config, updateVisuallyHidden = false) {
  const { container, buttonSelector, menuSelector } = config;

  // Handle collapse SHOW event (before animation)
  document.addEventListener('show.bs.collapse', (event) => {
    if (!event.target.closest(container)) return;

    const triggerButton = getTriggerButton(event);
    if (!triggerButton) return;

    // Close sibling submenus and sync their button states
    closeOtherSubmenus(triggerButton, buttonSelector, menuSelector);
    syncAllButtonStates(container, buttonSelector, triggerButton, updateVisuallyHidden);
    
    // Update the clicked button to open state
    updateButtonState(triggerButton, true, updateVisuallyHidden);
  });

  // Handle collapse HIDE event (before animation)
  document.addEventListener('hide.bs.collapse', (event) => {
    if (!event.target.closest(container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, false, updateVisuallyHidden);
    }
  });

  // Handle collapse SHOWN event (after animation completes)
  document.addEventListener('shown.bs.collapse', (event) => {
    if (!event.target.closest(container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, true, updateVisuallyHidden);
    }
    
    // Final sync to ensure consistency
    syncAllButtonStates(container, buttonSelector, null, updateVisuallyHidden);
  });

  // Handle collapse HIDDEN event (after animation completes)
  document.addEventListener('hidden.bs.collapse', (event) => {
    if (!event.target.closest(container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, false, updateVisuallyHidden);
    }
    
    // Final sync to ensure consistency
    syncAllButtonStates(container, buttonSelector, null, updateVisuallyHidden);
  });
}

/**
 * Registers a click handler for immediate button state toggle
 * @param {string} selector - CSS selector for buttons
 */
function registerClickHandler(selector) {
  document.addEventListener('click', (event) => {
    const button = event.target.closest(selector);
    if (!button) return;

    const isCurrentlyCollapsed = button.classList.contains('collapsed');
    updateButtonState(button, isCurrentlyCollapsed, false);
  });
}

// =============================================================================
// DESKTOP NAVIGATION
// =============================================================================

function initDesktopNavigation() {
  const body = document.body;
  const headerWrapper = document.querySelector('.header-wrapper');

  // Handle first-level dropdown visibility (adds body classes for overlay effects)
  document.querySelectorAll('.mainnav-desktop-item').forEach(item => {
    handleDropdownVisibility(
      item,
      () => setTimeout(() => {
        body.classList.add('active-nav-body');
        headerWrapper?.classList.add('active-nav');
      }, 0),
      () => {
        body.classList.remove('active-nav-body');
        headerWrapper?.classList.remove('active-nav');
      }
    );
  });

  // Register click handler for immediate button state toggle
  registerClickHandler(`${CONFIG.desktop.container} ${CONFIG.desktop.buttonSelector}`);

  // Register Bootstrap collapse event handlers
  registerCollapseHandlers(CONFIG.desktop, false);

  // Initialize: Open parent submenus for current page
  setTimeout(() => {
    openCurrentPageParents(CONFIG.desktop.parentMenuSelector, closeButtonMessage);
    syncAllButtonStates(CONFIG.desktop.container, CONFIG.desktop.buttonSelector, null, false);
  }, 100);
}

// =============================================================================
// MOBILE NAVIGATION
// =============================================================================

function initMobileNavigation() {
  const body = document.body;
  const headerWrapper = document.querySelector('.header-wrapper');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarTogglerText = document.querySelector('.navbar-toggler span.txt > .visually-hidden');
  const dropdown = document.getElementById('main-menu');

  if (!dropdown) return;

  // Handle main mobile menu visibility
  handleDropdownVisibility(
    dropdown,
    () => toggleNavState(true, body, headerWrapper, navbarToggler, navbarTogglerText, 
                         openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage),
    () => toggleNavState(false, body, headerWrapper, navbarToggler, navbarTogglerText, 
                         openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage)
  );

  // Close button for desktop flyout menu
  document.querySelectorAll('.main-menu-desktop .btn-close').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('.first-nav-button.show')?.click();
    });
  });

  // Handle subnav-children links with submenus
  document.querySelectorAll('.subnav-children .hassub').forEach(subButton => {
    subButton.addEventListener('click', () => {
      closeOtherSubmenus(subButton, '.subnav-children .hassub', '.subnav-children');
    });
  });

  // Register click handler for immediate button state toggle
  registerClickHandler(`${CONFIG.mobile.container} ${CONFIG.mobile.buttonSelector}`);

  // Register Bootstrap collapse event handlers (with visually-hidden text updates)
  registerCollapseHandlers(CONFIG.mobile, true);

  // Initialize: Open parent submenus for current page
  setTimeout(() => {
    openCurrentPageParents(CONFIG.mobile.parentMenuSelector, closeButtonMessage);
    syncAllButtonStates(CONFIG.mobile.container, CONFIG.mobile.buttonSelector, null, true);
  }, 100);
}

// =============================================================================
// RESPONSIVE BEHAVIOR
// =============================================================================

function initResponsiveBehavior() {
  const mediaQuery = window.matchMedia(CONFIG.breakpoint);
  const body = document.body;
  const headerWrapper = document.querySelector('.header-wrapper');

  const handleResize = () => {
    const navbarToggler = document.querySelector('.navbar-toggler.show');
    const firstNavShow = document.querySelector('.first-nav.show');

    // Close open menus when switching between breakpoints
    if (mediaQuery.matches) {
      // Switching to desktop: close mobile menu first
      navbarToggler?.click();
      firstNavShow?.click();
    } else {
      // Switching to mobile: close desktop menu first
      firstNavShow?.click();
      navbarToggler?.click();
    }

    // Reset body state
    body.classList.remove('active-nav-body');
    headerWrapper?.classList.remove('active-nav');
  };

  mediaQuery.addEventListener('change', handleResize);
  handleResize(); // Run on init
}

// =============================================================================
// INITIALIZATION
// =============================================================================

function init() {
  // Initialize desktop navigation if present
  if (document.querySelector('.mainnav-desktop')) {
    initDesktopNavigation();
  }

  // Initialize mobile navigation if present
  if (document.getElementById('main-menu')) {
    initMobileNavigation();
  }

  // Initialize responsive behavior
  initResponsiveBehavior();
}

// Start the module
init();
