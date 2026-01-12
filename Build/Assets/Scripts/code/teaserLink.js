/**
 * Teaser Link Module
 * Adds visual feedback to teaser cards on hover/focus
 */

const teaserLinks = document.querySelectorAll('.teaser-link');

/**
 * Toggles the active class on the parent teaser element
 * @param {Event} event - The triggering event
 * @param {boolean} isActive - Whether to add or remove the active class
 */
function toggleTeaserClass(event, isActive) {
  const teaser = event.target.closest('.teaser');
  teaser?.classList.toggle('teaser-active', isActive);
}

// Attach event listeners using event delegation pattern
teaserLinks.forEach(element => {
  element.addEventListener('mouseover', e => toggleTeaserClass(e, true));
  element.addEventListener('mouseout', e => toggleTeaserClass(e, false));
  element.addEventListener('focusin', e => toggleTeaserClass(e, true));
  element.addEventListener('focusout', e => toggleTeaserClass(e, false));
});
