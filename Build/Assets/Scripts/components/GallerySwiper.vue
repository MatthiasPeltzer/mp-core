<script setup>
import { ref, computed, onBeforeMount, onMounted, nextTick, inject } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import {
  A11y,
  Autoplay,
  EffectCards,
  EffectCoverflow,
  EffectCreative,
  EffectCube,
  EffectFade,
  EffectFlip,
  FreeMode,
  Keyboard,
  Navigation,
  Pagination,
  Thumbs
} from 'swiper/modules';
import {
  prevSlideMessage,
  nextSlideMessage,
  firstSlideMessage,
  lastSlideMessage,
  paginationBulletMessage,
  slideLabelMessage,
  itemRoleDescriptionMessage,
  pauseAutoplayMessage,
  playAutoplayMessage
} from '../code/i18n.js';
import { bindEqualSwiperSlideHeights } from '../code/swiper-equal-heights.js';
import { bindSwiperEffectParams } from '../code/swiper-effect-params.js';
import { bindVidplySwiperLifecycle, notifyDynamicContentReady } from '../code/vidply-dynamic-content.js';

/** TYPO3 mount target injected by vue-initialisation.js (avoids DOM query races). */
const mountElement = inject('mpcMountElement', null);

// =============================================================================
// STATE
// =============================================================================

const mainSwiperRef = ref(null);
const thumbsSwiperRef = ref(null);
const autoplayPausedByUser = ref(false);
const slides = ref([]);
const config = ref({
  galleryId: 'default',
  layout: 'slider', // 'slider' or 'thumbs'
  effect: 'slide',
  columns: 1,
  spaceBetween: 10,
  loop: false,
  speed: 300,
  navigationEnabled: true,
  paginationEnabled: true,
  paginationType: 'bullets',
  paginationClickable: true,
  paginationDynamicBullets: false,
  autoplayEnabled: false,
  autoplayDelay: 3000,
  autoplayDisableOnInteraction: true,
  keyboardEnabled: true,
  fadeCrossFade: true,
  cubeShadow: true,
  cubeSlideShadows: true,
  coverflowRotate: 50,
  coverflowStretch: 0,
  coverflowDepth: 100,
  coverflowModifier: 1,
  thumbsPerView: 4,
  thumbsSpaceBetween: 10
});

// =============================================================================
// CONFIGURATION PARSING
// =============================================================================

function parseNumber(value, defaultValue = 0) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

function parseBool(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value === '1' || value === 'true' || value === 'yes';
  }
  return false;
}

function loadConfig(container) {
  if (!container) return;
  
  const dataAttrs = container.dataset;
  
  config.value = {
    galleryId: dataAttrs.galleryId || 'default',
    layout: dataAttrs.layout || 'slider',
    effect: dataAttrs.effect || 'slide',
    columns: parseNumber(dataAttrs.columns, 1),
    spaceBetween: parseNumber(dataAttrs.spaceBetween, 10),
    loop: parseBool(dataAttrs.loop),
    speed: parseNumber(dataAttrs.speed, 300),
    navigationEnabled: parseBool(dataAttrs.navigationEnabled ?? '1'),
    paginationEnabled: parseBool(dataAttrs.paginationEnabled ?? '1'),
    paginationType: dataAttrs.paginationType || 'bullets',
    paginationClickable: parseBool(dataAttrs.paginationClickable ?? '1'),
    paginationDynamicBullets: parseBool(dataAttrs.paginationDynamicBullets ?? '1'),
    autoplayEnabled: parseBool(dataAttrs.autoplayEnabled),
    autoplayDelay: parseNumber(dataAttrs.autoplayDelay, 3000),
    autoplayDisableOnInteraction: parseBool(dataAttrs.autoplayDisableOnInteraction ?? '1'),
    keyboardEnabled: parseBool(dataAttrs.keyboardEnabled ?? '1'),
    fadeCrossFade: parseBool(dataAttrs.fadeCrossFade ?? '1'),
    cubeShadow: parseBool(dataAttrs.cubeShadow ?? '1'),
    cubeSlideShadows: parseBool(dataAttrs.cubeSlideShadows ?? '1'),
    coverflowRotate: parseNumber(dataAttrs.coverflowRotate, 50),
    coverflowStretch: parseNumber(dataAttrs.coverflowStretch, 0),
    coverflowDepth: parseNumber(dataAttrs.coverflowDepth, 100),
    coverflowModifier: parseNumber(dataAttrs.coverflowModifier, 1),
    thumbsPerView: parseNumber(dataAttrs.thumbsPerView, 4),
    thumbsSpaceBetween: parseNumber(dataAttrs.thumbsSpaceBetween, 10)
  };
}

