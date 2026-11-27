/**
 * Optional Bootstrap 6 widgets for ext:form (datepicker, combobox).
 */
import Datepicker from 'bootstrap/js/dist/datepicker.js'
import Combobox from 'bootstrap/js/dist/combobox.js'
import { bindDatepickerAccessibility } from './formDatepickerA11y.js'
import { initFormDateFromTo } from './formDateFromTo.js'
import { bindRangeClearButton } from './formDateRangeClear.js'
import {
  markMenuItemsForBackingSelect,
  readSelectedValues,
  syncSelectMultipleFromValues,
} from './formComboboxSync.js'

export function initFormBootstrapEnhancements(): void {
  initFormDateFromTo()
  initFormDatepickers()
  initFormComboboxes()
}

const ISO_DATE_RANGE = /^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/

function parseDisplayMonthsCount(raw: string | undefined): 1 | 2 {
  return raw?.trim() === '2' ? 2 : 1
}

function initFormDatepickers(): void {
  for (const wrapper of document.querySelectorAll<HTMLElement>('[data-mp-bs-form-datepicker]')) {
    const input = wrapper.querySelector<HTMLInputElement>('[data-bs-toggle="datepicker"]')
    if (!input) {
      continue
    }
    const locale = document.documentElement.lang?.trim() || 'default'
    input.setAttribute('data-bs-locale', locale)
    const min = wrapper.dataset.bsDateMin?.trim() ?? ''
    const max = wrapper.dataset.bsDateMax?.trim() ?? ''
    if (min !== '') {
      input.setAttribute('data-bs-date-min', min)
    }
    if (max !== '') {
      input.setAttribute('data-bs-date-max', max)
    }
    const isRange = wrapper.dataset.mpBsFormDateRange === '1'
    const displayMonthsCount = parseDisplayMonthsCount(wrapper.dataset.bsDisplayMonthsCount)
    const rangeEndMessage = wrapper.dataset.mpBsRangeEndMessage?.trim() ?? ''
    if (isRange) {
      input.setAttribute('data-bs-selection-mode', 'multiple-ranged')
      input.readOnly = true
      input.setAttribute('data-bs-display-months-count', String(displayMonthsCount))
      if (rangeEndMessage !== '') {
        input.setAttribute('data-bs-range-end-message', rangeEndMessage)
      }
    }
    // BS data-api may init first on DOMContentLoaded; re-init so range + ISO preset apply.
    const initial = input.value.trim()
    const existing = Datepicker.getInstance(input)
    if (existing) {
      existing.dispose()
    }
    const pickerOptions: Record<string, unknown> = {}
    if (isRange) {
      pickerOptions.selectionMode = 'multiple-ranged'
      pickerOptions.displayMonthsCount = displayMonthsCount
      if (rangeEndMessage !== '') {
        pickerOptions.rangeEndMessage = rangeEndMessage
      }
    }
    const picker = Datepicker.getOrCreateInstance(input, pickerOptions)
    bindDatepickerAccessibility(input)
    if (isRange && ISO_DATE_RANGE.test(initial)) {
      const [start, end] = initial.split(',', 2)
      picker.setSelectedDates([start, end])
    }
    if (isRange) {
      bindRangeClearButton(wrapper, input)
    }
  }
}

function initFormComboboxes(): void {
  for (const root of document.querySelectorAll<HTMLElement>('[data-mp-combobox-root]')) {
    const control = root.querySelector<HTMLElement>('[data-mp-combobox-control]')
    const backingId = control?.dataset.mpComboboxBacking
    if (!control || !backingId) {
      continue
    }
    const backing = document.getElementById(backingId)
    if (!(backing instanceof HTMLSelectElement)) {
      continue
    }

    markMenuItemsForBackingSelect(root, backing)
    const combobox = Combobox.getOrCreateInstance(control)

    control.addEventListener('change.bs.combobox', () => {
      const values = combobox.getValues()
      syncSelectMultipleFromValues(backing, values)
      backing.dispatchEvent(new Event('change', { bubbles: true }))
    })

    backing.addEventListener('change', () => {
      const values = readSelectedValues(backing)
      syncSelectMultipleFromValues(backing, values)
      markMenuItemsForBackingSelect(root, backing)
    })
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initFormBootstrapEnhancements())
} else {
  initFormBootstrapEnhancements()
}