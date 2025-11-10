import {
  closeButtonMessage,
  closeNavMessage,
  closeTitleMessage,
  openButtonMessage,
  openNavMessage,
  openTitleMessage
} from './../../i18n.js';
import {handleDropdownVisibility, toggleAriaLabelAndTitle, toggleNavState, closeOtherSubmenus, openCurrentPageParents} from '../../Utils/domUtils.js';

// helper functions are now imported from utils

function mainNavigationDesktop() {
  const body = document.body;
  const headerWrapper = document.querySelector('.header-wrapper');

  document.querySelectorAll('.mainnav-desktop-item').forEach(item => {
    handleDropdownVisibility(item,
      () => setTimeout(() => {
        body.classList.add('active-nav-body');
        headerWrapper.classList.add('active-nav');
      }, 0),
      () => {
        body.classList.remove('active-nav-body');
        headerWrapper.classList.remove('active-nav');
      }
    );
  });
}

function mainNavigationMobile() {
  const body = document.body;
  const headerWrapper = document.querySelector('.header-wrapper');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarTogglerText = document.querySelector('.navbar-toggler span.txt > .visually-hidden');
  const dropdown = document.getElementById('main-menu');

  handleDropdownVisibility(dropdown,
    () => toggleNavState(true, body, headerWrapper, navbarToggler, navbarTogglerText, openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage),
    () => toggleNavState(false, body, headerWrapper, navbarToggler, navbarTogglerText, openTitleMessage, closeTitleMessage, openNavMessage, closeNavMessage)
  );

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

  document.querySelectorAll('.main-menu-desktop .btn-close').forEach(button => {
    button.addEventListener('click', () => document.querySelector('.first-nav-button.show')?.click());
  });

  // Use the utility function for subnav-children as well
  document.querySelectorAll('.subnav-children .hassub').forEach(subButton => {
    subButton.addEventListener('click', () => {
      closeOtherSubmenus(subButton, '.subnav-children .hassub', '.subnav-children');
    });
  });

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

function resize() {
  const mediaQuery = window.matchMedia('(min-width: 62rem)');
  const body = document.body;
  const headerWrapper = document.querySelector('.header-wrapper');

  const mediaQueryListener = () => {
    const navbarToggler = document.querySelector('.navbar-toggler.show');
    const firstNavShow = document.querySelector('.first-nav.show');

    if (mediaQuery.matches) {
      navbarToggler?.click();
      firstNavShow?.click();
    } else {
      firstNavShow?.click();
      navbarToggler?.click();
    }

    body.classList.remove('active-nav-body');
    headerWrapper.classList.remove('active-nav');
  };

  mediaQuery.addEventListener('change', mediaQueryListener);
  mediaQueryListener(mediaQuery);
}

// toggleAriaLabelAndTitle is imported from utils

document.addEventListener('click', (event) => {
  if (event.target.closest('.first-nav-button, .dropdown-item-button')) {
    toggleAriaLabelAndTitle(event.target.closest('.first-nav-button, .dropdown-item-button'), openButtonMessage, closeButtonMessage);
  }
});

// Initialization
if (document.querySelector('.mainnav-desktop')) {
  mainNavigationDesktop();
}

if (document.getElementById('main-menu')) {
  mainNavigationMobile();
}

resize();
