// Cache the HTML element
const htmlElement = document.querySelector('html');

// Remove no-js class and add js class to the HTML element
htmlElement.classList.replace('no-js', 'js');

// Handle popup window functionality using event delegation
document.addEventListener('click', (e) => {
  const el = e.target.closest('.popup-window');
  if (el) {
    e.preventDefault();
    window.open(el.getAttribute('href'), '', 'width=600,height=600');
  }
});

// Focus on the first invalid input element, if it exists
const invalidElement = document.querySelector('.is-invalid');
if (invalidElement) {
  invalidElement.focus();
}

// Check whether the search box exists and set the focus to the search field
const searchBox = document.getElementById('tx-indexedsearch-searchbox-sword');
if (searchBox) {
  searchBox.focus();
}
