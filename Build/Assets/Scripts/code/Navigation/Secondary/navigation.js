/**
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
  openCurrentPageParents,
  scrollToCurrentElement
} from '../../Utils/domUtils.js';

const CONFIG = {
  desktop: {
    container: '#nav-desktop',
    buttonSelector: '.first-nav-btn',
    collapseButtonSelector: '[data-bs-toggle="collapse"]',
    subnavButtonSelector: '.subnav-children .hassub',
    subnavMenuSelector: '.subnav-children'
  },
  mobile: {
    container: '#main-menu',
    menuButton: '#main-menu-button',
    solrButton: '#solr-button',
    dropdownSelector: '#main-menu .dropdown-menu',
    collapseButtonSelector: '[data-bs-toggle="collapse"]',
    menuSelector: '.collapse'
  },
  breakpoint: '(min-width: 62rem)'
};

const headerWrapper = document.querySelector('.header-wrapper');
const navDesktop = document.getElementById('nav-desktop');

/**
 * @param {HTMLElement} button
 * @param {boolean} isOpen
 */
function updateButtonState(button, isOpen) {
  if (!button) return;

  button.setAttribute('title', isOpen ? closeButtonMessage : openButtonMessage);
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  button.classList.toggle('collapsed', !isOpen);
}

/**
 * @param {string} containerSelector
 * @param {string} buttonSelector
 * @param {HTMLElement|null} excludeButton
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
 * @param {Event} event
 * @returns {HTMLElement|null}
 */
function getTriggerButton(event) {
  const targetId = event.target.id;
  return document.querySelector(`[data-bs-target="#${targetId}"]`);
}

function updateDesktopButtonTitles() {
  document.querySelectorAll(CONFIG.desktop.buttonSelector).forEach(button => {
    const isOpen = button.classList.contains('show');
    button.setAttribute('title', isOpen ? closeButtonMessage : openButtonMessage);
  });
}

function syncActiveNavClasses() {
  if (!headerWrapper) return;

  const root = navDesktop ?? document;
  const hasOpenDropdown = !!root.querySelector('.dropdown.show, .dropdown-menu.show');

  document.body.classList.toggle('active-nav-body', hasOpenDropdown);
  headerWrapper.classList.toggle('active-nav', hasOpenDropdown);
}

function initDesktopNavigation() {
  document.addEventListener('shown.bs.dropdown', (event) => {
    if (!event.target.closest(CONFIG.desktop.container)) return;
    syncActiveNavClasses();
    updateDesktopButtonTitles();
    scrollToCurrentElement(CONFIG.desktop.container);
  });

  document.addEventListener('hidden.bs.dropdown', (event) => {
    if (!event.target.closest(CONFIG.desktop.container)) return;
    syncActiveNavClasses();
    updateDesktopButtonTitles();
  });

  document.querySelectorAll('.main-menu-desktop .btn-close').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector(`${CONFIG.desktop.buttonSelector}.show`)?.click();
    });
  });

  document.querySelectorAll(CONFIG.desktop.subnavButtonSelector).forEach(subButton => {
    subButton.addEventListener('click', () => {
      closeOtherSubmenus(subButton, CONFIG.desktop.subnavButtonSelector, CONFIG.desktop.subnavMenuSelector);
    });
  });

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

  setTimeout(() => {
    openCurrentPageParents(CONFIG.desktop.subnavMenuSelector, closeButtonMessage);
    syncAllButtonStates(CONFIG.desktop.container, CONFIG.desktop.collapseButtonSelector);
  }, 100);
}

/**
 * @param {HTMLElement} button
 * @param {boolean} isOpen
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
 * @param {Event} event
 * @param {boolean} isOpening
 */
function handleMobileDropdown(event, isOpening) {
  const button = event.target.closest(`${CONFIG.mobile.menuButton}, ${CONFIG.mobile.solrButton}`);
  if (!button) return;

  setTimeout(() => {
    if (isOpening) {
      document.body.classList.add('active-nav-body');
      scrollToCurrentElement(CONFIG.mobile.container);
    } else {
      const anyOpen = document.querySelector(`${CONFIG.mobile.dropdownSelector}.show`);
      if (!anyOpen) {
        document.body.classList.remove('active-nav-body');
      }
    }
    updateMobileMenuButton(button, isOpening);
  }, 0);
}

function initMobileNavigation() {
  document.addEventListener('show.bs.dropdown', (event) => handleMobileDropdown(event, true));
  document.addEventListener('hide.bs.dropdown', (event) => handleMobileDropdown(event, false));

  document.addEventListener('click', (event) => {
    const button = event.target.closest(`${CONFIG.mobile.container} ${CONFIG.mobile.collapseButtonSelector}`);
    if (!button) return;

    const isCurrentlyCollapsed = button.classList.contains('collapsed');
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

  setTimeout(() => {
    openCurrentPageParents(CONFIG.mobile.menuSelector, closeButtonMessage);
    syncAllButtonStates(CONFIG.mobile.container, CONFIG.mobile.collapseButtonSelector);
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
  document.querySelectorAll('.first-nav-button.show, .first-nav-btn.show, #nav-desktop .dropdown-toggle.show').forEach(button => {
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
  if (navDesktop) {
    initDesktopNavigation();
  }

  if (document.getElementById('main-menu')) {
    initMobileNavigation();
  }

  initResponsiveBehavior();
}

init();
