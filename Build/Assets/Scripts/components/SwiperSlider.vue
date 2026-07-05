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
  Grid,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
  Scrollbar,
  Zoom
} from 'swiper/modules';
import {
  prevSlideMessage,
  nextSlideMessage,
  firstSlideMessage,
  lastSlideMessage,
  paginationBulletMessage,
  slideLabelMessage,
  itemRoleDescriptionMessage
} from '../code/i18n.js';
import { bindEqualSwiperSlideHeights } from '../code/swiper-equal-heights.js';
import { bindVidplySwiperLifecycle, notifyDynamicContentReady } from '../code/vidply-dynamic-content.js';

// Swiper CSS is imported in vue.js entry point (swiper/css/bundle)
// This ensures all Swiper CSS is bundled into vue.css

// =============================================================================
// CONFIGURATION
// =============================================================================

// No props needed - we read everything from data attributes
defineProps({});

/** TYPO3 mount target injected by vue-initialisation.js (avoids DOM query races). */
const mountElement = inject('mpcMountElement', null);

// =============================================================================
// STATE
// =============================================================================

const swiperRef = ref(null);
const containerRef = ref(null);
const navigationNextRef = ref(null);
const navigationPrevRef = ref(null);
const paginationRef = ref(null);
const scrollbarRef = ref(null);
const slides = ref([]);
const config = ref({
  effect: 'slide',
  slidesPerView: 1,
  spaceBetween: 0,
  slidesPerGroup: 1,
  loop: false,
  speed: 300,
  autoplayEnabled: false,
  autoplayDelay: 3000,
  autoplayDisableOnInteraction: true,
  navigationEnabled: true,
  paginationEnabled: true,
  paginationType: 'bullets',
  paginationClickable: false,
  paginationDynamicBullets: false,
  scrollbarEnabled: false,
  scrollbarDraggable: true,
  keyboardEnabled: true,
  mousewheelEnabled: false,
  freeModeEnabled: false,
  zoomEnabled: false,
  fadeCrossFade: true,
  cubeShadow: true,
  cubeSlideShadows: true,
  coverflowRotate: 50,
  coverflowStretch: 0,
  coverflowDepth: 100,
  coverflowModifier: 1,
  containerClass: '',
  breakpoints: '',
  sliderId: 'default'
});

// =============================================================================
// CONFIGURATION PARSING
// =============================================================================

/**
 * Parse boolean from string or return boolean
 */
function parseBool(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value === '1' || value === 'true' || value === 'yes';
  }
  return false;
}

/**
 * Parse number from string or return number
 * Also handles special 'auto' value for slidesPerView
 */
function parseNumber(value, defaultValue = 0) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Handle 'auto' as a special case (used by Swiper for slidesPerView)
    if (value.toLowerCase() === 'auto') return 'auto';
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

/**
 * Parse slidesPerView which can be a number or 'auto'
 */
function parseSlidesPerView(value, defaultValue = 1) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'auto') return 'auto';
    const parsed = parseFloat(value); // Use parseFloat to support decimals like 1.5
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

/**
 * Load configuration from data attributes
 * @param {HTMLElement} container - The container element (Vue root)
 */
function loadConfig(container) {
  if (!container) return;

  // Read all data attributes
  const dataAttrs = container.dataset;
  
  // Parse slidesPerView first as slidesPerGroup may depend on it
  const slidesPerView = parseSlidesPerView(dataAttrs.slidesPerView, 1);
  
  // slidesPerGroup defaults to 1, but can be explicitly set
  // This ensures when slidesPerView=1, only 1 slide moves at a time
  const slidesPerGroup = dataAttrs.slidesPerGroup 
    ? parseNumber(dataAttrs.slidesPerGroup, 1)
    : 1; // Always default to 1 to ensure predictable navigation
  
  config.value = {
    effect: dataAttrs.effect || 'slide',
    slidesPerView: slidesPerView,
    spaceBetween: parseNumber(dataAttrs.spaceBetween, 0),
    slidesPerGroup: slidesPerGroup,
    loop: parseBool(dataAttrs.loop),
    speed: parseNumber(dataAttrs.speed, 300),
    autoplayEnabled: parseBool(dataAttrs.autoplayEnabled),
    autoplayDelay: parseNumber(dataAttrs.autoplayDelay, 3000),
    autoplayDisableOnInteraction: parseBool(dataAttrs.autoplayDisableOnInteraction ?? '1'),
    autoplayPauseOnMouseEnter: parseBool(dataAttrs.autoplayPauseOnMouseEnter),
    navigationEnabled: parseBool(dataAttrs.navigationEnabled ?? '1'),
    paginationEnabled: parseBool(dataAttrs.paginationEnabled ?? '1'),
    paginationType: dataAttrs.paginationType || 'bullets',
    paginationClickable: parseBool(dataAttrs.paginationClickable),
    paginationDynamicBullets: parseBool(dataAttrs.paginationDynamicBullets),
    scrollbarEnabled: parseBool(dataAttrs.scrollbarEnabled),
    scrollbarDraggable: parseBool(dataAttrs.scrollbarDraggable ?? '1'),
    keyboardEnabled: parseBool(dataAttrs.keyboardEnabled ?? '1'),
    mousewheelEnabled: parseBool(dataAttrs.mousewheelEnabled),
    mousewheelForceToAxis: parseBool(dataAttrs.mousewheelForceToAxis),
    gridEnabled: parseBool(dataAttrs.gridEnabled),
    gridRows: parseNumber(dataAttrs.gridRows, 1),
    freeModeEnabled: parseBool(dataAttrs.freeModeEnabled),
    freeModeSticky: parseBool(dataAttrs.freeModeSticky),
    zoomEnabled: parseBool(dataAttrs.zoomEnabled),
    zoomMaxRatio: parseNumber(dataAttrs.zoomMaxRatio, 3),
    fadeCrossFade: parseBool(dataAttrs.fadeCrossFade ?? '1'),
    cubeShadow: parseBool(dataAttrs.cubeShadow ?? '1'),
    cubeSlideShadows: parseBool(dataAttrs.cubeSlideShadows ?? '1'),
    coverflowRotate: parseNumber(dataAttrs.coverflowRotate, 50),
    coverflowStretch: parseNumber(dataAttrs.coverflowStretch, 0),
    coverflowDepth: parseNumber(dataAttrs.coverflowDepth, 100),
    coverflowModifier: parseNumber(dataAttrs.coverflowModifier, 1),
    containerClass: dataAttrs.containerClass || '',
    breakpoints: dataAttrs.breakpoints || '',
    sliderId: dataAttrs.sliderId || 'default'
  };
}

