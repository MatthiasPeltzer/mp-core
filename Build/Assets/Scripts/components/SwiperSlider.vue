<script setup>
import { ref, computed, onBeforeMount, nextTick, getCurrentInstance } from 'vue';
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

// Swiper CSS is imported in vue.js entry point (swiper/css/bundle)
// This ensures all Swiper CSS is bundled into vue.css

// =============================================================================
// CONFIGURATION
// =============================================================================

// No props needed - we read everything from data attributes
const props = defineProps({});

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
 */
function parseNumber(value, defaultValue = 0) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
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
  
  config.value = {
    effect: dataAttrs.effect || 'slide',
    slidesPerView: parseNumber(dataAttrs.slidesPerView, 1),
    spaceBetween: parseNumber(dataAttrs.spaceBetween, 0),
    slidesPerGroup: parseNumber(dataAttrs.slidesPerGroup, 1),
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
  // Navigation handled manually via @click handlers - don't use Swiper's Navigation module
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
    return JSON.parse(config.value.breakpoints);
  } catch (e) {
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
  // Get the instance to access the mounting element
  const instance = getCurrentInstance();
  if (!instance) {
    return;
  }
  
  // The element Vue is mounting to (the one with data-container="vue")
  // In Vue 3, we can access it via the vnode's el property, but it might not be set yet
  // So we'll use the parent element or find it by data attributes
  let element = null;
  
  // Try to get from instance vnode
  if (instance.vnode?.el) {
    element = instance.vnode.el;
  }
  
  // Fallback: find by data attributes
  if (!element) {
    const allContainers = document.querySelectorAll('[data-container="vue"][data-component="SwiperSlider"]');
    // Find one that has slides data attribute (set by initialization)
    element = Array.from(allContainers).find(el => el.hasAttribute('data-slides-data'));
    // Or find one that still has slide content
    if (!element) {
      element = Array.from(allContainers).find(el => 
        el.querySelectorAll('.swiper-slide-content').length > 0
      );
    }
    // Last resort: use first one
    if (!element && allContainers.length > 0) {
      element = allContainers[0];
    }
  }
  
  if (element) {
    // Try to get slides from data attribute first (set by initialization)
    const slidesDataAttr = element.getAttribute('data-slides-data');
    if (slidesDataAttr) {
      try {
        const parsedSlides = JSON.parse(slidesDataAttr);
        slides.value = parsedSlides.map(slide => ({
          id: slide.id,
          content: slide.content.trim()
        }));
      } catch (e) {
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
  }
});

// =============================================================================
// EVENTS
// =============================================================================

const onSwiper = (swiperInstance) => {
  swiperRef.value = swiperInstance;
};

const onSlideChange = () => {
  // Handle slide change if needed
};

const onTransitionEnd = () => {
  // Transition end handler - helps ensure fade effect animations complete properly
};

// Manual navigation handlers
const slidePrev = () => {
  if (swiperRef.value) {
    swiperRef.value.slidePrev();
  }
};

const slideNext = () => {
  if (swiperRef.value) {
    swiperRef.value.slideNext();
  }
};
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
      :navigation="false"
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
      @slideChange="onSlideChange"
      @transitionEnd="onTransitionEnd"
      class="swiper"
    >
      <swiper-slide
        v-for="slide in slides"
        :key="slide.id"
        class="swiper-slide"
      >
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
        @click.prevent.stop="slidePrev"
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
        @click.prevent.stop="slideNext"
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
