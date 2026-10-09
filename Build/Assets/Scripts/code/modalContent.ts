import BaseComponent from 'bootstrap/js/dist/base-component.js'
import EventHandler from 'bootstrap/js/dist/dom/event-handler.js'
import { notifyDynamicContentReady, pausePlayersInside } from './vidply-dynamic-content.js'

const NAME = 'modalContent'

const Default = {} as const

type ModalContentConfig = Record<string, never>

class ModalContent extends BaseComponent {
  static NAME = NAME

  static get Default() {
    return Default
  }

  protected declare _config: ModalContentConfig

  constructor(element: HTMLElement, config?: Partial<ModalContentConfig>) {
    super(element, config)
    if (element.dataset.mpcModalBound === '1') {
      return
    }
    element.dataset.mpcModalBound = '1'

    EventHandler.on(element, 'shown.bs.dialog', () => {
      const root = element.querySelector('[data-modal-content-root]')
      notifyDynamicContentReady(root)
    })

    EventHandler.on(element, 'hide.bs.dialog', () => {
      const root = element.querySelector('[data-modal-content-root]')
        ?? element.querySelector('.dialog-body')
      pausePlayersInside(root)
    })
  }
}

export function initModalContent(): void {
  document.querySelectorAll('.dialog[data-bs-backdrop]').forEach((dialog) => {
    if (dialog instanceof HTMLElement) {
      ModalContent.getOrCreateInstance(dialog)
    }
  })
}

if (document.querySelector('[data-modal-content-root]')) {
  initModalContent()
}

export default ModalContent
