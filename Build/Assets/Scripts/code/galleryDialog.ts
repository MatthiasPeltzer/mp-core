/**
 * Gallery fullscreen dialog: slide index on open + Bootstrap data-API click targets.
 * BS6 delegates data-api clicks only when the event target is the control element
 * (not a child), so footer/header controls rely on pointer-events (see _modal.scss).
 */
import Carousel from 'bootstrap/js/dist/carousel.js'
import EventHandler from 'bootstrap/js/dist/dom/event-handler.js'

const GALLERY_MODAL_SELECTOR = 'dialog.dialog[id^="galleryModal-"]'

function resolveSlideIndex(trigger: HTMLElement): number | null {
  const slideHost =
    trigger.querySelector<HTMLElement>('[data-bs-slide-to]')
    ?? trigger.closest<HTMLElement>('[data-count]')

  if (!slideHost) {
    return null
  }

  const raw =
    slideHost.getAttribute('data-bs-slide-to')
    ?? slideHost.getAttribute('data-count')

  if (raw === null || raw === '') {
    return null
  }

  const index = Number.parseInt(raw, 10)
  return Number.isNaN(index) ? null : index
}

function updateGalleryCounter(dialog: HTMLElement, carouselEl: HTMLElement): void {
  const counter = dialog.querySelector<HTMLElement>('[data-gallery-counter]')
  if (!counter) {
    return
  }

  const items = carouselEl.querySelectorAll('.carousel-item')
  const active = carouselEl.querySelector('.carousel-item.active')
  const index = active ? Array.from(items).indexOf(active) + 1 : 1
  const total = items.length
  const ofLabel = counter.dataset.galleryLabelOf ?? 'of'

  counter.textContent = `${index} ${ofLabel} ${total}`
  counter.dataset.galleryCounter = String(index)
}

function bindGalleryDialog(dialog: HTMLElement): void {
  if (dialog.dataset.mpcGalleryDialogBound === '1') {
    return
  }
  dialog.dataset.mpcGalleryDialogBound = '1'

  const carouselEl = dialog.querySelector<HTMLElement>('.carousel')
  if (!carouselEl) {
    return
  }

  EventHandler.on(dialog, 'shown.bs.dialog', (event: Event) => {
    const relatedTarget = (event as Event & { relatedTarget?: EventTarget | null }).relatedTarget
    if (!(relatedTarget instanceof HTMLElement)) {
      return
    }

    const carousel = Carousel.getOrCreateInstance(carouselEl)
    const index = resolveSlideIndex(relatedTarget)
    if (index !== null) {
      carousel.to(index)
    }
    updateGalleryCounter(dialog, carouselEl)
  })

  EventHandler.on(carouselEl, 'slid.bs.carousel', () => {
    updateGalleryCounter(dialog, carouselEl)
  })
}

function initGalleryDialogs(): void {
  document.querySelectorAll(GALLERY_MODAL_SELECTOR).forEach((dialog) => {
    if (dialog instanceof HTMLElement) {
      bindGalleryDialog(dialog)
    }
  })
}

if (document.querySelector(GALLERY_MODAL_SELECTOR)) {
  initGalleryDialogs()
}

export { initGalleryDialogs, resolveSlideIndex, updateGalleryCounter }
