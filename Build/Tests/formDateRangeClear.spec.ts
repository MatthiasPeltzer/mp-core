import Datepicker from 'bootstrap/js/dist/datepicker.js'
import { describe, expect, it, vi } from 'vitest'
import { hasRangeDateSelection, syncRangeClearButton } from '../Assets/Scripts/code/formDateRangeClear.js'

describe('formDateRangeClear', () => {
  it('hides the clear control when nothing is selected', () => {
    document.body.innerHTML = `
      <input type="text" id="range" value="" />
      <button type="button" data-mp-bs-date-range-clear="1" hidden disabled>×</button>
    `
    const input = document.getElementById('range') as HTMLInputElement
    const button = document.querySelector('[data-mp-bs-date-range-clear]') as HTMLButtonElement

    vi.spyOn(Datepicker, 'getInstance').mockReturnValue({
      getSelectedDates: () => [],
    } as Datepicker)

    expect(hasRangeDateSelection(input)).toBe(false)
    syncRangeClearButton(input, button)
    expect(button.hidden).toBe(true)
    expect(button.disabled).toBe(true)
  })

  it('shows the clear control when the picker has dates', () => {
    document.body.innerHTML = `
      <input type="text" id="range" value="10.06.2026 – 18.06.2026" />
      <button type="button" data-mp-bs-date-range-clear="1" hidden disabled>×</button>
    `
    const input = document.getElementById('range') as HTMLInputElement
    const button = document.querySelector('[data-mp-bs-date-range-clear]') as HTMLButtonElement

    vi.spyOn(Datepicker, 'getInstance').mockReturnValue({
      getSelectedDates: () => ['2026-06-10', '2026-06-18'],
    } as Datepicker)

    syncRangeClearButton(input, button)
    expect(button.hidden).toBe(false)
    expect(button.disabled).toBe(false)
  })
})