// =============================================================================
// SWIPER CONFIGURATION
// =============================================================================

const modules = computed(() => {
  const mods = [A11y, EffectFade, Keyboard, Pagination];
  if (config.value.layout === 'thumbs') {
    mods.push(Thumbs, FreeMode);
  }
  if (config.value.autoplayEnabled) {
    mods.push(Autoplay);
  }
  if (config.value.navigationEnabled) {
    mods.push(Navigation);
  }
  if (config.value.effect === 'cube') mods.push(EffectCube);
  if (config.value.effect === 'coverflow') mods.push(EffectCoverflow);
  if (config.value.effect === 'flip') mods.push(EffectFlip);
  if (config.value.effect === 'cards') mods.push(EffectCards);
  if (config.value.effect === 'creative') mods.push(EffectCreative);
  return mods;
});

const thumbsModules = [A11y, FreeMode];

const navigationConfig = computed(() => {
  if (!config.value.navigationEnabled) return false;
  return {
    nextEl: `.swiper-button-next[data-gallery-id="${config.value.galleryId}"]`,
    prevEl: `.swiper-button-prev[data-gallery-id="${config.value.galleryId}"]`
  };
});

const paginationConfig = computed(() => {
  if (!config.value.paginationEnabled) return false;
  return {
    el: `.swiper-pagination[data-gallery-id="${config.value.galleryId}"]`,
    type: config.value.paginationType,
    clickable: config.value.paginationClickable,
    dynamicBullets: config.value.paginationType === 'bullets' && config.value.paginationDynamicBullets
  };
});

const autoplayConfig = computed(() => {
  if (!config.value.autoplayEnabled) return false;
  return {
    delay: config.value.autoplayDelay,
    disableOnInteraction: config.value.autoplayDisableOnInteraction,
    pauseOnMouseEnter: true
  };
});

const keyboardConfig = computed(() => (
  config.value.keyboardEnabled ? { enabled: true } : false
));

// Coverflow needs narrower slides (slidesPerView auto) so side slides stay in view.
const mainSlidesPerView = computed(() => (
  config.value.effect === 'coverflow' ? 'auto' : 1
));

// Multi-column breakpoints apply only to the default slide effect.
const mainBreakpoints = computed(() => {
  if (config.value.effect !== 'slide') return undefined;

  const cols = config.value.columns;
  if (cols === 1) return undefined;
  
  if (cols === 2) {
    return {
      576: { slidesPerView: 2, slidesPerGroup: 2 }
    };
  }
  if (cols === 3) {
    return {
      576: { slidesPerView: 2, slidesPerGroup: 2 },
      992: { slidesPerView: 3, slidesPerGroup: 3 }
    };
  }
  if (cols >= 4) {
    return {
      576: { slidesPerView: 2, slidesPerGroup: 2 },
      992: { slidesPerView: 3, slidesPerGroup: 3 },
      1200: { slidesPerView: 4, slidesPerGroup: 4 }
    };
  }
  return undefined;
});

// Dynamic thumbs breakpoints based on config
const thumbsBreakpoints = computed(() => ({
  576: { slidesPerView: Math.min(config.value.thumbsPerView, 3) },
  992: { slidesPerView: config.value.thumbsPerView }
}));

// A11y configuration (with i18n translations)
const a11yConfig = computed(() => ({
  enabled: true,
  prevSlideMessage: prevSlideMessage,
  nextSlideMessage: nextSlideMessage,
  firstSlideMessage: firstSlideMessage,
  lastSlideMessage: lastSlideMessage,
  paginationBulletMessage: paginationBulletMessage,
  slideLabelMessage: slideLabelMessage,
  itemRoleDescriptionMessage: itemRoleDescriptionMessage
}));

// =============================================================================
// LIFECYCLE
// =============================================================================

