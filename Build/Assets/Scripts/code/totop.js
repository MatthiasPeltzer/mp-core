const totop = document.querySelector('.totop');
const bg = document.querySelector('.totop .bg');

if (totop && bg) {
  let ticking = false;

  function handleScroll() {
    const docHeight = document.body.offsetHeight;
    const winHeight = window.innerHeight;
    const maxScrollHeight = docHeight - winHeight;
    const scrollTop = window.scrollY;
    
    const scrollPercent = maxScrollHeight > 0 ? scrollTop / maxScrollHeight : 0;
    const degrees = scrollPercent * 360;

    bg.style.background = `#fff conic-gradient(var(--bs-primary) ${degrees}deg, #fff ${degrees}deg) center center / 60px`;
    totop.classList.toggle('on', scrollTop > 250);
  }

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
