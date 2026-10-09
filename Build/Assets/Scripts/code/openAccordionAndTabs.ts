import { asHTMLElement, eventTargetElement } from './Utils/domTypes.js'

const SELECTORS = {
  accordion: (id: string) => `[data-bs-target="#accordion-${id}"]`,
  tabs: (id: string) => `[data-bs-target="#tab-content-${id}"]`,
  scrollList: '.list-scroll',
  scrollLink: 'li a',
} as const

type HashTargetType = 'accordion' | 'tabs'

function openElement(hash: string, type: HashTargetType): void {
  if (!hash) {
    return
  }

  const idParts = hash.split('#c')
  if (idParts.length < 2) {
    return
  }

  const id = idParts[1]
  const selector = type === 'accordion' ? SELECTORS.accordion(id) : SELECTORS.tabs(id)

  const trigger = asHTMLElement(document.querySelector(selector))
  if (trigger) {
    trigger.click()
    trigger.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    trigger.focus()
  }
}

function initOnLoad(type: HashTargetType): void {
  if (window.location.hash) {
    openElement(window.location.hash, type)
  }
}

function initOnClick(type: HashTargetType): void {
  const container = document.querySelector(SELECTORS.scrollList)
  if (!container) {
    return
  }

  container.addEventListener('click', (event) => {
    const link = eventTargetElement(event)?.closest(SELECTORS.scrollLink)
    if (!(link instanceof HTMLAnchorElement)) {
      return
    }
    event.preventDefault()
    openElement(link.hash, type)
  })
}

function init(): void {
  if (document.querySelector('.accordion')) {
    initOnLoad('accordion')
    initOnClick('accordion')
  }

  if (document.querySelector('.nav-tabs')) {
    initOnLoad('tabs')
    initOnClick('tabs')
  }
}

window.addEventListener('load', init)