onBeforeMount(() => {
  const element = mountElement;
  if (!element) {
    return;
  }

  // Try data attribute first
  const slidesDataAttr = element.getAttribute('data-slides-data');
  if (slidesDataAttr) {
    try {
      slides.value = JSON.parse(slidesDataAttr);
    } catch {
      // Failed to parse - will try DOM extraction
    }
  }

  // Fallback: extract from DOM
  if (slides.value.length === 0) {
    const slideElements = element.querySelectorAll('.gallery-slide-content');
    if (slideElements.length > 0) {
      slides.value = Array.from(slideElements).map((el, index) => ({
        id: index,
        content: el.innerHTML.trim(),
        thumbnail: el.dataset.thumbnail || ''
      }));
    }
  }

  loadConfig(element);

  if (element.hasAttribute('data-slides-data')) {
    element.removeAttribute('data-slides-data');
  }
});

onMounted(() => {
  nextTick(() => {
    notifyDynamicContentReady(mountElement);
  });
});

// =============================================================================
// EVENTS
// =============================================================================

function observeRedundantAria(swiper) {
  const wrapper = swiper.el?.closest('.gallery-swiper-wrapper') || swiper.el?.parentElement;
  if (!wrapper) return;
  new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'aria-disabled' && m.target.hasAttribute('disabled')) {
        m.target.removeAttribute('aria-disabled');
      }
    }
  }).observe(wrapper, { attributes: true, attributeFilter: ['aria-disabled'], subtree: true });
  wrapper.querySelectorAll('button[disabled][aria-disabled]')
    .forEach(btn => btn.removeAttribute('aria-disabled'));
}

function toggleAutoplay() {
  const swiper = mainSwiperRef.value;
  if (!swiper?.autoplay) return;

  if (!autoplayPausedByUser.value) {
    swiper.autoplay.stop();
    autoplayPausedByUser.value = true;
  } else {
    swiper.autoplay.start();
    autoplayPausedByUser.value = false;
  }
}

function bindAutoplayState(swiperInstance) {
  if (!config.value.autoplayEnabled || !swiperInstance.autoplay) return;

  // Only reflect explicit stops (pause button or disableOnInteraction).
  // Ignore autoplayPause/autoplayResume — Swiper fires those during transitions.
  swiperInstance.on('autoplayStop', () => {
    autoplayPausedByUser.value = true;
  });
  swiperInstance.on('autoplayStart', () => {
    autoplayPausedByUser.value = false;
  });
}

const onMainSwiper = (swiper) => {
  mainSwiperRef.value = swiper;
  observeRedundantAria(swiper);
  bindAutoplayState(swiper);
  bindSwiperEffectParams(swiper, config.value);
  if (config.value.effect !== 'coverflow') {
    bindEqualSwiperSlideHeights(swiper);
  }
  bindVidplySwiperLifecycle(swiper);
  notifyDynamicContentReady(mountElement);
};

const onThumbsSwiper = (swiper) => {
  thumbsSwiperRef.value = swiper;
};

// Note: Navigation is handled by Swiper's Navigation module via CSS selectors
// No manual slidePrev/slideNext handlers needed - Swiper handles button clicks automatically

// For thumbs layout, we need thumbs swiper ready first
const thumbsSwiper = computed(() => thumbsSwiperRef.value);
</script>

