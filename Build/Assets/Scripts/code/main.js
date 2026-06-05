document.addEventListener('click', (e) => {
  const popupLink = e.target.closest('.popup-window');
  if (popupLink) {
    e.preventDefault();
    try {
      const url = new URL(popupLink.getAttribute('href'), document.baseURI);
      if (url.protocol === 'https:' || url.protocol === 'http:') {
        window.open(url.href, '', 'width=600,height=600,noopener,noreferrer');
      }
    } catch { /* invalid URL — ignore */ }
    return;
  }

  const printButton = e.target.closest('.js-print');
  if (printButton) {
    e.preventDefault();
    window.print();
  }
});

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video[autoplay]').forEach((video) => {
    video.removeAttribute('autoplay');
    video.pause();
  });
}

document.querySelector('.is-invalid')?.focus();
document.getElementById('tx-indexedsearch-searchbox-sword')?.focus();
