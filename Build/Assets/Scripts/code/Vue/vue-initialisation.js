/**
 * Usage in TYPO3 templates:
 *   <div data-container="vue" data-component="TodoList"></div>
 *
 * Optional configuration via data attributes:
 *   <div data-container="vue" data-component="TodoList"
 *        data-card-title="My Tasks"
 *        data-color-scheme="primary"></div>
 *
 * SECURITY — trust boundary for slide HTML:
 *   For the SwiperSlider / GallerySwiper code paths below, this script reads
 *   `innerHTML` from server-rendered `.swiper-slide-content` / `.gallery-*`
 *   elements (TYPO3 Fluid output for content elements — RTE bodytext, images,
 *   etc.) and serialises it into a `data-slides-data` attribute. The Vue
 *   components then re-render that HTML via `v-html`. The content is therefore
 *   only as safe as the upstream Fluid pipeline (backend editors are trusted).
 *   NEVER use these components on user-submitted markup without server-side
 *   sanitisation first. The components carry matching SECURITY comments.
 */

import {createApp} from 'vue';

/**
 * Lazy component loaders. Each entry returns the dynamic import promise for
 * the matching SFC. Vite/Rollup code-splits these into separate chunks, so a
 * page that only uses `SwiperSlider` never downloads `TodoList` or
 * `GallerySwiper`. Add new components here following the same pattern.
 */
const componentLoaders = {
  TodoList: () => import('@components/TodoList.vue'),
  SwiperSlider: () => import('@components/SwiperSlider.vue'),
  GallerySwiper: () => import('@components/GallerySwiper.vue')
};

function captureSlides(element, slideSelector, extract) {
  const slideElements = element.querySelectorAll(slideSelector);
  if (slideElements.length === 0) {
    return;
  }
  const slidesData = Array.from(slideElements).map((el, index) => extract(el, index));
  element.setAttribute('data-slides-data', JSON.stringify(slidesData));
}

function preserveSlideContent(element, componentName) {
  if (componentName === 'SwiperSlider') {
    captureSlides(element, '.swiper-slide-content', (el, index) => ({
      id: index,
      content: el.innerHTML
    }));
    return;
  }

  if (componentName === 'GallerySwiper') {
    captureSlides(element, '.gallery-slide-content', (el, index) => {
      const mainContentEl = el.querySelector('.gallery-main-content');
      const content = mainContentEl ? mainContentEl.innerHTML : el.innerHTML;

      // Thumbnail comes from a <template> element to avoid rendering it twice
      const thumbnailTemplate = el.querySelector('.gallery-thumbnail-template');
      const thumbnail = thumbnailTemplate ? thumbnailTemplate.innerHTML : content;

      return {
        id: index,
        content: content.trim(),
        thumbnail: thumbnail.trim()
      };
    });
  }
}

async function mountComponent(element, componentName) {
  const loader = componentLoaders[componentName];
  if (!loader) {
    return;
  }

  // Snapshot SSR slide HTML BEFORE Vue replaces innerHTML on mount. Done
  // synchronously here (i.e. before awaiting the dynamic import) so we never
  // race against browser layout passes that could mutate the slides.
  preserveSlideContent(element, componentName);

  try {
    const module = await loader();
    const component = module.default ?? module;
    if (!component) {
      return;
    }
    const app = createApp(component);
    app.provide('mpcMountElement', element);
    app.mount(element);
    element.classList.add('swiper-vue-ready');
  } catch (err) {
    // Surface the failure once per component; never throw past the loader so
    // a single broken component cannot block the rest of the page.
    if (typeof console !== 'undefined') {
      // eslint-disable-next-line no-console -- intentional, mount errors must reach DevTools
      console.error(`[mp-core/vue] failed to mount "${componentName}"`, err);
    }
  }
}

function initializeVueComponents() {
  const containers = document.querySelectorAll('[data-container="vue"]');
  if (!containers.length) {
    return;
  }

  containers.forEach((element) => {
    const componentName = element.getAttribute('data-component');
    if (componentName) {
      mountComponent(element, componentName);
    }
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVueComponents);
  } else {
    initializeVueComponents();
  }
}

export {createApp, componentLoaders};
