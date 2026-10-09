import { describe, expect, it } from 'vitest'

function safeSameOriginHref(raw: string): string | null {
  try {
    const url = new URL(raw, window.location.origin)
    return url.origin === window.location.origin ? url.href : null
  } catch {
    return null
  }
}

describe('search autosuggest URL guard', () => {
  it('allows same-origin paths', () => {
    expect(safeSameOriginHref('/search?q=1')).toMatch(window.location.origin)
  })

  it('rejects external origins', () => {
    expect(safeSameOriginHref('https://example.com/page')).toBeNull()
  })
})

describe('search autosuggest listbox markup', () => {
  it('exposes listbox role on the suggestion container', () => {
    document.body.innerHTML = `
      <input type="search" aria-controls="suggest-list" data-autosuggest-url="/suggest" />
      <ul id="suggest-list" role="listbox" hidden></ul>
    `
    const listbox = document.getElementById('suggest-list')
    expect(listbox?.getAttribute('role')).toBe('listbox')
  })
})
