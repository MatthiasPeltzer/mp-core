/**
 * Primary Navigation Module
 * Handles mobile navigation with Bootstrap collapse submenus
 */

import {
  closeButtonMessage,
  openButtonMessage
} from './../../i18n.js';

import {
  toggleNavState,
  closeOtherSubmenus,
  openCurrentPageParents
} from '../../Utils/domUtils.js';

import {
  closeNavMessage,
  closeTitleMessage,
  openNavMessage,
  openTitleMessage
} from './../../i18n.js';

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  container: '#main-menu',
  buttonSelector: '.btn-open',
  menuSelector: '.collapse'
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Updates a button's visual and accessibility state
 * @param {HTMLElement} button - The button element to update
 * @param {boolean} isOpen - Whether the associated menu is open
 */
function updateButtonState(button, isOpen) {
  if (!button) return;

  const buttonText = button.querySelector('.visually-hidden');
  if (buttonText) {
    buttonText.textContent = isOpen ? closeButtonMessage : openButtonMessage;
  }
  
  button.setAttribute('title', isOpen ? closeButtonMessage : openButtonMessage);
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  button.classList.toggle('collapsed', !isOpen);
}

/**
 * Syncs all button states within the navigation based on menu state
 */
function syncAllButtonStates() {
  document.querySelectorAll(`${CONFIG.container} ${CONFIG.buttonSelector}`).forEach(button => {
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
// INITIALIZATION
// =============================================================================

function initPrimaryNavigation() {
  const dropdown = document.getElementById('main-menu');
  if (!dropdown) return;

  const body = document.body;
  const headerWrapper = document.querySelector('.header-wrapper');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarTogglerText = document.querySelector('.navbar-toggler span.txt > .visually-hidden');

  // Handle main dropdown visibility
  dropdown.addEventListener('show.bs.dropdown', () => {
    toggleNavState(true, body, headerWrapper, navbarToggler, navbarTogglerText, 
                   openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage);
  });
  
  dropdown.addEventListener('hide.bs.dropdown', () => {
    toggleNavState(false, body, headerWrapper, navbarToggler, navbarTogglerText, 
                   openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage);
  });

  // Handle Bootstrap collapse events for submenus
  document.addEventListener('show.bs.collapse', (event) => {
    if (!event.target.closest(CONFIG.container)) return;
    
    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      closeOtherSubmenus(triggerButton, CONFIG.buttonSelector, CONFIG.menuSelector);
      updateButtonState(triggerButton, true);
    }
  });

  document.addEventListener('hide.bs.collapse', (event) => {
    if (!event.target.closest(CONFIG.container)) return;
    
    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, false);
    }
  });

  document.addEventListener('shown.bs.collapse', (event) => {
    if (!event.target.closest(CONFIG.container)) return;
    
    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, true);
    }
  });

  document.addEventListener('hidden.bs.collapse', (event) => {
    if (!event.target.closest(CONFIG.container)) return;
    
    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, false);
    }
  });

  // Initialize: Open parent submenus for current page
  setTimeout(() => {
    openCurrentPageParents(CONFIG.menuSelector, closeButtonMessage);
    syncAllButtonStates();
  }, 100);
}

// Start the module
if (document.querySelector(CONFIG.container)) {
  initPrimaryNavigation();
}
