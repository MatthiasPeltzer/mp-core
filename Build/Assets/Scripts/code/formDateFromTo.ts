/**
 * Couples ext:form DateFromTo start/end native date inputs (min/max without Bootstrap).
 */
function maxIso(a: string, b: string): string {
  if (a === '') {
    return b
  }
  if (b === '') {
    return a
  }
  return a > b ? a : b
}

function minIso(a: string, b: string): string {
  if (a === '') {
    return b
  }
  if (b === '') {
    return a
  }
  return a < b ? a : b
}

/** Native date inputs may accept out-of-range values via keyboard until submit; snap back to min/max. */
function clampNativeDateInput(input: HTMLInputElement): void {
  const value = input.value.trim()
  if (value === '') {
    return
  }
  const { min, max } = input
  if (min !== '' && value < min) {
    input.value = min
  } else if (max !== '' && value > max) {
    input.value = max
  }
}

function syncDateFromToBounds(wrapper: HTMLElement, start: HTMLInputElement, end: HTMLInputElement): void {
  const globalMin = wrapper.dataset.bsDateMin?.trim() ?? ''
  const globalMax = wrapper.dataset.bsDateMax?.trim() ?? ''

  const startValue = start.value.trim()
  const endValue = end.value.trim()

  start.min = globalMin
  end.max = globalMax

  if (endValue !== '') {
    start.max = globalMax === '' ? endValue : minIso(endValue, globalMax)
  } else {
    start.removeAttribute('max')
    if (globalMax !== '') {
      start.max = globalMax
    }
  }

  if (startValue !== '') {
    end.min = globalMin === '' ? startValue : maxIso(startValue, globalMin)
  } else {
    end.removeAttribute('min')
    if (globalMin !== '') {
      end.min = globalMin
    }
  }

  if (startValue !== '' && endValue !== '' && endValue < startValue) {
    end.value = startValue
    end.min = startValue
  }

  clampNativeDateInput(start)
  clampNativeDateInput(end)
}

export function initFormDateFromTo(): void {
  for (const wrapper of document.querySelectorAll<HTMLElement>('[data-mp-bs-form-date-from-to]')) {
    const start = wrapper.querySelector<HTMLInputElement>('[data-mp-date-from-to-start]')
    const end = wrapper.querySelector<HTMLInputElement>('[data-mp-date-from-to-end]')
    if (!start || !end) {
      continue
    }

    const refresh = (): void => {
      syncDateFromToBounds(wrapper, start, end)
    }

    start.addEventListener('change', refresh)
    start.addEventListener('input', refresh)
    end.addEventListener('change', refresh)
    end.addEventListener('input', refresh)
    refresh()
  }
}