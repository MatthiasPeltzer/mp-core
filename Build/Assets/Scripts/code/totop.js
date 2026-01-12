/**
 * To-Top Button Module
 * Scroll progress indicator and back-to-top functionality
 * Shows a circular progress indicator based on scroll position
 */

const totop = document.querySelector('.totop');
const bg = document.querySelector('.totop .bg');

if (totop && bg) {
  let ticking = false;

  /**
   * Updates the progress indicator and visibility
   */
  function handleScroll() {
    const docHeight = document.body.offsetHeight;
    const winHeight = window.innerHeight;
    const maxScrollHeight = docHeight - winHeight;
    const scrollTop = window.scrollY;
    
    // Calculate scroll percentage and convert to degrees
    const scrollPercent = maxScrollHeight > 0 ? scrollTop / maxScrollHeight : 0;
    const degrees = scrollPercent * 360;

    // Update conic gradient for circular progress
    bg.style.background = `#fff conic-gradient(var(--bs-primary) ${degrees}deg, #fff ${degrees}deg) center center / 60px`;

    // Toggle visibility based on scroll position
    totop.classList.toggle('on', scrollTop > 250);
  }

  // Use requestAnimationFrame for smooth performance
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
