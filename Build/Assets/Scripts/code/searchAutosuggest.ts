/**
 * Accessible autosuggest for the indexed_search frontend.
 *
 * Implements the WAI-ARIA 1.2 "Editable Combobox With List Autocomplete"
 * pattern: DOM focus stays in the text input at all times, the popup is a
 * `role="listbox"`, and the active option is tracked with
 * `aria-activedescendant` (WCAG 2.1.1 Keyboard, 4.1.2 Name/Role/Value).
 *
 * Suggestions are fetched as JSON from the URL in `data-autosuggest-url`
 * (served by SearchSuggestMiddleware). Word suggestions fill the field and
 * submit the search; page suggestions navigate straight to the page.
 */

import BaseComponent from 'bootstrap/js/dist/base-component.js'
import EventHandler from 'bootstrap/js/dist/dom/event-handler.js'
import { i18n } from './i18n.js'
import { eventTargetElement } from './Utils/domTypes.js'

const NAME = 'searchAutosuggest'

const MIN_CHARS = 2
const DEBOUNCE_MS = 200

type SearchAutosuggestConfig = Record<string, never>

type SuggestOption = {
  el: HTMLElement
  query?: string
  url?: string
}

type SuggestApiItem = {
  type: string
  label: string
  query?: string
  url?: string
}

type SuggestApiResponse = {
  suggestions?: SuggestApiItem[]
}

function debounce<T extends (...args: never[]) => void>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

function safeSameOriginHref(raw: string): string | null {
  try {
    const url = new URL(raw, window.location.origin)
    return url.origin === window.location.origin ? url.href : null
  } catch {
    return null
  }
}

const SVG_NS = 'http://www.w3.org/2000/svg'

const ICON_PATHS = {
  search:
    'M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0',
  page: 'M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5zM4.5 5.5A.5.5 0 0 1 5 5h4a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0 2A.5.5 0 0 1 5 7h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0 2A.5.5 0 0 1 5 9h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5',
  chevron:
    'M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708',
} as const

type IconName = keyof typeof ICON_PATHS

function createIcon(name: IconName, extraClass: string): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 16 16')
  svg.setAttribute('width', '16')
  svg.setAttribute('height', '16')
  svg.setAttribute('fill', 'currentColor')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')
  svg.classList.add('tx-indexedsearch-suggest-glyph', extraClass)
  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('d', ICON_PATHS[name])
  svg.append(path)
  return svg
}

class SearchAutosuggest extends BaseComponent {
  static NAME = NAME

  static get Default(): SearchAutosuggestConfig {
    return {}
  }

  protected declare _config: SearchAutosuggestConfig

  private readonly input: HTMLInputElement
  private readonly endpoint: string | undefined
  private readonly pagesHeading: string
  private readonly listbox: HTMLElement | null
  private readonly form: HTMLFormElement | null
  private options: SuggestOption[] = []
  private activeIndex = -1
  private controller: AbortController | null = null
  private status!: HTMLElement
  private readonly onInput: () => void

  constructor(element: HTMLInputElement, config?: Partial<SearchAutosuggestConfig>) {
    super(element, config)

    this.input = element
    this.endpoint = element.dataset.autosuggestUrl
    this.pagesHeading = element.dataset.suggestHeader ?? ''
    const controlsId = element.getAttribute('aria-controls')
    this.listbox = controlsId ? document.getElementById(controlsId) : null
    this.form = element.closest('form')
    this.onInput = debounce(() => {
      void this.requestSuggestions()
    }, DEBOUNCE_MS)

    if (!this.endpoint || !this.listbox) {
      return
    }

    this.status = this.createStatusRegion()
    this.bind()
  }

  private createStatusRegion(): HTMLElement {
    const status = document.createElement('div')
    status.className = 'visually-hidden'
    status.setAttribute('role', 'status')
    status.setAttribute('aria-live', 'polite')
    this.listbox?.insertAdjacentElement('afterend', status)
    return status
  }

