import BaseComponent from 'bootstrap/js/dist/base-component.js'
import EventHandler from 'bootstrap/js/dist/dom/event-handler.js'
import { debounce } from './Utils/domUtils.js'

const NAME = 'modalGallery'

const Default = {} as const

type ModalGalleryConfig = Record<string, never>

class ModalGallery extends BaseComponent {
  static NAME = NAME

  static get Default() {
    return Default
  }

  protected declare _config: ModalGalleryConfig

  constructor(element: HTMLElement, config?: Partial<ModalGalleryConfig>) {
    super(element, config)
    this._updateImageSizes()
    EventHandler.on(window, 'resize', debounce(() => this._updateImageSizes(), 100))
  }

  protected _updateImageSizes(): void {
    const maxHeight = window.innerHeight * 0.75

    this._element.querySelectorAll('.carousel-item img, .dialog-body img').forEach(img => {
      if (img instanceof HTMLElement) {
        img.style.maxHeight = `${maxHeight}px`
        img.style.width = 'auto'
      }
    })
  }
}

if (document.querySelector('.dialog-body')) {
  document.querySelectorAll('.dialog-body').forEach(dialogBody => {
    if (dialogBody instanceof HTMLElement) {
      ModalGallery.getOrCreateInstance(dialogBody)
    }
  })
}

export default ModalGallery
