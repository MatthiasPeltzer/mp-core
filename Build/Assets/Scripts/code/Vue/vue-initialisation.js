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

import { createApp } from 'vue';
import TodoList from '@components/TodoList.vue';

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Component registry - add new Vue components here
 */
const components = {
  TodoList
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
      const app = createApp(component);
      app.mount(element);
      // eslint-disable-next-line no-console
      console.log(`Vue component "${componentName}" mounted successfully`);
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
export { createApp, components };
