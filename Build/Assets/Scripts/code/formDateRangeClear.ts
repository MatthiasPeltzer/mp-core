import Datepicker from 'bootstrap/js/dist/datepicker.js'

const ISO_DATE_RANGE = /^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/

function getDatepickerBoundValue(input: HTMLInputElement): string {
  const previous = input.previousElementSibling
  if (previous instanceof HTMLInputElement && previous.type === 'hidden') {
    return previous.value.trim()
  }
  return ''
}

/** True when the ranged field has a calendar selection or a reposted ISO range value. */
export function hasRangeDateSelection(input: HTMLInputElement): boolean {
  const selectedCount = Datepicker.getInstance(input)?.getSelectedDates().length ?? 0
  if (selectedCount > 0) {
    return true
  }
  const boundValue = getDatepickerBoundValue(input)
  if (boundValue !== '' && ISO_DATE_RANGE.test(boundValue)) {
    return true
  }
  const visibleValue = input.value.trim()
  return visibleValue !== '' && ISO_DATE_RANGE.test(visibleValue)
}

export function resetRangeDatepicker(input: HTMLInputElement): Datepicker {
  input.value = ''
  input.removeAttribute('data-bs-selected-dates')
  const boundValue = getDatepickerBoundValue(input)
  if (boundValue !== '') {
    const previous = input.previousElementSibling
    if (previous instanceof HTMLInputElement && previous.type === 'hidden') {
      previous.value = ''
    }
  }
  Datepicker.getInstance(input)?.dispose()
  return Datepicker.getOrCreateInstance(input)
}

export function syncRangeClearButton(
  input: HTMLInputElement,
  clearButton: HTMLButtonElement,
): void {
  const hasSelection = hasRangeDateSelection(input)
  clearButton.hidden = !hasSelection
  clearButton.disabled = !hasSelection
}

export function bindRangeClearButton(wrapper: HTMLElement, input: HTMLInputElement): void {
  const clearButton = wrapper.querySelector<HTMLButtonElement>('[data-mp-bs-date-range-clear]')
  if (!clearButton) {
    return
  }

  const refreshClear = (): void => {
    syncRangeClearButton(input, clearButton)
  }

  refreshClear()
  queueMicrotask(refreshClear)

  clearButton.addEventListener('click', () => {
    resetRangeDatepicker(input)
    input.dispatchEvent(new Event('change', { bubbles: true }))
    refreshClear()
    input.focus()
  })

  input.addEventListener('change.bs.datepicker', refreshClear)
  input.addEventListener('change', refreshClear)
}