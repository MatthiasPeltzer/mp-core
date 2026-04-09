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
    try {
      const url = new URL(popupLink.getAttribute('href'), document.baseURI);
      if (url.protocol === 'https:' || url.protocol === 'http:') {
        window.open(url.href, '', 'width=600,height=600,noopener');
      }
    } catch { /* invalid URL — ignore */ }
    return;
  }

  const printButton = e.target.closest('.js-print');
  if (printButton) {
    e.preventDefault();
    window.print();
  }
});

// =============================================================================
// REDUCED MOTION: PAUSE AUTOPLAY VIDEOS
// =============================================================================

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video[autoplay]').forEach((video) => {
    video.removeAttribute('autoplay');
    video.pause();
  });
}

// =============================================================================
// AUTO-FOCUS FUNCTIONALITY
// =============================================================================

// Focus on first invalid input for better form UX
document.querySelector('.is-invalid')?.focus();

// Focus on search box if present
document.getElementById('tx-indexedsearch-searchbox-sword')?.focus();
