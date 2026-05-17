import { debounce } from './Utils/domUtils.js';

function updateImageSizes() {
  const maxHeight = window.innerHeight * 0.75;
  
  document.querySelectorAll('.carousel-item img, .modal-body img').forEach(img => {
    img.style.maxHeight = `${maxHeight}px`;
    img.style.width = 'auto';
  });
}

if (document.querySelector('.modal-content')) {
  updateImageSizes();
  window.addEventListener('resize', debounce(updateImageSizes, 100));
}
