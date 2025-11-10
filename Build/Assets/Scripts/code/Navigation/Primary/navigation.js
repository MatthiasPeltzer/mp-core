import {
  closeButtonMessage,
  closeNavMessage,
  closeTitleMessage,
  openButtonMessage,
  openNavMessage,
  openTitleMessage
} from './../../i18n.js';
import {toggleNavState, closeOtherSubmenus, openCurrentPageParents} from '../../Utils/domUtils.js';

function mainnav() {
  const dropdown = document.getElementById('main-menu');
  const body = document.body;
  const headerWrapper = document.querySelector('.header-wrapper');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarTogglerText = document.querySelector('.navbar-toggler span.txt > .visually-hidden');

  // Use shared helper to update nav state and text
  const updateNavState = (isOpen) => toggleNavState(isOpen, body, headerWrapper, navbarToggler, navbarTogglerText, openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage);

  dropdown.addEventListener('show.bs.dropdown', () => updateNavState(true));
  dropdown.addEventListener('hide.bs.dropdown', () => updateNavState(false));

  // Function to update button text, title and aria-expanded
  const updateButtonState = (button, isOpen) => {
    const buttonText = button.querySelector('.visually-hidden');
    if (buttonText) {
      buttonText.textContent = isOpen ? closeButtonMessage : openButtonMessage;
    }
    button.setAttribute('title', isOpen ? closeButtonMessage : openButtonMessage);
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    
    if (isOpen) {
      button.classList.remove('collapsed');
    } else {
      button.classList.add('collapsed');
    }
  };

  // Handle Bootstrap collapse show events
  document.addEventListener('show.bs.collapse', (event) => {
    // Only handle events within our main menu
    if (!event.target.closest('#main-menu')) return;
    
    const targetId = event.target.id;
    const triggerButton = document.querySelector(`[data-bs-target="#${targetId}"]`);
    
    if (triggerButton) {
      // Close other submenus first
      closeOtherSubmenus(triggerButton);
      // Update this button to show it's opening
      updateButtonState(triggerButton, true);
    }
  });

  // Handle Bootstrap collapse hide events
  document.addEventListener('hide.bs.collapse', (event) => {
    // Only handle events within our main menu
    if (!event.target.closest('#main-menu')) return;
    
    const targetId = event.target.id;
    const triggerButton = document.querySelector(`[data-bs-target="#${targetId}"]`);
    
    if (triggerButton) {
      // Update button to show it's closed
      updateButtonState(triggerButton, false);
    }
  });

  // Handle Bootstrap collapse shown events (after animation completes)
  document.addEventListener('shown.bs.collapse', (event) => {
    // Only handle events within our main menu
    if (!event.target.closest('#main-menu')) return;
    
    const targetId = event.target.id;
    const triggerButton = document.querySelector(`[data-bs-target="#${targetId}"]`);
    
    if (triggerButton) {
      // Ensure the state is correct after animation
      updateButtonState(triggerButton, true);
    }
  });

  // Handle Bootstrap collapse hidden events (after animation completes)
  document.addEventListener('hidden.bs.collapse', (event) => {
    // Only handle events within our main menu
    if (!event.target.closest('#main-menu')) return;
    
    const targetId = event.target.id;
    const triggerButton = document.querySelector(`[data-bs-target="#${targetId}"]`);
    
    if (triggerButton) {
      // Ensure the state is correct after animation
      updateButtonState(triggerButton, false);
    }
  });

  // Initialize: Open parent submenus for current page
  // Use setTimeout to ensure DOM is fully loaded
  setTimeout(() => {
    openCurrentPageParents('.collapse', closeButtonMessage);
    
    // Update all buttons to have correct initial state
    document.querySelectorAll('.btn-open').forEach(button => {
      const targetMenuId = button.getAttribute('data-bs-target');
      const targetMenu = document.querySelector(targetMenuId);
      const isOpen = targetMenu && targetMenu.classList.contains('show');
      updateButtonState(button, isOpen);
    });
  }, 100);
}

// Initialize the navigation if the menu exists
if (document.querySelector('#main-menu')) {
  mainnav();
}
