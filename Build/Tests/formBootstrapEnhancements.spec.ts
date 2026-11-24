import { describe, expect, it } from 'vitest'

describe('form datepicker markup', () => {
  it('exposes BS6 datepicker hooks on enabled fields', () => {
    document.body.innerHTML = `
      <div class="form-field mp-form-datepicker" data-mp-bs-form-datepicker="1">
        <input type="text" id="date-1" data-bs-toggle="datepicker" class="form-control" name="tx_form[form][date]" />
      </div>
    `
    const input = document.querySelector('[data-bs-toggle="datepicker"]')
    expect(input).not.toBeNull()
    expect(document.querySelector('[data-mp-bs-form-datepicker]')).not.toBeNull()
  })
})

describe('form date range markup', () => {
  it('exposes ranged datepicker hooks', () => {
    document.body.innerHTML = `
      <div class="form-field mp-form-datepicker mp-form-date-range" data-mp-bs-form-datepicker="1" data-mp-bs-form-date-range="1">
        <input type="text" id="range-1" data-bs-toggle="datepicker" data-bs-selection-mode="multiple-ranged" class="form-control" name="tx_form[form][travel]" readonly />
      </div>
    `
    expect(document.querySelector('[data-mp-bs-form-date-range]')).not.toBeNull()
    expect(document.querySelector('[data-bs-selection-mode="multiple-ranged"]')).not.toBeNull()
  })
})

describe('form combobox markup', () => {
  it('keeps a hidden backing multi-select', () => {
    document.body.innerHTML = `
      <div class="mp-form-combobox" data-mp-combobox-root="1">
        <select multiple id="topics-backing" class="visually-hidden mp-combobox-backing-select">
          <option value="a">A</option>
        </select>
        <div class="combobox-control" data-bs-toggle="combobox" data-bs-multiple="true" data-mp-combobox-control="1" data-mp-combobox-backing="topics-backing"></div>
        <div class="menu"><button type="button" class="menu-item" data-bs-value="a">A</button></div>
      </div>
    `
    const backing = document.getElementById('topics-backing') as HTMLSelectElement
    expect(backing.multiple).toBe(true)
    expect(document.querySelector('[data-mp-combobox-control]')).not.toBeNull()
  })
})