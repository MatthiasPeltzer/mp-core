import { describe, expect, it } from 'vitest'
import {
  markMenuItemsForBackingSelect,
  readSelectedValues,
  syncSelectMultipleFromValues,
} from '../Assets/Scripts/code/formComboboxSync.js'

describe('formComboboxSync', () => {
  it('reads and writes multi-select values', () => {
    document.body.innerHTML = `
      <select multiple id="backing">
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
      </select>
    `
    const select = document.getElementById('backing') as HTMLSelectElement
    syncSelectMultipleFromValues(select, ['a', 'c'])
    expect(readSelectedValues(select)).toEqual(['a', 'c'])
  })

  it('marks menu items from backing select', () => {
    document.body.innerHTML = `
      <div id="root">
        <select multiple id="backing">
          <option value="a" selected>A</option>
          <option value="b">B</option>
        </select>
        <button type="button" class="menu-item" data-bs-value="a">A</button>
        <button type="button" class="menu-item" data-bs-value="b">B</button>
      </div>
    `
    const root = document.getElementById('root')!
    const backing = document.getElementById('backing') as HTMLSelectElement
    markMenuItemsForBackingSelect(root, backing)
    expect(root.querySelector('[data-bs-value="a"]')?.classList.contains('selected')).toBe(true)
    expect(root.querySelector('[data-bs-value="b"]')?.classList.contains('selected')).toBe(false)
  })
})