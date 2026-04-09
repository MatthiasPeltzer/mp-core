/**
 * Theme Switcher Module
 * Manages light/dark theme switching with localStorage persistence
 * Respects system preference when no stored preference exists
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const html = document.documentElement;
const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Gets all theme switch elements
 * @returns {HTMLElement[]} Array of switch elements
 */
function getThemeSwitches() {
  return Array.from(document.querySelectorAll('#themeSwitch'));
}

/**
 * Sets the current theme
 * @param {string} theme - 'light' or 'dark'
 * @param {boolean} [explicit=true] - Whether this is an explicit user choice
 */
function setTheme(theme, explicit = true) {
  html.setAttribute('data-bs-theme', theme);
  if (explicit) {
    localStorage.setItem('theme', `theme-${theme}`);
    mediaQueryDark.removeEventListener('change', handleSystemPreferenceChange);
  }
  
  getThemeSwitches().forEach(el => {
    el.checked = theme === 'dark';
  });
}

/**
 * Handles system preference changes (only active when no explicit user choice)
 * @param {MediaQueryListEvent} e - Media query change event
 */
function handleSystemPreferenceChange(e) {
  setTheme(e.matches ? 'dark' : 'light', false);
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Apply stored or system theme immediately
const storedTheme = localStorage.getItem('theme');

if (storedTheme) {
  setTheme(storedTheme.includes('dark') ? 'dark' : 'light');
} else {
  mediaQueryDark.addEventListener('change', handleSystemPreferenceChange);
  handleSystemPreferenceChange(mediaQueryDark);
}

/**
 * Initializes theme switch elements
 * Safe to call multiple times (uses data attribute to prevent double-binding)
 */
function initThemeSwitch() {
  const switches = getThemeSwitches();
  if (!switches.length) return;

  switches.forEach(switchEl => {
    if (switchEl.dataset.themeInitialized === '1') return;
    switchEl.dataset.themeInitialized = '1';

    switchEl.addEventListener('change', () => {
      setTheme(switchEl.checked ? 'dark' : 'light');
    });
  });

  // Keyboard support for Enter key on all theme switches
  if (!html.dataset.themeKeybind) {
    html.dataset.themeKeybind = '1';

    switches.forEach(switchEl => {
      switchEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          switchEl.checked = !switchEl.checked;
          setTheme(switchEl.checked ? 'dark' : 'light');
        }
      });
    });
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeSwitch);
} else {
  initThemeSwitch();
}

// Expose for re-initialization after DOM restore
if (typeof window !== 'undefined') {
  window.mpcInitThemeSwitch = initThemeSwitch;
}
