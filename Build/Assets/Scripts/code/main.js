/**
 * Main JavaScript Entry Point
 * Core functionality and global event handlers
 */

// =============================================================================
// INITIALIZATION
// =============================================================================

// Replace no-js class with js class for CSS hooks
document.documentElement.classList.replace('no-js', 'js');

// =============================================================================
// GLOBAL EVENT HANDLERS
// =============================================================================

/**
 * Handle popup window links
 * Opens links with .popup-window class in a new popup window
 */
document.addEventListener('click', (e) => {
  const popupLink = e.target.closest('.popup-window');
  if (popupLink) {
    e.preventDefault();
    window.open(popupLink.getAttribute('href'), '', 'width=600,height=600');
  }
});

/**
 * Handle print button clicks
 * Triggers print dialog when .js-print elements are clicked
 */
document.addEventListener('click', (e) => {
  const printButton = e.target.closest('.js-print');
  if (printButton) {
    e.preventDefault();
    window.print();
  }
});

// =============================================================================
// AUTO-FOCUS FUNCTIONALITY
// =============================================================================

// Focus on first invalid input for better form UX
document.querySelector('.is-invalid')?.focus();

// Focus on search box if present
document.getElementById('tx-indexedsearch-searchbox-sword')?.focus();