<template>
  <!-- SECURITY: All v-html bindings below render server-side TYPO3 Fluid output (trusted editors only).
       Never populate slides from untrusted user input without server-side sanitization. -->
  <div
    class="gallery-swiper-wrapper"
    :class="{ 'is-swiper-effect-coverflow': config.layout === 'slider' && config.effect === 'coverflow' }"
  >
    <!-- Thumbs layout: main swiper first, then thumbnails below -->
    <template v-if="config.layout === 'thumbs'">
      <!-- Thumbnails swiper (hidden, renders first for thumbs linking) -->
      <div class="gallery-thumbs-strip" style="order: 2;">
        <swiper
          :modules="thumbsModules"
          :a11y="a11yConfig"
          :slides-per-view="3"
          :space-between="config.thumbsSpaceBetween"
          :free-mode="true"
          :watch-slides-progress="true"
          :breakpoints="thumbsBreakpoints"
          @swiper="onThumbsSwiper"
          class="swiper gallery-thumbs-swiper"
        >
          <swiper-slide
            v-for="slide in slides"
            :key="`thumb-${slide.id}`"
            class="swiper-slide gallery-thumb-slide"
          >
            <div v-html="slide.thumbnail || slide.content" class="gallery-thumb-content"></div>
          </swiper-slide>
        </swiper>
      </div>
      
      <!-- Main swiper with thumbs -->
      <swiper
        v-if="thumbsSwiper"
        :modules="modules"
        :a11y="a11yConfig"
        :slides-per-view="1"
        :space-between="config.spaceBetween"
        :speed="config.speed"
        :loop="config.loop"
        :keyboard="keyboardConfig"
        :navigation="navigationConfig"
        :pagination="paginationConfig"
        :autoplay="autoplayConfig"
        :thumbs="{ swiper: thumbsSwiper }"
        @swiper="onMainSwiper"
        class="swiper gallery-main-swiper"
        style="order: 1;"
      >
        <swiper-slide
          v-for="slide in slides"
          :key="`main-${slide.id}`"
          class="swiper-slide"
        >
          <div v-html="slide.content"></div>
        </swiper-slide>
      </swiper>
    </template>
    
    <!-- Simple slider layout -->
    <template v-else>
      <swiper
        v-if="slides.length"
        :modules="modules"
        :a11y="a11yConfig"
        :effect="config.effect"
        :slides-per-view="mainSlidesPerView"
        :space-between="config.spaceBetween"
        :speed="config.speed"
        :loop="config.loop"
        :centered-slides="config.effect === 'coverflow'"
        :keyboard="keyboardConfig"
        :navigation="navigationConfig"
        :pagination="paginationConfig"
        :autoplay="autoplayConfig"
        :fade-effect="config.effect === 'fade' ? { crossFade: config.fadeCrossFade } : undefined"
        :cube-effect="config.effect === 'cube' ? {
          shadow: config.cubeShadow,
          slideShadows: config.cubeSlideShadows
        } : undefined"
        :coverflow-effect="config.effect === 'coverflow' ? {
          rotate: config.coverflowRotate,
          stretch: config.coverflowStretch,
          depth: config.coverflowDepth,
          modifier: config.coverflowModifier,
          scale: 0.86,
          slideShadows: false
        } : undefined"
        :breakpoints="mainBreakpoints"
        :grab-cursor="config.effect === 'slide' || config.effect === 'coverflow'"
        @swiper="onMainSwiper"
        class="swiper gallery-swiper"
      >
        <swiper-slide
          v-for="slide in slides"
          :key="slide.id"
          class="swiper-slide"
        >
          <div v-html="slide.content"></div>
        </swiper-slide>
      </swiper>
    </template>
    
    <!-- Navigation (shared for both layouts) -->
    <div v-if="config.navigationEnabled || config.paginationEnabled" class="swiper-navigation" style="order: 3;">
      <button
        v-if="config.navigationEnabled"
        type="button"
        class="swiper-button swiper-button-prev"
        :data-gallery-id="config.galleryId"
        :aria-label="prevSlideMessage"
      >
        <svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/>
        </svg>
      </button>
      
      <div
        v-if="config.paginationEnabled"
        class="swiper-pagination"
        :data-gallery-id="config.galleryId"
      ></div>
      
      <button
        v-if="config.navigationEnabled"
        type="button"
        class="swiper-button swiper-button-next"
        :data-gallery-id="config.galleryId"
        :aria-label="nextSlideMessage"
      >
        <svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/>
        </svg>
      </button>

      <button
        v-if="config.autoplayEnabled && config.navigationEnabled"
        type="button"
        class="swiper-button swiper-button-autoplay"
        :data-gallery-id="config.galleryId"
        :aria-label="autoplayPausedByUser ? playAutoplayMessage : pauseAutoplayMessage"
        :aria-pressed="!autoplayPausedByUser"
        @click="toggleAutoplay"
      >
        <svg
          v-if="!autoplayPausedByUser"
          class="swiper-navigation-icon"
          width="11"
          height="20"
          viewBox="0 0 11 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="1.5" y="3" width="3" height="14" fill="currentColor"/>
          <rect x="6.5" y="3" width="3" height="14" fill="currentColor"/>
        </svg>
        <svg
          v-else
          class="swiper-navigation-icon"
          width="11"
          height="20"
          viewBox="0 0 11 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M2 3.5L9.5 10L2 16.5V3.5Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<!-- 
  All Swiper styles are defined in vue.scss (single source of truth)
  This component only needs minimal scoped styles for its wrapper
-->
