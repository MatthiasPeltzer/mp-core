/**
 * Accessible autosuggest for the indexed_search frontend.
 *
 * Implements the WAI-ARIA 1.2 "Editable Combobox With List Autocomplete"
 * pattern: DOM focus stays in the text input at all times, the popup is a
 * `role="listbox"`, and the active option is tracked with
 * `aria-activedescendant` (WCAG 2.1.1 Keyboard, 4.1.2 Name/Role/Value).
 *
 * Suggestions are fetched as JSON from the URL in `data-autosuggest-url`
 * (served by SearchSuggestMiddleware). Word suggestions fill the field and
 * submit the search; page suggestions navigate straight to the page.
 */

import { i18n } from './i18n.js';

const MIN_CHARS = 2;
const DEBOUNCE_MS = 200;

/**
 * @param {(...args: unknown[]) => void} fn
 * @param {number} wait
 */
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Returns a same-origin href for navigation, or null if the URL is unsafe.
 * Guards against open-redirects (WCAG-adjacent security hardening).
 * @param {string} raw
 * @returns {string|null}
 */
function safeSameOriginHref(raw) {
  try {
    const url = new URL(raw, window.location.origin);
    return url.origin === window.location.origin ? url.href : null;
  } catch {
    return null;
  }
}

class Autosuggest {
  /**
   * @param {HTMLInputElement} input
   */
  constructor(input) {
    this.input = input;
    this.endpoint = input.dataset.autosuggestUrl;
    this.pagesHeading = input.dataset.suggestHeader || '';
    this.listbox = document.getElementById(input.getAttribute('aria-controls'));
    this.form = input.closest('form');

    if (!this.endpoint || !this.listbox) {
      return;
    }

    /** @type {Array<{el: HTMLElement, query?: string, url?: string}>} */
    this.options = [];
    this.activeIndex = -1;
    this.controller = null;

    this.status = this.createStatusRegion();
    this.onInput = debounce(() => this.requestSuggestions(), DEBOUNCE_MS);

    this.bind();
  }

  createStatusRegion() {
    // Polite live region announces how many suggestions appeared (WCAG 4.1.3
    // Status Messages) without moving focus.
    const status = document.createElement('div');
    status.className = 'visually-hidden';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    this.listbox.insertAdjacentElement('afterend', status);
    return status;
  }

  bind() {
    this.input.addEventListener('input', () => {
      if (this.input.value.trim().length < MIN_CHARS) {
        this.close();
        return;
      }
      this.onInput();
    });

    this.input.addEventListener('keydown', (event) => this.onKeydown(event));

    // Keep focus in the input while a suggestion is being clicked so the blur
    // handler does not close the popup before the click is processed.
    this.listbox.addEventListener('mousedown', (event) => event.preventDefault());
    this.listbox.addEventListener('click', (event) => {
      const optionEl = event.target.closest('[role="option"]');
      if (!optionEl) {
        return;
      }
      const index = this.options.findIndex((option) => option.el === optionEl);
      if (index >= 0) {
        this.selectOption(index);
      }
    });

    document.addEventListener('click', (event) => {
      if (!this.input.contains(event.target) && !this.listbox.contains(event.target)) {
        this.close();
      }
    });
  }

  async requestSuggestions() {
    const term = this.input.value.trim();
    if (term.length < MIN_CHARS) {
      this.close();
      return;
    }

    this.controller?.abort();
    this.controller = new AbortController();

    const url = new URL(this.endpoint, window.location.origin);
    url.searchParams.set('tx_mpcore_suggest', '1');
    url.searchParams.set('q', term);

    try {
      const response = await fetch(url.href, {
        headers: { Accept: 'application/json' },
        signal: this.controller.signal
      });
      if (!response.ok) {
        this.close();
        return;
      }
      const data = await response.json();
      // Ignore stale responses if the user kept typing.
      if (this.input.value.trim() !== term) {
        return;
      }
      this.render(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.close();
      }
    }
  }