// =============================================================================
// SWIPER MODULES
// =============================================================================

const modules = computed(() => {
  const activeModules = [A11y]; // Always include A11y for accessibility

  if (config.value.autoplayEnabled) activeModules.push(Autoplay);
  if (config.value.navigationEnabled) activeModules.push(Navigation);
  if (config.value.paginationEnabled) activeModules.push(Pagination);
  if (config.value.scrollbarEnabled) activeModules.push(Scrollbar);
  if (config.value.keyboardEnabled) activeModules.push(Keyboard);
  if (config.value.mousewheelEnabled) activeModules.push(Mousewheel);
  if (config.value.gridEnabled) activeModules.push(Grid);
  if (config.value.freeModeEnabled) activeModules.push(FreeMode);
  if (config.value.zoomEnabled) activeModules.push(Zoom);

  // Effect modules - always include EffectFade as it's commonly used
  activeModules.push(EffectFade);
  if (config.value.effect === 'cube') activeModules.push(EffectCube);
  if (config.value.effect === 'coverflow') activeModules.push(EffectCoverflow);
  if (config.value.effect === 'flip') activeModules.push(EffectFlip);
  if (config.value.effect === 'cards') activeModules.push(EffectCards);
  if (config.value.effect === 'creative') activeModules.push(EffectCreative);

  return activeModules;
});

// =============================================================================
// BREAKPOINTS
// =============================================================================

const breakpoints = computed(() => {
  if (!config.value.breakpoints) return undefined;
  try {
    const parsed = JSON.parse(config.value.breakpoints);
    
    // Ensure each breakpoint has slidesPerGroup set to 1 if slidesPerView is set
    // but slidesPerGroup is not explicitly defined
    // This prevents the issue where slidesPerView changes but slidesPerGroup doesn't
    Object.keys(parsed).forEach(key => {
      const bp = parsed[key];
      if (bp.slidesPerView !== undefined && bp.slidesPerGroup === undefined) {
        // Default to 1 slide per group for predictable navigation
        bp.slidesPerGroup = 1;
      }
    });
    
    return parsed;
  } catch {
    return undefined;
  }
});


// =============================================================================
// NAVIGATION / PAGINATION / SCROLLBAR CONFIG (using CSS selectors for stability)
// =============================================================================

const navigationConfig = computed(() => {
  if (!config.value.navigationEnabled) return false;
  const sliderId = config.value.sliderId || 'default';
  return {
    nextEl: `.swiper-button-next[data-slider-id="${sliderId}"]`,
    prevEl: `.swiper-button-prev[data-slider-id="${sliderId}"]`
  };
});

const paginationSelectorConfig = computed(() => {
  if (!config.value.paginationEnabled) return false;
  const sliderId = config.value.sliderId || 'default';
  return {
    el: `.swiper-pagination[data-slider-id="${sliderId}"]`,
    type: config.value.paginationType || 'bullets',
    clickable: config.value.paginationClickable,
    dynamicBullets: config.value.paginationDynamicBullets
  };
});

const scrollbarConfig = computed(() => {
  if (!config.value.scrollbarEnabled) return false;
  const sliderId = config.value.sliderId || 'default';
  return {
    el: `.swiper-scrollbar[data-slider-id="${sliderId}"]`,
    draggable: config.value.scrollbarDraggable
  };
});

// =============================================================================
// A11Y CONFIGURATION (with i18n translations)
// =============================================================================

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

