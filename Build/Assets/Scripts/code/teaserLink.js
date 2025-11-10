const ElTeaserLink = document.querySelectorAll('.teaser-link');

// Function to toggle the 'teaser-active' class
function toggleTeaserClass(event, add) {
  const teaser = event.target.closest('.teaser');
  if (teaser) {
    teaser.classList.toggle('teaser-active', add);
  }
}

// Attach event listeners
ElTeaserLink.forEach(element => {
  element.addEventListener('mouseover', event => toggleTeaserClass(event, true));
  element.addEventListener('mouseout', event => toggleTeaserClass(event, false));
  element.addEventListener('focusin', event => toggleTeaserClass(event, true));
  element.addEventListener('focusout', event => toggleTeaserClass(event, false));
});

