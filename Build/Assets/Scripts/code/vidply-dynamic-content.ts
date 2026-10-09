/**
 * Notify mpc-vidply that Vue/Swiper has injected slide HTML at runtime.
 * PlaylistInit and PrivacyLayer listen for this event and scan the subtree.
 */
import type { Swiper } from 'swiper'

type VidPlyInitApi = {
  scan?: (root: Element, options?: { includeDuplicateSlides?: boolean }) => void
  pauseOutside?: (root: Element) => void
}

type VidPlyPrivacyApi = {
  scanLayers?: (root: Element) => void
}

type VidPlyPlayer = {
  element?: Element
  pause?: () => void
}

type VidPlyThemeApi = {
  getPlayers?: () => VidPlyPlayer[]
}

function getVidPlyInit(): VidPlyInitApi | undefined {
  return window.VidPlyInit as VidPlyInitApi | undefined
}

function getVidPlyPrivacy(): VidPlyPrivacyApi | undefined {
  return window.VidPlyPrivacy as VidPlyPrivacyApi | undefined
}

function getVidPlyTheme(): VidPlyThemeApi | undefined {
  return window.VidPlyTheme as VidPlyThemeApi | undefined
}

export function notifyDynamicContentReady(root: Element | null | undefined): void {
  if (!(root instanceof Element)) {
    return
  }

  getVidPlyInit()?.scan?.(root)
  getVidPlyPrivacy()?.scanLayers?.(root)

  document.dispatchEvent(
    new CustomEvent('mpc:dynamic-content:ready', {
      detail: { root },
    }),
  )
}

/**
 * Pause VidPly players and native media inside the given container.
 */
export function pausePlayersInside(container: Element | null | undefined): void {
  if (!(container instanceof Element)) {
    return
  }

  getVidPlyTheme()
    ?.getPlayers?.()
    .forEach((player) => {
      const host = player?.element
      if (!host || !container.contains(host)) {
        return
      }

      try {
        player.pause?.()
      } catch {
        // Ignore pause errors during modal close.
      }
    })

  container.querySelectorAll('video, audio').forEach((media) => {
    if (media instanceof HTMLMediaElement) {
      media.pause()
    }
  })
}

/**
 * Pause VidPly players outside the active slide and init any player on it.
 */
export function bindVidplySwiperLifecycle(swiper: Swiper | null | undefined): void {
  if (!swiper?.slides?.length) {
    return
  }

  const syncActiveSlide = (): void => {
    const activeSlide = swiper.slides[swiper.activeIndex]
    if (!(activeSlide instanceof Element)) {
      return
    }

    getVidPlyInit()?.pauseOutside?.(activeSlide)
    getVidPlyInit()?.scan?.(activeSlide, { includeDuplicateSlides: true })
  }

  swiper.on('slideChangeTransitionEnd', syncActiveSlide)
  syncActiveSlide()
}
