/**
 * Accessibility patches for Bootstrap 6 + Vanilla Calendar Pro datepicker on ext:form fields.
 * Does not replace native Date / DateFromTo for critical AT paths — reduces grid noise and announces selection.
 */
import Datepicker from 'bootstrap/js/dist/datepicker.js'

type LiveStrings = {
  calendarOpened: string
  dateSelected: (label: string) => string
  rangeStart: (label: string) => string
  rangeComplete: (start: string, end: string) => string
}

function liveStrings(): LiveStrings {
  const lang = (document.documentElement.lang ?? '').toLowerCase()
  if (lang.startsWith('de')) {
    return {
      calendarOpened: 'Kalender geöffnet. Wählen Sie ein Datum.',
      dateSelected: (label) => `${label} gewählt.`,
      rangeStart: (label) => `Beginn: ${label}. Bitte Enddatum wählen.`,
      rangeComplete: (start, end) => `Zeitraum: ${start} bis ${end}.`,
    }
  }

  return {
    calendarOpened: 'Calendar opened. Choose a date.',
    dateSelected: (label) => `${label} selected.`,
    rangeStart: (label) => `Start: ${label}. Choose an end date.`,
    rangeComplete: (start, end) => `Range: ${start} to ${end}.`,
  }
}

function formatDayLabel(isoDate: string, locale: string): string {
  const date = new Date(`${isoDate}T12:00:00`)
  if (Number.isNaN(date.getTime())) {
    return isoDate
  }
  const resolved = locale === 'default' || locale === '' ? undefined : locale
  return new Intl.DateTimeFormat(resolved, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function getFieldLabel(input: HTMLInputElement): HTMLLabelElement | null {
  const id = input.id
  if (!id) {
    return null
  }
  const root = input.getRootNode()
  const scope = root instanceof Document || root instanceof ShadowRoot ? root : document
  const label = scope.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(id)}"]`)
  return label ?? null
}

function getPopup(input: HTMLInputElement): HTMLElement | null {
  const popupId = input.getAttribute('aria-controls')
  if (!popupId) {
    return null
  }
  const root = input.getRootNode()
  const scope = root instanceof Document || root instanceof ShadowRoot ? root : document
  return scope.getElementById(popupId)
}

function ensureLiveRegion(popup: HTMLElement, inputId: string): HTMLElement {
  const liveId = `mp-bs-datepicker-live-${inputId}`
  let live = popup.querySelector<HTMLElement>(`#${CSS.escape(liveId)}`)
  if (!live) {
    live = document.createElement('div')
    live.id = liveId
    live.className = 'visually-hidden'
    live.setAttribute('aria-live', 'polite')
    live.setAttribute('aria-atomic', 'true')
    popup.prepend(live)
  }
  return live
}

export function enhanceDatepickerPopup(input: HTMLInputElement): void {
  const popup = getPopup(input)
  if (!popup) {
    return
  }

  const locale = input.getAttribute('data-bs-locale')?.trim() || document.documentElement.lang || 'default'
  popup.setAttribute('aria-modal', 'true')

  const label = getFieldLabel(input)
  if (label) {
    if (!label.id) {
      label.id = `${input.id}-label`
    }
    popup.setAttribute('aria-labelledby', label.id)
  }

  ensureLiveRegion(popup, input.id)

  for (const weekTitle of popup.querySelectorAll<HTMLElement>('[data-vc-week="titles"], [data-vc="week"]')) {
    weekTitle.setAttribute('aria-hidden', 'true')
  }

  for (const cell of popup.querySelectorAll<HTMLElement>('[data-vc-date]')) {
    const iso = cell.dataset.vcDate?.trim()
    const button = cell.querySelector<HTMLElement>('[data-vc-date-btn]')
    if (!iso || !button) {
      continue
    }
    const month = cell.dataset.vcDateMonth
    const disabled = button.matches(':disabled') || month === 'prev' || month === 'next'
    const dayLabel = formatDayLabel(iso, locale)
    button.setAttribute(
      'aria-label',
      disabled ? `${dayLabel}, not available` : dayLabel,
    )
    if (disabled) {
      button.setAttribute('aria-disabled', 'true')
    }
  }
}

function announce(live: HTMLElement, text: string): void {
  live.textContent = ''
  window.setTimeout(() => {
    live.textContent = text
  }, 50)
}

function announceSelection(input: HTMLInputElement, dates: string[]): void {
  const popup = getPopup(input)
  if (!popup || dates.length === 0) {
    return
  }
  const live = ensureLiveRegion(popup, input.id)
  const locale = input.getAttribute('data-bs-locale')?.trim() || document.documentElement.lang || 'default'
  const strings = liveStrings()
  const isRange = input.getAttribute('data-bs-selection-mode') === 'multiple-ranged'
  const labels = dates.map((d) => formatDayLabel(d, locale))

  if (isRange && labels.length === 1) {
    announce(live, strings.rangeStart(labels[0]!))
    return
  }
  if (isRange && labels.length >= 2) {
    announce(live, strings.rangeComplete(labels[0]!, labels[1]!))
    return
  }
  announce(live, strings.dateSelected(labels[0]!))
}

const boundInputs = new WeakSet<HTMLInputElement>()

export function bindDatepickerAccessibility(input: HTMLInputElement): void {
  if (boundInputs.has(input)) {
    return
  }
  boundInputs.add(input)

  input.addEventListener('shown.bs.datepicker', () => {
    enhanceDatepickerPopup(input)
    const popup = getPopup(input)
    if (!popup) {
      return
    }
    const live = ensureLiveRegion(popup, input.id)
    announce(live, liveStrings().calendarOpened)
  })

  input.addEventListener('change.bs.datepicker', (event) => {
    const detail = (event as CustomEvent<{ dates?: string[] }>).detail
    const dates = detail?.dates ?? Datepicker.getInstance(input)?.getSelectedDates() ?? []
    enhanceDatepickerPopup(input)
    announceSelection(input, [...dates])
  })
}