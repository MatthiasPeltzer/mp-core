import {debounce} from './Utils/domUtils.js';

function modalGallery() {
  const carouselItems = document.querySelectorAll('.carousel-item img, .modal-body img');

  function updateImageSizes() {
    const windowHeight = window.innerHeight * 0.75;
    carouselItems.forEach(img => {
      img.style.maxHeight = `${windowHeight}px`;
      img.style.width = 'auto';
    });
  }

  // debounce is now imported from utils

  // Set initial sizes
  updateImageSizes();

  // Update sizes on window resize with debounce
  window.addEventListener('resize', debounce(updateImageSizes, 100));
}

// Initialize modalGallery if modal-content is present
if (document.querySelector('.modal-content')) {
  modalGallery();
}
