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

  switches.forEach(switchEl => {
    if (switchEl.dataset.themeInitialized === '1') return;
    switchEl.dataset.themeInitialized = '1';

    switchEl.addEventListener('change', () => {
      setTheme(switchEl.checked ? 'dark' : 'light');
    });
  });

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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeSwitch);
} else {
  initThemeSwitch();
}

// Exposed for re-initialization after DOM restore (e.g. nav-toggle swaps)
if (typeof window !== 'undefined') {
  window.mpcInitThemeSwitch = initThemeSwitch;
}
