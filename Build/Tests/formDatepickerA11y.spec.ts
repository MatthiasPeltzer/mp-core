import { describe, expect, it } from 'vitest'
import { enhanceDatepickerPopup } from '../Assets/Scripts/code/formDatepickerA11y.js'

describe('formDatepickerA11y', () => {
  it('labels day buttons and adds a live region', () => {
    document.body.innerHTML = `
      <label for="travel">Travel</label>
      <input type="text" id="travel" aria-controls="cal-1" data-bs-locale="en" />
      <div id="cal-1" role="dialog">
        <motion data-vc-week="titles"></motion>
        <div data-vc-date="2026-06-10" data-vc-date-month="current">
          <button type="button" data-vc-date-btn>10</button>
        </div>
      </div>
    `.replace('<motion', '<div').replace('</motion>', '</div>')
    const input = document.getElementById('travel') as HTMLInputElement
    enhanceDatepickerPopup(input)
    const popup = document.getElementById('cal-1')!
    expect(popup.getAttribute('aria-modal')).toBe('true')
    const btn = popup.querySelector('[data-vc-date-btn]') as HTMLButtonElement
    expect(btn.getAttribute('aria-label')).toContain('2026')
    expect(popup.querySelector('[aria-live="polite"]')).not.toBeNull()
  })
})