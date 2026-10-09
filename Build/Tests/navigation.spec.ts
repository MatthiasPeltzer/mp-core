import { describe, expect, it } from 'vitest'
import { isMenuNavLinkClick } from '../Assets/Scripts/code/Utils/domUtils.js'

describe('navigation helpers', () => {
  it('isMenuNavLinkClick ignores hash-only links', () => {
    document.body.innerHTML = '<a href="#section">Jump</a>'
    const link = document.querySelector('a')
    link?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(isMenuNavLinkClick({ target: link } as Event)).toBe(false)
  })

  it('isMenuNavLinkClick accepts same-page path links', () => {
    document.body.innerHTML = '<a href="/example">Page</a>'
    const link = document.querySelector('a')
    expect(isMenuNavLinkClick({ target: link } as Event)).toBe(true)
  })
})
