/**
 * Notify mpc-vidply that Vue/Swiper has injected slide HTML at runtime.
 * PlaylistInit and PrivacyLayer listen for this event and scan the subtree.
 *
 * @param {Element | null | undefined} root
 */
export function notifyDynamicContentReady(root) {
  if (!(root instanceof Element)) {
    return;
  }

  window.VidPlyInit?.scan?.(root);
  window.VidPlyPrivacy?.scanLayers?.(root);

  document.dispatchEvent(new CustomEvent('mpc:dynamic-content:ready', {
    detail: { root }
  }));
}

/**
 * Pause VidPly players outside the active slide and init any player on it.
 *
 * @param {import('swiper').Swiper | null | undefined} swiper
 */
export function bindVidplySwiperLifecycle(swiper) {
  if (!swiper?.slides?.length) {
    return;
  }

  const syncActiveSlide = () => {
    const activeSlide = swiper.slides[swiper.activeIndex];
    if (!(activeSlide instanceof Element)) {
      return;
    }

    window.VidPlyInit?.pauseOutside?.(activeSlide);
    window.VidPlyInit?.scan?.(activeSlide, { includeDuplicateSlides: true });
  };

  swiper.on('slideChangeTransitionEnd', syncActiveSlide);
  syncActiveSlide();
}
