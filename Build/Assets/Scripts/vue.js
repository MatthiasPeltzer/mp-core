/**
 * Vue 3 Application Entry Point
 * 
 * This file initializes Vue 3 components and mounts them to DOM elements.
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

// Import your Vue components here
import TodoList from '@components/TodoList.vue';

// Component registry
const components = {
	TodoList
};

// Initialize Vue components
function initializeVueComponents() {
	// Find all Vue containers
	const vueContainers = document.querySelectorAll('[data-container="vue"]');
	
	if (vueContainers.length === 0) {
		console.log('No Vue containers found on page');
		return;
	}
	
	vueContainers.forEach(element => {
		const componentName = element.getAttribute('data-component');
		const component = components[componentName];
		
		if (component) {
			// Create and mount the app with the component
			const app = createApp(component);
			app.mount(element);
			console.log(`Vue component "${componentName}" mounted successfully`);
		} else {
			console.warn(`Vue component "${componentName}" not found in registry. Available: ${Object.keys(components).join(', ')}`);
		}
	});
}

// Auto-initialize Vue components on DOM ready
if (typeof window !== 'undefined') {
	// Check if DOM is already loaded (for async scripts)
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initializeVueComponents);
	} else {
		// DOM already loaded, initialize immediately
		initializeVueComponents();
	}
}

// Export for manual initialization if needed
export { createApp, components };