// Extract slides and config before Vue renders
onBeforeMount(() => {
  const element = mountElement;
  if (!element) {
    return;
  }

  // Try to get slides from data attribute first (set by initialization)
  const slidesDataAttr = element.getAttribute('data-slides-data');
  if (slidesDataAttr) {
    try {
      const parsedSlides = JSON.parse(slidesDataAttr);
      slides.value = parsedSlides.map(slide => ({
        id: slide.id,
        content: slide.content.trim()
      }));
    } catch {
      // Failed to parse slides data - will try DOM extraction
    }
  }

  // Fallback: extract from DOM if data attribute not available
  if (slides.value.length === 0) {
    const slideElements = element.querySelectorAll('.swiper-slide-content');
    if (slideElements.length > 0) {
      slides.value = Array.from(slideElements).map((el, index) => {
        const content = el.innerHTML.trim();
        return {
          id: index,
          content: content
        };
      });
    }
  }

  // Load config from the element's data attributes
  loadConfig(element);

  // Clean up the data attribute after use
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
  const wrapper = swiper.el?.closest('.swiper-vue-wrapper') || swiper.el?.parentElement;
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

const onSwiper = (swiperInstance) => {
  swiperRef.value = swiperInstance;
  observeRedundantAria(swiperInstance);
  bindEqualSwiperSlideHeights(swiperInstance);
  bindVidplySwiperLifecycle(swiperInstance);
  notifyDynamicContentReady(mountElement);
};

// Note: Navigation is handled by Swiper's Navigation module via CSS selectors
// No manual slidePrev/slideNext handlers needed - Swiper handles button clicks automatically
</script>

<template>
  <div ref="containerRef" :class="['swiper-vue-wrapper', config.containerClass]">
    <swiper
      v-if="slides.length"
      :modules="modules"
      :a11y="a11yConfig"
      :effect="config.effect"
      :slides-per-view="config.slidesPerView"
      :space-between="config.spaceBetween"
      :slides-per-group="config.slidesPerGroup"
      :loop="config.loop"
      :speed="config.speed"
      :autoplay="config.autoplayEnabled ? {
        delay: config.autoplayDelay,
        disableOnInteraction: config.autoplayDisableOnInteraction,
        pauseOnMouseEnter: config.autoplayPauseOnMouseEnter
      } : false"
      :navigation="navigationConfig"
      :pagination="paginationSelectorConfig"
      :scrollbar="scrollbarConfig"
      :keyboard="config.keyboardEnabled ? { enabled: true } : false"
      :mousewheel="config.mousewheelEnabled ? {
        forceToAxis: config.mousewheelForceToAxis
      } : false"
      :grid="config.gridEnabled ? { rows: config.gridRows } : undefined"
      :free-mode="config.freeModeEnabled ? {
        enabled: true,
        sticky: config.freeModeSticky
      } : false"
      :zoom="config.zoomEnabled ? {
        enabled: true,
        maxRatio: config.zoomMaxRatio
      } : false"
      :fade-effect="config.effect === 'fade' ? {
        crossFade: config.fadeCrossFade
      } : undefined"
      :cube-effect="config.effect === 'cube' ? {
        shadow: config.cubeShadow,
        slideShadows: config.cubeSlideShadows
      } : undefined"
      :coverflow-effect="config.effect === 'coverflow' ? {
        rotate: config.coverflowRotate,
        stretch: config.coverflowStretch,
        depth: config.coverflowDepth,
        modifier: config.coverflowModifier
      } : undefined"
      :breakpoints="breakpoints"
      @swiper="onSwiper"
      class="swiper"
    >
      <swiper-slide
        v-for="slide in slides"
        :key="slide.id"
        class="swiper-slide"
      >
        <!-- SECURITY: slide.content originates from server-rendered TYPO3 Fluid output (trusted editors only).
             Never populate slides from untrusted user input without server-side sanitization. -->
        <div v-html="slide.content"></div>
      </swiper-slide>
    </swiper>

    <!-- Navigation buttons and pagination - placed AFTER swiper so they appear below -->
    <div
      v-if="config.navigationEnabled || config.paginationEnabled"
      class="swiper-navigation"
    >
      <button
        v-if="config.navigationEnabled"
        ref="navigationPrevRef"
        type="button"
        class="swiper-button swiper-button-prev"
        :data-slider-id="config.sliderId || 'default'"
        :aria-label="prevSlideMessage"
      >
        <svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/>
        </svg>
      </button>

      <div
        v-if="config.paginationEnabled"
        ref="paginationRef"
        class="swiper-pagination"
        :data-slider-id="config.sliderId || 'default'"
      ></div>

      <button
        v-if="config.navigationEnabled"
        ref="navigationNextRef"
        type="button"
        class="swiper-button swiper-button-next"
        :data-slider-id="config.sliderId || 'default'"
        :aria-label="nextSlideMessage"
      >
        <svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/>
        </svg>
      </button>
    </div>

    <!-- Scrollbar -->
    <div
      v-if="config.scrollbarEnabled"
      ref="scrollbarRef"
      class="swiper-scrollbar"
      :data-slider-id="config.sliderId || 'default'"
    ></div>
  </div>
</template>

<!-- 
  All Swiper styles are defined in vue.scss (single source of truth)
  This component only needs minimal scoped styles for its wrapper
-->
