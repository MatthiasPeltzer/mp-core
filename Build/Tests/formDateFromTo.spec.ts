import { describe, expect, it } from 'vitest'
import { initFormDateFromTo } from '../Assets/Scripts/code/formDateFromTo.js'

describe('form date from–to', () => {
  it('sets end min from start on change', () => {
    document.body.innerHTML = `
      <div data-mp-bs-form-date-from-to="1" data-bs-date-min="2026-01-01" data-bs-date-max="2027-12-31">
        <input type="date" data-mp-date-from-to-start="1" value="2026-06-10" />
        <input type="date" data-mp-date-from-to-end="1" value="2026-06-05" />
      </div>
    `
    initFormDateFromTo()
    const end = document.querySelector('[data-mp-date-from-to-end]') as HTMLInputElement
    expect(end.min).toBe('2026-06-10')
    expect(end.value).toBe('2026-06-10')
  })

  it('clamps start below global min on init', () => {
    document.body.innerHTML = `
      <div data-mp-bs-form-date-from-to="1" data-bs-date-min="2026-06-01" data-bs-date-max="">
        <input type="date" data-mp-date-from-to-start="1" min="2026-06-01" value="2026-05-01" />
        <input type="date" data-mp-date-from-to-end="1" value="" />
      </div>
    `
    initFormDateFromTo()
    const start = document.querySelector('[data-mp-date-from-to-start]') as HTMLInputElement
    expect(start.value).toBe('2026-06-01')
  })
})