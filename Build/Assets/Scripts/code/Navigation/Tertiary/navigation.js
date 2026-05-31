/**
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
  hasOpenDesktopOrMobileNav,
  isDropdownNavLinkClick,
  scheduleNavOverlaySync,
  toggleNavState,
  closeOtherSubmenus,
  openCurrentPageParents,
  scrollToCurrentElement
} from '../../Utils/domUtils.js';

const CONFIG = {
  desktop: {
    container: '.mainnav-desktop',
    buttonSelector: '.dropdown-item-button',
    dropdownButtonSelector: '.first-nav-button',
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

/**
 * @param {HTMLElement} button
 * @param {boolean} isOpen
 * @param {boolean} updateVisuallyHidden - Whether to update .visually-hidden text (mobile only)
 * @param {boolean} toggleCollapsed - Whether to toggle Bootstrap collapse .collapsed class
 */
function updateButtonState(button, isOpen, updateVisuallyHidden = false, toggleCollapsed = true) {
  if (!button) return;

  const label = isOpen ? closeButtonMessage : openButtonMessage;

  button.setAttribute('aria-label', label);
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

  if (toggleCollapsed) {
    button.classList.toggle('collapsed', !isOpen);
  }

  const svgTitle = button.querySelector('svg title');
  if (svgTitle) {
    svgTitle.textContent = label;
  }

  if (updateVisuallyHidden) {
    const buttonText = button.querySelector('.visually-hidden');
    if (buttonText) {
      buttonText.textContent = label;
    }
  }
}

/**
 * @param {string} containerSelector
 * @param {string} buttonSelector
 * @param {HTMLElement|null} excludeButton
 * @param {boolean} updateVisuallyHidden
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
 * @param {Event} event
 * @returns {HTMLElement|null}
 */
function getTriggerButton(event) {
  const targetId = event.target.id;
  return document.querySelector(`[data-bs-target="#${targetId}"]`);
}

/**
 * Creates and registers Bootstrap collapse event handlers for a navigation container.
 * @param {Object} config
 * @param {boolean} updateVisuallyHidden
 */
function registerCollapseHandlers(config, updateVisuallyHidden = false) {
  const { container, buttonSelector, menuSelector } = config;

  document.addEventListener('show.bs.collapse', (event) => {
    if (!event.target.closest(container)) return;

    const triggerButton = getTriggerButton(event);
    if (!triggerButton) return;

    closeOtherSubmenus(triggerButton, buttonSelector, menuSelector);
    syncAllButtonStates(container, buttonSelector, triggerButton, updateVisuallyHidden);
    updateButtonState(triggerButton, true, updateVisuallyHidden);
  });

  document.addEventListener('hide.bs.collapse', (event) => {
    if (!event.target.closest(container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, false, updateVisuallyHidden);
    }
  });

  document.addEventListener('shown.bs.collapse', (event) => {
    if (!event.target.closest(container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, true, updateVisuallyHidden);
    }
    syncAllButtonStates(container, buttonSelector, null, updateVisuallyHidden);
  });

  document.addEventListener('hidden.bs.collapse', (event) => {
    if (!event.target.closest(container)) return;

    const triggerButton = getTriggerButton(event);
    if (triggerButton) {
      updateButtonState(triggerButton, false, updateVisuallyHidden);
    }
    syncAllButtonStates(container, buttonSelector, null, updateVisuallyHidden);
  });
}

/**
 * @param {string} selector
 */
function registerClickHandler(selector, updateVisuallyHidden = false) {
  document.addEventListener('click', (event) => {
    const button = event.target.closest(selector);
    if (!button) return;

    const isCurrentlyCollapsed = button.classList.contains('collapsed');
    updateButtonState(button, isCurrentlyCollapsed, updateVisuallyHidden);
  });
}

function syncDesktopNavOverlay() {
  scheduleNavOverlaySync(
    document.body,
    document.querySelector('.header-wrapper'),
    () => hasOpenDesktopOrMobileNav(CONFIG.desktop.container)
  );
}

/**
 * Syncs aria-label / SVG title on desktop top-level dropdown toggles (.first-nav-button).
 */
function syncDesktopDropdownButtonStates() {
  const { container, dropdownButtonSelector } = CONFIG.desktop;

  document.querySelectorAll(`${container} ${dropdownButtonSelector}`).forEach(button => {
    const isOpen = button.classList.contains('show');
    updateButtonState(button, isOpen, false, false);
  });
}

