const html = document.documentElement
const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)')

function setTheme(theme: 'light' | 'dark', explicit = true): void {
  html.setAttribute('data-bs-theme', theme)
  if (explicit) {
    localStorage.setItem('theme', `theme-${theme}`)
    mediaQueryDark.removeEventListener('change', handleSystemPreferenceChange)
  }

  getThemeSwitches().forEach(el => {
    el.checked = theme === 'dark'
  })
}

function getThemeSwitches(): HTMLInputElement[] {
  return [...document.querySelectorAll('#themeSwitch')].filter(
    (el): el is HTMLInputElement => el instanceof HTMLInputElement
  )
}

function handleSystemPreferenceChange(e: MediaQueryList | MediaQueryListEvent): void {
  const matches = 'matches' in e ? e.matches : mediaQueryDark.matches
  setTheme(matches ? 'dark' : 'light', false)
}

const storedTheme = localStorage.getItem('theme')

if (storedTheme) {
  setTheme(storedTheme.includes('dark') ? 'dark' : 'light')
} else {
  mediaQueryDark.addEventListener('change', handleSystemPreferenceChange)
  handleSystemPreferenceChange(mediaQueryDark)
}

function initThemeSwitch(): void {
  const switches = getThemeSwitches()
  if (!switches.length) return

  const isDark = html.getAttribute('data-bs-theme') === 'dark'

  switches.forEach(switchEl => {
    if (switchEl.dataset.themeInitialized === '1') return
    switchEl.dataset.themeInitialized = '1'

    switchEl.checked = isDark

    switchEl.addEventListener('change', () => {
      setTheme(switchEl.checked ? 'dark' : 'light')
    })
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeSwitch)
} else {
  initThemeSwitch()
}

window.mpcInitThemeSwitch = initThemeSwitch