  private bind(): void {
    if (!this.listbox) {
      return
    }

    const listbox = this.listbox

    EventHandler.on(this.input, 'input', () => {
      if (this.input.value.trim().length < MIN_CHARS) {
        this.close()
        return
      }
      this.onInput()
    })

    EventHandler.on(this.input, 'keydown', (event) => {
      if (event instanceof KeyboardEvent) {
        this.onKeydown(event)
      }
    })

    EventHandler.on(listbox, 'mousedown', (event) => {
      event.preventDefault()
    })

    EventHandler.on(listbox, 'click', (event) => {
      const optionEl = eventTargetElement(event)?.closest('[role="option"]')
      if (!(optionEl instanceof HTMLElement)) {
        return
      }
      const index = this.options.findIndex((option) => option.el === optionEl)
      if (index >= 0) {
        this.selectOption(index)
      }
    })

    EventHandler.on(document, 'click', (event) => {
      const target = event.target
      if (!(target instanceof Node)) {
        return
      }
      if (!this.input.contains(target) && !listbox.contains(target)) {
        this.close()
      }
    })
  }

  private async requestSuggestions(): Promise<void> {
    if (!this.endpoint || !this.listbox) {
      return
    }

    const term = this.input.value.trim()
    if (term.length < MIN_CHARS) {
      this.close()
      return
    }

    this.controller?.abort()
    this.controller = new AbortController()

    const url = new URL(this.endpoint, window.location.origin)
    url.searchParams.set('tx_mpcore_suggest', '1')
    url.searchParams.set('q', term)

    try {
      const response = await fetch(url.href, {
        headers: { Accept: 'application/json' },
        signal: this.controller.signal,
      })
      if (!response.ok) {
        this.close()
        return
      }
      const data = (await response.json()) as SuggestApiResponse
      if (this.input.value.trim() !== term) {
        return
      }
      this.render(Array.isArray(data.suggestions) ? data.suggestions : [])
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        this.close()
      }
    }
  }

  private render(suggestions: SuggestApiItem[]): void {
    if (!this.listbox) {
      return
    }

    this.listbox.replaceChildren()
    this.options = []
    this.activeIndex = -1

    if (suggestions.length === 0) {
      this.close()
      this.announce(i18n.suggestNone)
      return
    }

    const listboxId = this.listbox.id
    let headingRendered = false

    suggestions.forEach((suggestion, index) => {
      const label = String(suggestion.label ?? '')
      if (label === '') {
        return
      }

      if (suggestion.type === 'page' && !headingRendered && this.pagesHeading !== '') {
        const heading = document.createElement('li')
        heading.className = 'tx-indexedsearch-suggest-heading'
        if (this.options.length > 0) {
          heading.classList.add('tx-indexedsearch-suggest-heading-divided')
        }
        heading.setAttribute('role', 'presentation')
        heading.setAttribute('aria-hidden', 'true')
        heading.textContent = this.pagesHeading
        this.listbox?.append(heading)
        headingRendered = true
      }

      const optionEl = document.createElement('li')
      optionEl.id = `${listboxId}-option-${index}`
      optionEl.setAttribute('role', 'option')
      optionEl.setAttribute('aria-selected', 'false')
      optionEl.className = 'tx-indexedsearch-suggest-option'

      if (suggestion.type === 'page') {
        optionEl.classList.add('tx-indexedsearch-suggest-option-page')
        const title = document.createElement('span')
        title.className = 'tx-indexedsearch-suggest-title'
        title.textContent = label
        optionEl.append(
          createIcon('page', 'tx-indexedsearch-suggest-icon-page'),
          title,
          createIcon('chevron', 'tx-indexedsearch-suggest-chevron'),
        )
        this.listbox?.append(optionEl)
        const href = suggestion.url ? safeSameOriginHref(suggestion.url) : null
        if (href) {
          this.options.push({ el: optionEl, url: href })
        } else {
          this.options.push({ el: optionEl, query: label })
        }
      } else {
        optionEl.classList.add('tx-indexedsearch-suggest-option-word')
        const text = document.createElement('span')
        text.className = 'tx-indexedsearch-suggest-text'
        text.textContent = label
        optionEl.append(createIcon('search', 'tx-indexedsearch-suggest-icon'), text)
        this.listbox?.append(optionEl)
        this.options.push({ el: optionEl, query: suggestion.query ?? label })
      }
    })

    if (this.options.length === 0) {
      this.close()
      this.announce(i18n.suggestNone)
      return
    }

    this.open()
    const message =
      this.options.length === 1
        ? i18n.suggestOne
        : i18n.suggestMany.replace('{{count}}', String(this.options.length))
    this.announce(message)
  }

  private onKeydown(event: KeyboardEvent): void {
    const isOpen = this.input.getAttribute('aria-expanded') === 'true'

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen && this.options.length > 0) {
          this.open()
        }
        this.moveActive(1)
        break
      case 'ArrowUp':
        if (!isOpen) {
          return
        }
        event.preventDefault()
        this.moveActive(-1)
        break
      case 'Enter':
        if (isOpen && this.activeIndex >= 0) {
          event.preventDefault()
          this.selectOption(this.activeIndex)
        }
        break
      case 'Escape':
        if (isOpen) {
          event.preventDefault()
          this.close()
        }
        break
      case 'Tab':
        this.close()
        break
      default:
        break
    }
  }

  private moveActive(direction: number): void {
    if (this.options.length === 0) {
      return
    }
    const count = this.options.length
    let next = this.activeIndex + direction
    if (next < 0) {
      next = count - 1
    } else if (next >= count) {
      next = 0
    }
    this.setActive(next)
  }

  private setActive(index: number): void {
    this.options.forEach((option, i) => {
      const active = i === index
      option.el.classList.toggle('is-active', active)
      option.el.setAttribute('aria-selected', active ? 'true' : 'false')
    })
    this.activeIndex = index
    const activeEl = this.options[index]?.el
    if (activeEl) {
      this.input.setAttribute('aria-activedescendant', activeEl.id)
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  }

  private selectOption(index: number): void {
    const option = this.options[index]
    if (!option) {
      return
    }
    if (option.url) {
      this.close()
      window.location.assign(option.url)
      return
    }
    if (option.query) {
      this.input.value = option.query
      this.close()
      if (this.form) {
        if (typeof this.form.requestSubmit === 'function') {
          this.form.requestSubmit()
        } else {
          this.form.submit()
        }
      }
    }
  }

  private open(): void {
    if (!this.listbox) {
      return
    }
    this.listbox.hidden = false
    this.input.setAttribute('aria-expanded', 'true')
  }

  private close(): void {
    if (!this.listbox) {
      return
    }
    this.controller?.abort()
    this.listbox.hidden = true
    this.input.setAttribute('aria-expanded', 'false')
    this.input.removeAttribute('aria-activedescendant')
    this.activeIndex = -1
    this.options.forEach((option) => {
      option.el.classList.remove('is-active')
      option.el.setAttribute('aria-selected', 'false')
    })
  }

  private announce(message: string): void {
    this.status.textContent = message
  }
}

function initSearchAutosuggest(): void {
  document.querySelectorAll('input[data-autosuggest-url]').forEach((input) => {
    if (input instanceof HTMLInputElement) {
      SearchAutosuggest.getOrCreateInstance(input)
    }
  })
}

function initHeaderSearchFocus(): void {
  EventHandler.on(document, 'shown.bs.menu', (event) => {
    const toggle = event.target
    if (!(toggle instanceof Element)) {
      return
    }
    const menu = toggle.parentElement?.querySelector('.menu')
    const input = menu?.querySelector('input[type="search"], input[data-autosuggest-url]')
    if (input instanceof HTMLInputElement) {
      input.focus()
    }
  })
}

initSearchAutosuggest()
initHeaderSearchFocus()

export default SearchAutosuggest
