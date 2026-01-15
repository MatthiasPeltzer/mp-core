/**
 * Vue 3 Application Initialization
 * Initializes Vue 3 components and mounts them to DOM elements
 *
 * Usage in TYPO3 templates:
 * <div data-container="vue" data-component="TodoList"></div>
 *
 * Optional configuration via data attributes:
 * <div data-container="vue" data-component="TodoList"
 *      data-card-title="My Tasks"
 *      data-color-scheme="primary"></div>
 */

import {createApp} from 'vue';
import TodoList from '@components/TodoList.vue';
import SwiperSlider from '@components/SwiperSlider.vue';
import GallerySwiper from '@components/GallerySwiper.vue';

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Component registry - add new Vue components here
 */
const components = {
  TodoList,
  SwiperSlider,
  GallerySwiper
};

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initializes all Vue components found in the DOM
 */
function initializeVueComponents() {
  const containers = document.querySelectorAll('[data-container="vue"]');

  if (!containers.length) {
    // eslint-disable-next-line no-console
    console.log('No Vue containers found on page');
    return;
  }

  containers.forEach(element => {
    const componentName = element.getAttribute('data-component');
    const component = components[componentName];

    if (component) {
      // For SwiperSlider, we need to preserve the slide content before Vue replaces it
      if (componentName === 'SwiperSlider') {
        const slideElements = element.querySelectorAll('.swiper-slide-content');
        if (slideElements.length > 0) {
          const slidesData = Array.from(slideElements).map((el, index) => ({
            id: index,
            content: el.innerHTML
          }));
          element.setAttribute('data-slides-data', JSON.stringify(slidesData));
        }
      }

      // For GallerySwiper, preserve gallery slide content and thumbnails
      if (componentName === 'GallerySwiper') {
        const slideElements = element.querySelectorAll('.gallery-slide-content');
        if (slideElements.length > 0) {
          const slidesData = Array.from(slideElements).map((el, index) => {
            // Extract main content (from .gallery-main-content or fallback to entire innerHTML)
            const mainContentEl = el.querySelector('.gallery-main-content');
            const content = mainContentEl ? mainContentEl.innerHTML : el.innerHTML;

            // Extract thumbnail from template element (if present)
            const thumbnailTemplate = el.querySelector('.gallery-thumbnail-template');
            const thumbnail = thumbnailTemplate ? thumbnailTemplate.innerHTML : content;

            return {
              id: index,
              content: content.trim(),
              thumbnail: thumbnail.trim()
            };
          });
          element.setAttribute('data-slides-data', JSON.stringify(slidesData));
        }
      }

      const app = createApp(component);
      app.mount(element);
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `Vue component "${componentName}" not found in registry. ` +
        `Available: ${Object.keys(components).join(', ')}`
      );
    }
  });
}

// Auto-initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVueComponents);
  } else {
    initializeVueComponents();
  }
}

// Export for manual initialization
export {createApp, components};
