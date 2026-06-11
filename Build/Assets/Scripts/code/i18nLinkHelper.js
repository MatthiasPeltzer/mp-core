import { i18n } from './i18n.js';
import { debounce } from './Utils/domUtils.js';

const CLASS_TO_KEY = new Map([
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
]);

const ALIAS_TO_KEY = new Map([
  ['external-link', 'externalLink'],
  ['external-link-new', 'externalLinkNew'],
  ['internal-link', 'internalLink'],
  ['internal-link-new', 'internalLinkNew'],
  ['list-scroll', 'listScroll'],
  ['icon-link', 'iconLink'],
  ['download', 'download']
]);

/**
 * @param {HTMLAnchorElement} link
 * @returns {boolean}
 */
function isExternal(link) {
  const href = link.getAttribute('href');
  if (!href) return false;

  try {
    const url = new URL(href, document.baseURI);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

/**
 * @param {HTMLElement} linkElement
 * @param {string} text
 */
function ensureHiddenSpan(linkElement, text) {
  if (!linkElement) return;

  const existing = linkElement.querySelector('span.visually-hidden[data-i18n-helper="true"]');
  
  if (existing) {
    existing.textContent = text;
    return;
  }

  const span = document.createElement('span');
  span.className = 'visually-hidden';
  span.setAttribute('data-i18n-helper', 'true');
  span.textContent = text;
  linkElement.append(span);
}

/**
 * @param {HTMLAnchorElement} link
 * @returns {string|null}
 */
function getMatchedKey(link) {
  for (const [className, key] of CLASS_TO_KEY) {
    if (link.classList.contains(className) && i18n[key]) {
      return key;
    }
  }

  for (const cls of link.classList) {
    const aliasKey = ALIAS_TO_KEY.get(cls);
    if (aliasKey && i18n[aliasKey]) {
      return aliasKey;
    }
  }

  return null;
}

/**
 * @param {HTMLElement|Document} root
 */
function enhanceLinksAccessibility(root = document) {
  const links = [];

  if (root?.nodeType === 1 && root.matches?.('a')) {
    links.push(root);
  }

  if (root?.querySelectorAll) {
    links.push(...root.querySelectorAll('a'));
  }

  links.forEach(link => {
    // Respect explicit opt-out: data-no-i18n-helper="true" signals the link
    // already has a sufficient accessible name and should not be double-labelled.
    if (link.dataset.noI18nHelper === 'true') return;
    if (link.hasAttribute('aria-label') || link.hasAttribute('aria-labelledby')) return;

    const matchedKey = getMatchedKey(link);
    const isBlank = link.getAttribute('target') === '_blank';
    const external = isExternal(link);

    if (matchedKey === 'internalLink' || matchedKey === 'internalLinkNew') return;
    if (!matchedKey && !external) return;

    let helperText = matchedKey ? i18n[matchedKey] : null;

    if (isBlank && external) {
      if (matchedKey === 'externalLinkNew') {
        helperText = i18n.externalLinkNew;
      } else {
        helperText = `${i18n.externalLink} (${i18n.newWindow})`;
      }
    }

    if (helperText) {
      ensureHiddenSpan(link, helperText);
    }
  });
}

function init() {
  enhanceLinksAccessibility();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function startObserver() {
  if (!('MutationObserver' in window)) return;

  const handleMutations = debounce(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node?.nodeType === 1 || node?.nodeType === 9) {
          enhanceLinksAccessibility(node);
        }
      });
    });
  }, 100);

  const observer = new MutationObserver(handleMutations);
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startObserver);
} else {
  startObserver();
}
