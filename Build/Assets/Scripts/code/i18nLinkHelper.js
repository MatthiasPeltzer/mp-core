// Enhance links with accessibility i18n
import {i18n} from './i18n.js';
import {debounce} from './Utils/domUtils.js';

// Map of class names to i18n keys
const linkClassToKey = new Map([
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

// Support common kebab-case class aliases
const classAliasToKey = new Map([
  ['external-link', 'externalLink'],
  ['external-link-new', 'externalLinkNew'],
  ['internal-link', 'internalLink'],
  ['internal-link-new', 'internalLinkNew'],
  ['list-scroll', 'listScroll'],
  ['icon-link', 'iconLink'],
  ['download', 'download']
]);

function isExternal(link) {
  const href = link.getAttribute('href') || '';
  if (!href) return false;
  try {
    const url = new URL(href, document.baseURI);
    return !!(url.origin && window.location && url.origin !== window.location.origin);
  } catch {
    return false;
  }
}

function ensureHiddenSpan(linkElement, text) {
  if (!linkElement) return;
  // Avoid duplicating if already present with same text
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

function enhanceLinksAccessibility(root = document) {
  const links = [];
  // Include root if it's an anchor element
  if (root && root.nodeType === 1 && root.matches && root.matches('a')) {
    links.push(root);
  }
  // Include all descendant anchors
  if (root && root.querySelectorAll) {
    links.push(...root.querySelectorAll('a'));
  }

  links.forEach((link) => {
    // Determine primary class that maps to i18n (classes only)
    let matchedKey = null;
    // Exact camelCase classes
    for (const [className, key] of linkClassToKey.entries()) {
      if (link.classList.contains(className) && i18n[key]) {
        matchedKey = key;
        break;
      }
    }
    // Kebab-case aliases
    if (!matchedKey) {
      for (const cls of link.classList) {
        const aliasKey = classAliasToKey.get(cls);
        if (aliasKey && i18n[aliasKey]) {
          matchedKey = aliasKey;
          break;
        }
      }
    }

    const isBlank = link.getAttribute('target') === '_blank';
    const external = isExternal(link);

    // Build final helper text
    let helperText = null;
    // Never annotate internal links at all
    if (matchedKey === 'internalLink' || matchedKey === 'internalLinkNew' || (!matchedKey && !external)) {
      helperText = null;
    } else {
      // Base text from class, if present and not internal
      if (matchedKey) {
        helperText = i18n[matchedKey];
      }
      // Append new-window only for external _blank links
      if (isBlank && external) {
        if (matchedKey === 'externalLinkNew') {
          helperText = i18n.externalLinkNew;
        } else if (matchedKey === 'externalLink') {
          helperText = `${i18n.externalLink} (${i18n.newWindow})`;
        } else {
          helperText = `${i18n.externalLink} (${i18n.newWindow})`;
        }
      }
    }

    if (helperText) {
      ensureHiddenSpan(link, helperText);
    }
  });
}

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => enhanceLinksAccessibility());
} else {
  enhanceLinksAccessibility();
}

// Observe DOM changes to handle dynamically added links
const startObserver = () => {
  if (!('MutationObserver' in window)) return;
  const observer = new MutationObserver(
    debounce((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node && (node.nodeType === 1 || node.nodeType === 9)) {
            enhanceLinksAccessibility(node);
          }
        });
      });
    }, 100)
  );
  observer.observe(document.body, {childList: true, subtree: true});
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startObserver);
} else {
  startObserver();
}
