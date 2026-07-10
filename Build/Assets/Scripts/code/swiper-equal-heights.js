/**
 * Equalize Swiper slide heights: lock the container to the tallest slide, slides stay at 100%.
 * Percentage heights only resolve once the swiper root has an explicit pixel height.
 */
export function equalizeSwiperSlideHeights(swiper) {
  if (!swiper?.el || !swiper.slides?.length) {
    return;
  }

  if (swiper.el.classList.contains('gallery-thumbs-swiper')) {
    return;
  }

  if (swiper.el.classList.contains('gallery-swiper') && swiper.el.classList.contains('swiper-coverflow')) {
    return;
  }

  const { el, wrapperEl } = swiper;
  const slideEls = Array.from(swiper.slides);

  el.style.height = 'auto';
  if (wrapperEl) {
    wrapperEl.style.height = 'auto';
  }
  slideEls.forEach((slide) => {
    slide.style.height = 'auto';
  });

  const maxHeight = Math.max(0, ...slideEls.map((slide) => slide.offsetHeight));
  if (maxHeight <= 0) {
    return;
  }

  el.style.height = `${maxHeight}px`;
  el.classList.add('swiper-equal-heights');
  if (wrapperEl) {
    wrapperEl.style.height = '100%';
  }
  slideEls.forEach((slide) => {
    slide.style.height = '100%';
  });
}

/**
 * Measure after layout/images and re-run on resize or swiper updates.
 */
export function bindEqualSwiperSlideHeights(swiper) {
  if (!swiper?.el || swiper.el.classList.contains('gallery-thumbs-swiper')) {
    return;
  }

  if (swiper.el.classList.contains('gallery-swiper') && swiper.el.classList.contains('swiper-coverflow')) {
    return;
  }

  const schedule = () => {
    requestAnimationFrame(() => equalizeSwiperSlideHeights(swiper));
  };

  schedule();
  setTimeout(schedule, 100);
  setTimeout(schedule, 500);

  swiper.on('resize', schedule);
  swiper.on('update', schedule);
  swiper.on('slideChange', schedule);
  swiper.on('transitionEnd', schedule);

  swiper.el.querySelectorAll('img').forEach((img) => {
    if (!img.complete) {
      img.addEventListener('load', schedule, { once: true });
      img.addEventListener('error', schedule, { once: true });
    }
  });

  const resizeObserver = new ResizeObserver(schedule);
  resizeObserver.observe(swiper.el);
  swiper.on('destroy', () => resizeObserver.disconnect());
}
