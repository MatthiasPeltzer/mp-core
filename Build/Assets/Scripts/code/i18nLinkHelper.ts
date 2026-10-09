import { i18n, type I18nKey } from './i18n.js'
import { debounce } from './Utils/domUtils.js'

const CLASS_TO_KEY = new Map<string, I18nKey>([
  ['audio', 'audio'],
  ['chart', 'chart'],
  ['download', 'download'],
  ['email', 'email'],
  ['externalLink', 'externalLink'],
  ['externalLinkNew', 'externalLinkNew'],
  ['gallery', 'gallery'],
  ['glossary', 'glossary'],
  ['iconLink', 'iconLink'],
  ['internalLink', 'internalLink'],
  ['internalLinkNew', 'internalLinkNew'],
  ['legal', 'legal'],
  ['listScroll', 'listScroll'],
  ['phone', 'phone'],
  ['press', 'press'],
  ['public', 'public'],
  ['video', 'video']
])

const ALIAS_TO_KEY = new Map<string, I18nKey>([
  ['external-link', 'externalLink'],
  ['external-link-new', 'externalLinkNew'],
  ['internal-link', 'internalLink'],
  ['internal-link-new', 'internalLinkNew'],
  ['list-scroll', 'listScroll'],
  ['icon-link', 'iconLink'],
  ['download', 'download']
])

function isExternal(link: HTMLAnchorElement): boolean {
  const href = link.getAttribute('href')
  if (!href) return false

  try {
    const url = new URL(href, document.baseURI)
    return url.origin !== window.location.origin
  } catch {
    return false
  }
}

function ensureHiddenSpan(linkElement: HTMLElement, text: string): void {
  const existing = linkElement.querySelector('span.visually-hidden[data-i18n-helper="true"]')

  if (existing) {
    existing.textContent = text
    return
  }

  const span = document.createElement('span')
  span.className = 'visually-hidden'
  span.setAttribute('data-i18n-helper', 'true')
  span.textContent = text
  linkElement.append(span)
}

function getMatchedKey(link: HTMLAnchorElement): I18nKey | null {
  for (const [className, key] of CLASS_TO_KEY) {
    if (link.classList.contains(className) && i18n[key]) {
      return key
    }
  }

  for (const cls of link.classList) {
    const aliasKey = ALIAS_TO_KEY.get(cls)
    if (aliasKey && i18n[aliasKey]) {
      return aliasKey
    }
  }

  return null
}

function collectLinks(root: ParentNode): HTMLAnchorElement[] {
  const links: HTMLAnchorElement[] = []

  if (root instanceof HTMLAnchorElement) {
    links.push(root)
  } else if (root instanceof Element && root.matches('a')) {
    const anchor = root.closest('a')
    if (anchor instanceof HTMLAnchorElement) {
      links.push(anchor)
    }
  }

  if (root instanceof Element || root instanceof Document) {
    root.querySelectorAll('a').forEach(anchor => {
      if (anchor instanceof HTMLAnchorElement) {
        links.push(anchor)
      }
    })
  }

  return links
}

function enhanceLinksAccessibility(root: ParentNode = document): void {
  collectLinks(root).forEach(link => {
    if (link.dataset.noI18nHelper === 'true') return
    if (link.hasAttribute('aria-label') || link.hasAttribute('aria-labelledby')) return

    const matchedKey = getMatchedKey(link)
    const isBlank = link.getAttribute('target') === '_blank'
    const external = isExternal(link)

    if (matchedKey === 'internalLink' || matchedKey === 'internalLinkNew') return
    if (!matchedKey && !external) return

    let helperText: string | null = matchedKey ? i18n[matchedKey] : null

    if (isBlank && external) {
      if (matchedKey === 'externalLinkNew') {
        helperText = i18n.externalLinkNew
      } else {
        helperText = `${i18n.externalLink} (${i18n.newWindow})`
      }
    }

    if (helperText) {
      ensureHiddenSpan(link, helperText)
    }
  })
}

function init(): void {
  enhanceLinksAccessibility()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

function startObserver(): void {
  if (!('MutationObserver' in window)) return

  const handleMutations = debounce((mutations: MutationRecord[]) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node instanceof Element || node instanceof Document) {
          enhanceLinksAccessibility(node)
        }
      })
    })
  }, 100)

  const observer = new MutationObserver(handleMutations)
  observer.observe(document.body, { childList: true, subtree: true })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startObserver)
} else {
  startObserver()
}