function initDesktopNavigation() {
  const desktopRoot = CONFIG.desktop.container;

  document.addEventListener('show.bs.dropdown', (event) => {
    if (!event.target.closest(desktopRoot)) return;
    syncDesktopNavOverlay();
  });

  document.addEventListener('shown.bs.dropdown', (event) => {
    if (!event.target.closest(desktopRoot)) return;
    scrollToCurrentElement(CONFIG.desktop.container);
    syncDesktopNavOverlay();
    syncDesktopDropdownButtonStates();
  });

  document.addEventListener('hide.bs.dropdown', (event) => {
    if (!event.target.closest(desktopRoot)) return;
    if (isDropdownNavLinkClick(event.clickEvent)) return;
    syncDesktopNavOverlay();
  });

  document.addEventListener('hidden.bs.dropdown', (event) => {
    if (!event.target.closest(desktopRoot)) return;
    if (isDropdownNavLinkClick(event.clickEvent)) return;
    syncDesktopNavOverlay();
    syncDesktopDropdownButtonStates();
  });

  registerClickHandler(`${CONFIG.desktop.container} ${CONFIG.desktop.buttonSelector}`);
  registerCollapseHandlers(CONFIG.desktop, false);

  setTimeout(() => {
    openCurrentPageParents(CONFIG.desktop.parentMenuSelector, closeButtonMessage);
    syncAllButtonStates(CONFIG.desktop.container, CONFIG.desktop.buttonSelector, null, false);
    syncDesktopDropdownButtonStates();
  }, 100);
}

function initMobileNavigation() {
  const body = document.body;
  const headerWrapper = document.querySelector('.header-wrapper');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarTogglerText = document.querySelector('.navbar-toggler span.txt > .visually-hidden');
  const dropdown = document.getElementById('main-menu');

  if (!dropdown) return;

  handleDropdownVisibility(
    dropdown,
    () => {
      toggleNavState(true, body, headerWrapper, navbarToggler, navbarTogglerText,
                     openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage);
      scrollToCurrentElement(CONFIG.mobile.container);
    },
    (event) => {
      if (isDropdownNavLinkClick(event.clickEvent)) return;
      toggleNavState(false, body, headerWrapper, navbarToggler, navbarTogglerText,
                     openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage);
    }
  );

  document.querySelectorAll('.main-menu-desktop .btn-close').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('.first-nav-button.show')?.click();
    });
  });

  document.querySelectorAll('.subnav-children .hassub').forEach(subButton => {
    subButton.addEventListener('click', () => {
      closeOtherSubmenus(subButton, '.subnav-children .hassub', '.subnav-children');
    });
  });

  registerClickHandler(`${CONFIG.mobile.container} ${CONFIG.mobile.buttonSelector}`, true);
  registerCollapseHandlers(CONFIG.mobile, true);

  setTimeout(() => {
    openCurrentPageParents(CONFIG.mobile.parentMenuSelector, closeButtonMessage);
    syncAllButtonStates(CONFIG.mobile.container, CONFIG.mobile.buttonSelector, null, true);
  }, 100);
}

function closeMobileMenus() {
  const mainMenu = document.getElementById('main-menu');
  const navbarToggler = document.querySelector('.navbar-toggler');
  
  if (mainMenu?.classList.contains('show') && navbarToggler) {
    navbarToggler.click();
  }
  
  document.querySelectorAll(`${CONFIG.mobile.container} .collapse.show`).forEach(menu => {
    const button = document.querySelector(`[data-bs-target="#${menu.id}"]`);
    if (button && !button.classList.contains('collapsed')) {
      button.click();
    }
  });
}

function closeDesktopMenus() {
  document.querySelectorAll('.first-nav-button.show, .mainnav-desktop .dropdown-toggle.show').forEach(button => {
    button.click();
  });
  
  document.querySelectorAll(`${CONFIG.desktop.container} .collapse.show`).forEach(menu => {
    const button = document.querySelector(`[data-bs-target="#${menu.id}"]`);
    if (button && !button.classList.contains('collapsed')) {
      button.click();
    }
  });
}

function initResponsiveBehavior() {
  const mediaQuery = window.matchMedia(CONFIG.breakpoint);
  const body = document.body;
  const headerWrapper = document.querySelector('.header-wrapper');

  const handleBreakpointChange = (event) => {
    if (!event) return;
    
    if (event.matches) {
      closeMobileMenus();
    } else {
      closeDesktopMenus();
    }

    body.classList.remove('active-nav-body');
    headerWrapper?.classList.remove('active-nav');
  };

  mediaQuery.addEventListener('change', handleBreakpointChange);
}

function init() {
  if (document.querySelector('.mainnav-desktop')) {
    initDesktopNavigation();
  }

  if (document.getElementById('main-menu')) {
    initMobileNavigation();
  }

  initResponsiveBehavior();
}

init();
