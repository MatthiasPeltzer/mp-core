const body = document.querySelector('body');
const header = document.querySelector('.header-wrapper-bg');
let headerHeight = header.offsetHeight;

// Add sticky class on scroll based on header height
window.addEventListener('scroll', () => {
  const scrollSticky = window.scrollY;
  if (scrollSticky > headerHeight) {
    body.classList.add('sticky');
  } else {
    body.classList.remove('sticky');
  }
});

// Function to update body padding based on header height and screen width
function updatePadding() {
  headerHeight = header.offsetHeight;
  body.style.paddingTop = headerHeight / 16 + 'rem';
}

// Handle resize and media queries
function resizePadding() {
  const mediaQuery = window.matchMedia('(min-width: 62rem)');

  // Listener to update padding on media query change
  function mediaQueryListener() {
    setTimeout(updatePadding, 50); // Debounce the padding update slightly
  }

  // Initial call and listener attachment
  mediaQueryListener(); // On load
  mediaQuery.addEventListener('change', mediaQueryListener); // On change
}

// Call on page load
resizePadding();

