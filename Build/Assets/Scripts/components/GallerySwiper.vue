<script setup>
import { ref, computed, onBeforeMount, getCurrentInstance } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import {
  A11y,
  Autoplay,
  EffectFade,
  FreeMode,
  Keyboard,
  Navigation,
  Pagination,
  Thumbs
} from 'swiper/modules';

// =============================================================================
// STATE
// =============================================================================

const mainSwiperRef = ref(null);
const thumbsSwiperRef = ref(null);
const slides = ref([]);
const config = ref({
  galleryId: 'default',
  layout: 'slider', // 'slider' or 'thumbs'
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
    thumbsPerView: parseNumber(dataAttrs.thumbsPerView, 4),
    thumbsSpaceBetween: parseNumber(dataAttrs.thumbsSpaceBetween, 10)
  };
}

// =============================================================================
// SWIPER CONFIGURATION
// =============================================================================

const modules = computed(() => {
  // Include EffectFade to ensure transitions complete properly
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
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  };
});

// Breakpoints for multi-column layouts
const mainBreakpoints = computed(() => {
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

// =============================================================================
// LIFECYCLE
// =============================================================================

onBeforeMount(() => {
  const instance = getCurrentInstance();
  if (!instance) return;
  
  let element = instance.vnode?.el;
  
  if (!element) {
    const allContainers = document.querySelectorAll('[data-container="vue"][data-component="GallerySwiper"]');
    element = Array.from(allContainers).find(el => el.hasAttribute('data-slides-data'));
    if (!element) {
      element = Array.from(allContainers).find(el => 
        el.querySelectorAll('.gallery-slide-content').length > 0
      );
    }
    if (!element && allContainers.length > 0) {
      element = allContainers[0];
    }
  }
  
  if (element) {
    // Try data attribute first
    const slidesDataAttr = element.getAttribute('data-slides-data');
    if (slidesDataAttr) {
      try {
        slides.value = JSON.parse(slidesDataAttr);
      } catch (e) {
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
  }
});

// =============================================================================
// EVENTS
// =============================================================================

const onMainSwiper = (swiper) => {
  mainSwiperRef.value = swiper;
};

const onThumbsSwiper = (swiper) => {
  thumbsSwiperRef.value = swiper;
};

const onTransitionEnd = () => {
  // Transition end handler - helps ensure animations complete properly
};

// Note: Navigation is handled by Swiper's Navigation module via CSS selectors
// No manual slidePrev/slideNext handlers needed - Swiper handles button clicks automatically

// For thumbs layout, we need thumbs swiper ready first
const thumbsSwiper = computed(() => thumbsSwiperRef.value);

// Only show main swiper once we have slides (and thumbs if needed)
const isReady = computed(() => {
  if (!slides.value.length) return false;
  if (config.value.layout === 'thumbs' && !thumbsSwiperRef.value) return false;
  return true;
});
</script>

<template>
  <div class="gallery-swiper-wrapper">
    <!-- Thumbs layout: main swiper first, then thumbnails below -->
    <template v-if="config.layout === 'thumbs'">
      <!-- Thumbnails swiper (hidden, renders first for thumbs linking) -->
      <div class="gallery-thumbs-strip" style="order: 2;">
        <swiper
          :modules="thumbsModules"
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
        :slides-per-view="1"
        :space-between="config.spaceBetween"
        :speed="config.speed"
        :loop="config.loop"
        :keyboard="{ enabled: true }"
        :navigation="navigationConfig"
        :pagination="paginationConfig"
        :thumbs="{ swiper: thumbsSwiper }"
        @swiper="onMainSwiper"
        @transitionEnd="onTransitionEnd"
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
        :slides-per-view="1"
        :space-between="config.spaceBetween"
        :speed="config.speed"
        :loop="config.loop"
        :keyboard="{ enabled: true }"
        :navigation="navigationConfig"
        :pagination="paginationConfig"
        :autoplay="autoplayConfig"
        :breakpoints="mainBreakpoints"
        :grab-cursor="true"
        @swiper="onMainSwiper"
        @transitionEnd="onTransitionEnd"
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
        aria-label="Previous slide"
      >
        <svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        aria-label="Next slide"
      >
        <svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<!-- 
  All Swiper styles are defined in vue.scss (single source of truth)
  This component only needs minimal scoped styles for its wrapper
-->
