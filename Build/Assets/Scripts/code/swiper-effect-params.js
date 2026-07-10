/**
 * Swiper Vue passes partial effect option objects; module defaults win for missing keys.
 * Apply full effect params after init so coverflow/cube/fade behave as configured.
 */
export function applySwiperEffectParams(swiper, config) {
  if (!swiper?.params || !config?.effect) {
    return;
  }

  const { effect } = config;
  let needsTranslate = false;

  if (effect === 'coverflow') {
    if (!swiper.params.coverflowEffect) {
      swiper.params.coverflowEffect = {};
    }
    Object.assign(swiper.params.coverflowEffect, {
      rotate: config.coverflowRotate ?? 50,
      stretch: config.coverflowStretch ?? 0,
      depth: config.coverflowDepth ?? 100,
      modifier: config.coverflowModifier ?? 1,
      scale: config.coverflowScale ?? 0.86,
      slideShadows: false,
    });
    swiper.slides?.forEach((slideEl) => {
      slideEl
        .querySelectorAll('.swiper-slide-shadow-left, .swiper-slide-shadow-right, .swiper-slide-shadow-top, .swiper-slide-shadow-bottom')
        .forEach((shadowEl) => shadowEl.remove());
    });
    needsTranslate = true;
  }

  if (effect === 'cube') {
    if (!swiper.params.cubeEffect) {
      swiper.params.cubeEffect = {};
    }
    Object.assign(swiper.params.cubeEffect, {
      shadow: config.cubeShadow !== false,
      slideShadows: config.cubeSlideShadows !== false,
    });
    needsTranslate = true;
  }

  if (effect === 'fade') {
    if (!swiper.params.fadeEffect) {
      swiper.params.fadeEffect = {};
    }
    Object.assign(swiper.params.fadeEffect, {
      crossFade: config.fadeCrossFade !== false,
    });
    needsTranslate = true;
  }

  if (needsTranslate) {
    swiper.updateSize();
    swiper.updateSlides();
    swiper.emit('setTranslate');
  } else {
    swiper.update();
  }
}

export function bindSwiperEffectParams(swiper, config) {
  if (!swiper?.params) {
    return;
  }

  const apply = () => applySwiperEffectParams(swiper, config);

  apply();
  swiper.on('afterInit', apply);
  swiper.on('resize', apply);
}
