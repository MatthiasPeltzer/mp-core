/**
 * Modal Gallery Module
 * Adjusts image sizes within modals/carousels for optimal viewing
 */

import { debounce } from './Utils/domUtils.js';

/**
 * Updates image maximum heights based on viewport
 */
function updateImageSizes() {
  const maxHeight = window.innerHeight * 0.75;
  
  document.querySelectorAll('.carousel-item img, .modal-body img').forEach(img => {
    img.style.maxHeight = `${maxHeight}px`;
    img.style.width = 'auto';
  });
}

// Initialize if modal content exists
if (document.querySelector('.modal-content')) {
  // Set initial sizes
  updateImageSizes();
  
  // Update on resize with debounce
  window.addEventListener('resize', debounce(updateImageSizes, 100));
}
