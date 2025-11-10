// Import translated messages for nav button labels
import {closeNavMessage, closeTitleMessage, openNavMessage, openTitleMessage} from './../../i18n.js';

// Helper to update the button label/text and title for the button that triggered the dropdown
function updateButton(button, isOpen) {
  if (!button) {
    return;
  }

  // Only #main-menu-button's text/title should toggle
  if (button.id === 'main-menu-button') {
    // Mobile navigation burger => visually-hidden text inside .txt element
    const textElement = button.querySelector('.txt > .visually-hidden');
    if (textElement) {
      textElement.textContent = isOpen ? closeNavMessage : openNavMessage;
    }

    // Update title attribute for accessibility
    button.setAttribute('title', isOpen ? closeTitleMessage : openTitleMessage);
  }
}

// Add / remove the body helper class
function addActiveNavBody() {
  document.body.classList.add('active-nav-body');
}

function removeActiveNavBody() {
  document.body.classList.remove('active-nav-body');
}

// Central handler for dropdown show/hide events within the mobile main menu layer
function handleDropdown(event, isOpening) {
  // Interested only in interactions coming from our two specific buttons
  const button = event.target.closest('#main-menu-button, #solr-button');
  if (!button) {
    return;
  }

  setTimeout(() => {
    if (isOpening) {
      addActiveNavBody();
    } else {
      // Only remove the body class if *no* dropdown inside #main-menu is still open
      const anyOpen = document.querySelector('#main-menu .dropdown-menu.show');
      if (!anyOpen) {
        removeActiveNavBody();
      }
    }

    updateButton(button, isOpening);
  }, 0);
}

// Bootstrap dropdown events
document.addEventListener('show.bs.dropdown', (event) => handleDropdown(event, true));
document.addEventListener('hide.bs.dropdown', (event) => handleDropdown(event, false));
