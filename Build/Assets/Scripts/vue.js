/**
 * Vue Entry Point
 * Vue 3 application initialization for TYPO3 templates
 */

// Import Swiper CSS bundle - all Swiper styles for Vue components
// This ensures all Swiper CSS is included in vue.css
import 'swiper/css/bundle';

// Import Vue-specific SCSS (includes Swiper CSS variables)
// This must be imported before Swiper CSS so variables are available
import '../Scss/vue.scss';

// Import Vue initialization
import './code/Vue/vue-initialisation.js';
