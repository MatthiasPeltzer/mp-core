/**
 * Usage in TYPO3 templates:
 *   <div data-container="vue" data-component="TodoList"></div>
 *
 * Optional configuration via data attributes:
 *   <div data-container="vue" data-component="TodoList"
 *        data-card-title="My Tasks"
 *        data-color-scheme="primary"></div>
 */

import {createApp} from 'vue';
import TodoList from '@components/TodoList.vue';
import SwiperSlider from '@components/SwiperSlider.vue';
import GallerySwiper from '@components/GallerySwiper.vue';

/** Component registry — add new Vue components here */
const components = {
  TodoList,
  SwiperSlider,
  GallerySwiper
};

function initializeVueComponents() {
  const containers = document.querySelectorAll('[data-container="vue"]');

  if (!containers.length) {
    return;
  }

  containers.forEach(element => {
    const componentName = element.getAttribute('data-component');
    const component = components[componentName];

    if (component) {
      // Preserve slide content before Vue replaces innerHTML
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

      if (componentName === 'GallerySwiper') {
        const slideElements = element.querySelectorAll('.gallery-slide-content');
        if (slideElements.length > 0) {
          const slidesData = Array.from(slideElements).map((el, index) => {
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
          element.setAttribute('data-slides-data', JSON.stringify(slidesData));
        }
      }

      const app = createApp(component);
      app.mount(element);
      element.classList.add('swiper-vue-ready');
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

export {createApp, components};
