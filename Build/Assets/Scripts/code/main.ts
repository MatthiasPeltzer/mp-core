import { asHTMLElement } from './Utils/domTypes.js'

document.addEventListener('click', (e) => {
  const target = e.target
  if (!(target instanceof Element)) return

  const popupLink = target.closest('.popup-window')
  if (popupLink instanceof HTMLAnchorElement) {
    e.preventDefault()
    try {
      const url = new URL(popupLink.getAttribute('href') ?? '', document.baseURI)
      if (url.protocol === 'https:' || url.protocol === 'http:') {
        window.open(url.href, '', 'width=600,height=600,noopener,noreferrer')
      }
    } catch { /* invalid URL — ignore */ }
    return
  }

  const printButton = target.closest('.js-print')
  if (printButton) {
    e.preventDefault()
    window.print()
  }
})

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video[autoplay]').forEach((video) => {
    if (video instanceof HTMLVideoElement) {
      video.removeAttribute('autoplay')
      video.pause()
    }
  })
}

asHTMLElement(document.querySelector('.is-invalid'))?.focus()
document.getElementById('tx-indexedsearch-searchbox-sword')?.focus()
