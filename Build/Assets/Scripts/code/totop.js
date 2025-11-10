const totop = document.querySelector('.totop');
const bg = document.querySelector('.bg');

let ticking = false;

// Function to handle scroll events
function handleScroll() {
  if (!totop || !bg) return;
  const docHeight = document.body.offsetHeight;
  const winHeight = window.innerHeight;
  const maxScrollHeight = docHeight - winHeight;
  const scrollTop = window.scrollY;
  const scrollPercent = maxScrollHeight > 0 ? scrollTop / maxScrollHeight : 0;
  const degrees = scrollPercent * 360;

  // Update background only when necessary
  bg.style.background = `#fff conic-gradient(var(--bs-primary) ${degrees}deg, #fff ${degrees}deg) center center / 60px`;

  // Toggle 'on' class based on scroll position
  totop.classList.toggle('on', scrollTop > 250);
}

// Use requestAnimationFrame for smoother UI
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
}, {passive: true});
