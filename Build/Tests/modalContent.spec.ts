import { describe, expect, it } from 'vitest'

describe('modal content hooks', () => {
  it('marks dialog elements with data-modal-content-root', () => {
    document.body.innerHTML = `
      <div class="dialog" data-bs-backdrop="true">
        <div class="dialog-body" data-modal-content-root></div>
      </div>
    `
    const root = document.querySelector('[data-modal-content-root]')
    expect(root).toBeTruthy()
    expect(document.querySelector('.dialog[data-bs-backdrop]')).toBeTruthy()
  })
})
