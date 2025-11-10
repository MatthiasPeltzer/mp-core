import {closeButtonMessage, openButtonMessage,} from './../../i18n.js';
import {closeOtherSubmenus, openCurrentPageParents} from '../../Utils/domUtils.js';

const headerWrapper = document.querySelector('.header-wrapper');
const navDesktop = document.getElementById('nav-desktop');

// Function to update titles based on status
function updateTitles() {
  document.querySelectorAll('.first-nav-btn').forEach(button => {
    const isOpen = button.classList.contains('show');
    const newLabel = isOpen ? closeButtonMessage : openButtonMessage;
    button.setAttribute('title', newLabel);
  });
}

// Sync the "active" classes with the current dropdown state. This avoids the
// remove-then-add cycle that previously caused a visible flicker.
function syncActiveNavClasses() {
  if (!headerWrapper) return;

  // A dropdown is considered open when either the parent `.dropdown` or the
  // `.dropdown-menu` carries the `.show` class. We query within #nav-desktop if
  // it exists, otherwise fall back to the whole document (defensive for cases
  // where the element might not be present yet).
  const root = navDesktop ?? document;
  const hasOpenDropdown = !!root.querySelector('.dropdown.show, .dropdown-menu.show');

  document.body.classList.toggle('active-nav-body', hasOpenDropdown);
  headerWrapper.classList.toggle('active-nav', hasOpenDropdown);
}

document.addEventListener('shown.bs.dropdown', (event) => {
  if (event.target.closest('#nav-desktop')) {
    syncActiveNavClasses();
    updateTitles();
  }
});

// Event listener for closing a dropdown
document.addEventListener('hidden.bs.dropdown', (event) => {
  if (event.target.closest('#nav-desktop')) {
    syncActiveNavClasses();
    updateTitles();
  }
});

document.querySelectorAll('.main-menu-desktop .btn-close').forEach(button => {
  button.addEventListener('click', () => document.querySelector('.first-nav-btn.show')?.click());
});

// Close all open nested sub-navigation collapses when a submenu item is (re)clicked
// This ensures that when a user selects a deeper level, any previously opened
// sub-navigation levels are closed, preventing multiple menus from staying open.
document.querySelectorAll('.subnav-children .hassub').forEach(subButton => {
  subButton.addEventListener('click', () => {
    closeOtherSubmenus(subButton, '.subnav-children .hassub', '.subnav-children');
  });
});

// Initialize: Open parent submenus for current page
setTimeout(() => {
  openCurrentPageParents('.subnav-children', closeButtonMessage);
}, 100);
