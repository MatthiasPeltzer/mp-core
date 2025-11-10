const html = document.documentElement;
const mediaQueryColorDark = window.matchMedia('(prefers-color-scheme: dark)');

function getThemeSwitches() {
  return Array.from(document.querySelectorAll('#themeSwitch'));
}

function setTheme(theme) {
  html.setAttribute('data-bs-theme', theme);
  localStorage.setItem('theme', `theme-${theme}`);
  getThemeSwitches().forEach((el) => {
    el.checked = theme === 'dark';
  });
}

function mediaQueryColorDarkListener(e) {
  const theme = e.matches ? 'dark' : 'light';
  setTheme(theme);
}

// Apply stored or system theme immediately (no dependency on the switch existing)
const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  setTheme(storedTheme.includes('dark') ? 'dark' : 'light');
} else {
  mediaQueryColorDark.addEventListener('change', mediaQueryColorDarkListener);
  mediaQueryColorDarkListener(mediaQueryColorDark);
}

function initThemeSwitch() {
  const switches = getThemeSwitches();
  if (!switches.length) {
    return;
  }

  switches.forEach((switchTheme) => {
    if (switchTheme.dataset.themeInitialized === '1') {
      return;
    }
    switchTheme.dataset.themeInitialized = '1';

    switchTheme.addEventListener('change', () => {
      const newTheme = switchTheme.checked ? 'dark' : 'light';
      setTheme(newTheme);
    });
  });

  // Handle Enter key for form-check-input (bind once to document)
  if (!document.documentElement.dataset.themeKeybind) {
    document.documentElement.dataset.themeKeybind = '1';
    const formCheckInput = document.querySelector('.form-check-input');
    if (formCheckInput) {
      formCheckInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          formCheckInput.nextElementSibling?.click();
        }
      });
    }
  }
}

// init on load; safe if element not present
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeSwitch);
} else {
  initThemeSwitch();
}

// expose for re-init after DOM restore
if (typeof window !== 'undefined') {
  window.mpcInitThemeSwitch = initThemeSwitch;
}
