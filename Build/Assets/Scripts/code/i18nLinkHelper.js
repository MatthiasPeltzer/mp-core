/**
 * Accessibility Link Helper Module
 * Enhances links with screen reader text based on link type
 * Observes DOM changes to handle dynamically added content
 */

import { i18n } from './i18n.js';
import { debounce } from './Utils/domUtils.js';

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Map of camelCase class names to i18n keys
 */
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

/**
 * Map of kebab-case class aliases to i18n keys
 */
const ALIAS_TO_KEY = new Map([
  ['external-link', 'externalLink'],
  ['external-link-new', 'externalLinkNew'],
  ['internal-link', 'internalLink'],
  ['internal-link-new', 'internalLinkNew'],
  ['list-scroll', 'listScroll'],
  ['icon-link', 'iconLink'],
  ['download', 'download']
]);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Checks if a link points to an external origin
 * @param {HTMLAnchorElement} link - Link element to check
 * @returns {boolean} Whether link is external
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
 * Adds or updates hidden span for screen readers
 * @param {HTMLElement} linkElement - Link to enhance
 * @param {string} text - Text for screen readers
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
  linkElement.prepend(span);
}

/**
 * Gets the i18n key for a link based on its classes
 * @param {HTMLAnchorElement} link - Link to check
 * @returns {string|null} Matched i18n key or null
 */
function getMatchedKey(link) {
  // Check camelCase classes
  for (const [className, key] of CLASS_TO_KEY) {
    if (link.classList.contains(className) && i18n[key]) {
      return key;
    }
  }

  // Check kebab-case aliases
  for (const cls of link.classList) {
    const aliasKey = ALIAS_TO_KEY.get(cls);
    if (aliasKey && i18n[aliasKey]) {
      return aliasKey;
    }
  }

  return null;
}

// =============================================================================
// MAIN ENHANCEMENT FUNCTION
// =============================================================================

/**
 * Enhances links with accessibility text
 * @param {HTMLElement|Document} root - Root element to search within
 */
function enhanceLinksAccessibility(root = document) {
  const links = [];

  // Include root if it's an anchor
  if (root?.nodeType === 1 && root.matches?.('a')) {
    links.push(root);
  }

  // Include all descendant anchors
  if (root?.querySelectorAll) {
    links.push(...root.querySelectorAll('a'));
  }

  links.forEach(link => {
    const matchedKey = getMatchedKey(link);
    const isBlank = link.getAttribute('target') === '_blank';
    const external = isExternal(link);

    // Skip internal links entirely
    if (matchedKey === 'internalLink' || matchedKey === 'internalLinkNew') return;
    if (!matchedKey && !external) return;

    let helperText = matchedKey ? i18n[matchedKey] : null;

    // Handle external _blank links
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

// =============================================================================
// INITIALIZATION
// =============================================================================

function init() {
  enhanceLinksAccessibility();
}

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// =============================================================================
// MUTATION OBSERVER
// =============================================================================

/**
 * Starts observing DOM for dynamically added links
 */
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
