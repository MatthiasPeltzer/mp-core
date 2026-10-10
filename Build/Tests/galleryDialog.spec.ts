import { describe, expect, it } from 'vitest'
import { resolveSlideIndex, updateGalleryCounter } from '../Assets/Scripts/code/galleryDialog.js'

describe('galleryDialog', () => {
  it('resolveSlideIndex reads data-bs-slide-to on nested picture host', () => {
    document.body.innerHTML = `
      <a class="popup" href="#galleryModal-1">
        <picture data-bs-slide-to="4" data-bs-target="#galleryCarousel-1"></picture>
      </a>
    `
    const trigger = document.querySelector('a.popup') as HTMLElement
    expect(resolveSlideIndex(trigger)).toBe(4)
  })

  it('updateGalleryCounter writes footer text from active slide', () => {
    document.body.innerHTML = `
      <dialog id="galleryModal-1">
        <div class="carousel">
          <div class="carousel-item"></div>
          <div class="carousel-item active"></div>
        </div>
        <p data-gallery-counter="1" data-gallery-label-of="von"></p>
      </dialog>
    `
    const dialog = document.querySelector('dialog') as HTMLElement
    const carousel = dialog.querySelector('.carousel') as HTMLElement
    updateGalleryCounter(dialog, carousel)
    const counter = dialog.querySelector('[data-gallery-counter]')
    expect(counter?.textContent).toBe('2 von 2')
  })
})
