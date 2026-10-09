import BaseComponent from 'bootstrap/js/dist/base-component.js'

const NAME = 'totop'

const Default = {} as const

type TotopConfig = Record<string, never>

class Totop extends BaseComponent {
  static NAME = NAME

  static get Default() {
    return Default
  }

  protected declare _config: TotopConfig
  protected declare _bg: HTMLElement
  protected _ticking = false

  constructor(element: HTMLElement, config?: Partial<TotopConfig>) {
    super(element, config)
    const bg = element.querySelector('.bg')
    if (!(bg instanceof HTMLElement)) {
      return
    }
    this._bg = bg
    window.addEventListener('scroll', () => this._onScroll(), { passive: true })
  }

  protected _onScroll(): void {
    if (this._ticking) return
    this._ticking = true
    window.requestAnimationFrame(() => {
      this._handleScroll()
      this._ticking = false
    })
  }

  protected _handleScroll(): void {
    const docHeight = document.body.offsetHeight
    const winHeight = window.innerHeight
    const maxScrollHeight = docHeight - winHeight
    const scrollTop = window.scrollY

    const scrollPercent = maxScrollHeight > 0 ? scrollTop / maxScrollHeight : 0
    const degrees = scrollPercent * 360

    this._bg.style.background = `#fff conic-gradient(var(--primary-base) ${degrees}deg, #fff ${degrees}deg) center center / 60px`
    this._element.classList.toggle('on', scrollTop > 250)
  }
}

document.querySelectorAll('.totop').forEach(el => {
  if (el instanceof HTMLElement) {
    Totop.getOrCreateInstance(el)
  }
})

export default Totop
