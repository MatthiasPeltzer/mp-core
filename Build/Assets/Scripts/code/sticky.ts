import BaseComponent from 'bootstrap/js/dist/base-component.js'

const NAME = 'stickyHeader'

const Default = {
  breakpoint: '(min-width: 62rem)'
} as const

type StickyHeaderConfig = {
  breakpoint: string
}

class StickyHeader extends BaseComponent {
  static NAME = NAME

  static get Default() {
    return Default
  }

  protected declare _config: StickyHeaderConfig
  protected declare _body: HTMLElement
  protected declare _toplogo: HTMLElement | null
  protected _headerHeight = 0
  protected _toplogoHeight = 0
  protected _ticking = false

  constructor(element: HTMLElement, config?: Partial<StickyHeaderConfig>) {
    super(element, config)
    this._body = document.body
    this._toplogo = element.querySelector('.toplogo-container')
    this._headerHeight = element.offsetHeight
    this._toplogoHeight = this._toplogo?.offsetHeight ?? 0

    window.addEventListener('scroll', () => this._onScroll(), { passive: true })

    requestAnimationFrame(() => {
      this._measureToplogo()
      this._handleScroll()
    })

    this._initResponsivePadding()

    if (this._toplogo) {
      new ResizeObserver(() => this._measureToplogo()).observe(this._toplogo)
    }
  }

  protected _onScroll(): void {
    if (this._ticking) return
    this._ticking = true
    requestAnimationFrame(() => {
      this._handleScroll()
      this._ticking = false
    })
  }

  protected _handleScroll(): void {
    const scrollY = window.scrollY
    if (this._toplogo && this._toplogoHeight > 0) {
      const offset = Math.min(scrollY, this._toplogoHeight + 17)
      this._toplogo.style.marginTop = `${-offset / 16}rem`
    }
    const threshold = this._toplogoHeight > 0 ? this._toplogoHeight : this._headerHeight
    this._body.classList.toggle('sticky', scrollY >= threshold)
  }

  protected _measureToplogo(): void {
    if (this._toplogo) {
      this._toplogoHeight = this._toplogo.offsetHeight
    }
  }

  protected _updatePadding(): void {
    this._headerHeight = this._element.offsetHeight
    this._body.style.paddingTop = `${this._headerHeight / 16}rem`
    this._measureToplogo()
  }

  protected _initResponsivePadding(): void {
    const mediaQuery = window.matchMedia(this._config.breakpoint)

    const handleMediaChange = (): void => {
      setTimeout(() => this._updatePadding(), 50)
    }

    handleMediaChange()
    mediaQuery.addEventListener('change', handleMediaChange)
  }
}

const header = document.querySelector('.header-wrapper-bg')
if (header instanceof HTMLElement) {
  StickyHeader.getOrCreateInstance(header)
}

export default StickyHeader