  /**
   * @param {Array<{type: string, label: string, query?: string, url?: string}>} suggestions
   */
  render(suggestions) {
    this.listbox.replaceChildren();
    this.options = [];
    this.activeIndex = -1;

    if (suggestions.length === 0) {
      this.close();
      this.announce(i18n.suggestNone);
      return;
    }

    const listboxId = this.listbox.id;
    let headingRendered = false;

    suggestions.forEach((suggestion, index) => {
      const label = String(suggestion.label ?? '');
      if (label === '') {
        return;
      }

      if (suggestion.type === 'page' && !headingRendered && this.pagesHeading !== '') {
        // Non-interactive group label; excluded from the option set so it never
        // becomes an aria-activedescendant target.
        const heading = document.createElement('li');
        heading.className = 'tx-indexedsearch-suggest-heading';
        heading.setAttribute('role', 'presentation');
        heading.setAttribute('aria-hidden', 'true');
        heading.textContent = this.pagesHeading;
        this.listbox.append(heading);
        headingRendered = true;
      }

      const optionEl = document.createElement('li');
      optionEl.id = `${listboxId}-option-${index}`;
      optionEl.setAttribute('role', 'option');
      optionEl.setAttribute('aria-selected', 'false');
      optionEl.className = 'tx-indexedsearch-suggest-option';

      if (suggestion.type === 'page') {
        optionEl.classList.add('tx-indexedsearch-suggest-option-page');
        const title = document.createElement('span');
        title.className = 'tx-indexedsearch-suggest-title';
        title.textContent = label;
        optionEl.append(title);
        this.listbox.append(optionEl);
        const href = suggestion.url ? safeSameOriginHref(suggestion.url) : null;
        if (href) {
          this.options.push({ el: optionEl, url: href });
        } else {
          this.options.push({ el: optionEl, query: label });
        }
      } else {
        // The search-glyph is drawn via CSS (::before) so no markup is injected.
        optionEl.classList.add('tx-indexedsearch-suggest-option-word');
        const text = document.createElement('span');
        text.textContent = label;
        optionEl.append(text);
        this.listbox.append(optionEl);
        this.options.push({ el: optionEl, query: suggestion.query ?? label });
      }
    });

    if (this.options.length === 0) {
      this.close();
      this.announce(i18n.suggestNone);
      return;
    }

    this.open();
    const message = this.options.length === 1
      ? i18n.suggestOne
      : i18n.suggestMany.replace('{{count}}', String(this.options.length));
    this.announce(message);
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeydown(event) {
    const isOpen = this.input.getAttribute('aria-expanded') === 'true';

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen && this.options.length > 0) {
          this.open();
        }
        this.moveActive(1);
        break;
      case 'ArrowUp':
        if (!isOpen) {
          return;
        }
        event.preventDefault();
        this.moveActive(-1);
        break;
      case 'Enter':
        if (isOpen && this.activeIndex >= 0) {
          event.preventDefault();
          this.selectOption(this.activeIndex);
        }
        break;
      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          this.close();
        }
        break;
      case 'Tab':
        this.close();
        break;
      default:
        break;
    }
  }

  /**
   * @param {number} direction
   */
  moveActive(direction) {
    if (this.options.length === 0) {
      return;
    }
    const count = this.options.length;
    let next = this.activeIndex + direction;
    if (next < 0) {
      next = count - 1;
    } else if (next >= count) {
      next = 0;
    }
    this.setActive(next);
  }

  /**
   * @param {number} index
   */
  setActive(index) {
    this.options.forEach((option, i) => {
      const active = i === index;
      option.el.classList.toggle('is-active', active);
      option.el.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    this.activeIndex = index;
    const activeEl = this.options[index]?.el;
    if (activeEl) {
      this.input.setAttribute('aria-activedescendant', activeEl.id);
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }

  /**
   * @param {number} index
   */
  selectOption(index) {
    const option = this.options[index];
    if (!option) {
      return;
    }
    if (option.url) {
      this.close();
      window.location.assign(option.url);
      return;
    }
    if (option.query) {
      this.input.value = option.query;
      this.close();
      if (this.form) {
        if (typeof this.form.requestSubmit === 'function') {
          this.form.requestSubmit();
        } else {
          this.form.submit();
        }
      }
    }
  }

  open() {
    this.listbox.hidden = false;
    this.input.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.controller?.abort();
    this.listbox.hidden = true;
    this.input.setAttribute('aria-expanded', 'false');
    this.input.removeAttribute('aria-activedescendant');
    this.activeIndex = -1;
    this.options.forEach((option) => {
      option.el.classList.remove('is-active');
      option.el.setAttribute('aria-selected', 'false');
    });
  }

  /**
   * @param {string} message
   */
  announce(message) {
    this.status.textContent = message;
  }
}

function initSearchAutosuggest() {
  document.querySelectorAll('input[data-autosuggest-url]').forEach((input) => new Autosuggest(input));
}

initSearchAutosuggest();
