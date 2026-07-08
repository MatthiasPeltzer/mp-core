const html = document.documentElement;
const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * @param {string} theme - 'light' or 'dark'
 * @param {boolean} explicit - Whether this is an explicit user choice (persists to localStorage)
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

function getThemeSwitches() {
  return Array.from(document.querySelectorAll('#themeSwitch'));
}

function handleSystemPreferenceChange(e) {
  setTheme(e.matches ? 'dark' : 'light', false);
}

const storedTheme = localStorage.getItem('theme');

if (storedTheme) {
  setTheme(storedTheme.includes('dark') ? 'dark' : 'light');
} else {
  mediaQueryDark.addEventListener('change', handleSystemPreferenceChange);
  handleSystemPreferenceChange(mediaQueryDark);
}

/**
 * Safe to call multiple times — uses a data attribute to prevent double-binding.
 */
function initThemeSwitch() {
  const switches = getThemeSwitches();
  if (!switches.length) return;

  const isDark = html.getAttribute('data-bs-theme') === 'dark';

  switches.forEach(switchEl => {
    if (switchEl.dataset.themeInitialized === '1') return;
    switchEl.dataset.themeInitialized = '1';

    switchEl.checked = isDark;

    switchEl.addEventListener('change', () => {
      setTheme(switchEl.checked ? 'dark' : 'light');
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeSwitch);
} else {
  initThemeSwitch();
}

// Exposed for optional re-initialization when navigation markup is replaced dynamically.
if (typeof window !== 'undefined') {
  window.mpcInitThemeSwitch = initThemeSwitch;
}
