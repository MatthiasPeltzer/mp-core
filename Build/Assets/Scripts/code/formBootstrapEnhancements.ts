/**
 * Optional Bootstrap 6 widgets for ext:form (datepicker, combobox).
 */
import Datepicker from 'bootstrap/js/dist/datepicker.js'
import Combobox from 'bootstrap/js/dist/combobox.js'
import {
  markMenuItemsForBackingSelect,
  readSelectedValues,
  syncSelectMultipleFromValues,
} from './formComboboxSync.js'

export function initFormBootstrapEnhancements(): void {
  initFormDatepickers()
  initFormComboboxes()
}

const ISO_DATE_RANGE = /^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/

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
    if (isRange) {
      input.setAttribute('data-bs-selection-mode', 'multiple-ranged')
      input.readOnly = true
      const displayMonths = wrapper.dataset.bsDisplayMonthsCount?.trim() ?? ''
      if (displayMonths === '2') {
        input.setAttribute('data-bs-display-months-count', '2')
      }
      const initial = input.value.trim()
      if (ISO_DATE_RANGE.test(initial)) {
        const [start, end] = initial.split(',', 2)
        input.setAttribute('data-bs-selected-dates', JSON.stringify([start, end]))
      }
    }
    Datepicker.getOrCreateInstance(input)
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