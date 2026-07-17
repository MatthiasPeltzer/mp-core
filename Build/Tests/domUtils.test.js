import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce, toggleNavState } from '../Assets/Scripts/code/Utils/domUtils.js';

describe('domUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounce delays function execution', () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 100);

    debounced();
    debounced();
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('toggleNavState updates body and toggler labels', () => {
    document.body.innerHTML = `
      <div id="header"></div>
      <button id="toggler" title="open"></button>
      <span id="toggler-text"></span>
    `;

    const body = document.body;
    const headerWrapper = document.getElementById('header');
    const navbarToggler = document.getElementById('toggler');
    const navbarTogglerText = document.getElementById('toggler-text');

    toggleNavState(true, body, headerWrapper, navbarToggler, navbarTogglerText, 'Open', 'Close', 'open', 'close');

    expect(body.classList.contains('active-nav-body')).toBe(true);
    expect(headerWrapper?.classList.contains('active-nav')).toBe(true);
    expect(navbarToggler?.getAttribute('title')).toBe('Close');
    expect(navbarTogglerText?.textContent).toBe('close');
  });
});
