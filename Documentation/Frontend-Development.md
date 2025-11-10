# Frontend Development

Complete guide to JavaScript and SCSS architecture, coding patterns, and best practices.

---

## JavaScript Architecture

### Structure Overview

JavaScript is organized in two levels:

1. **Entry Bundles** - Top-level files used as Vite entry points
2. **Feature Modules** - Reusable modules in `code/` directory

### Entry Bundles

Located in `Build/Assets/Scripts/`:

| Bundle | Purpose |
|--------|---------|
| `bootstrap.js` | Bootstrap framework initialization |
| `screen.js` | Main frontend functionality (sticky header, theme, Swiper, etc.) |
| `vidply.js` | VidPly media player integration |
| `vue.js` | Vue.js 3 components (TodoList, etc.) |
| `swiper.js` | Swiper carousel initialization |
| `navigationPrimary.js` | Primary navigation behavior |
| `navigationSecondary.js` | Secondary navigation behavior |
| `navigationTertiary.js` | Tertiary navigation behavior |
| `print.js` | Print-specific styles |
| `backend.js` | TYPO3 backend styles |
| `ckeditor.js` | CKEditor RTE styles |

### Feature Modules

Located in `Build/Assets/Scripts/code/`:

#### Core Utilities
- **`i18n.js`** - Centralized translation strings for Swiper and navigation
- **`i18nLinkHelper.js`** - Internationalization helper for links
- **`main.js`** - UX helpers (no-js class removal, popup, autofocus)

#### UI Components
- **`jarallax.js`** - Parallax scrolling for grid elements
- **`modalGallery.js`** - Image resizing in modal galleries
- **`openAccordionAndTabs.js`** - Deep-link support for accordions and tabs
- **`pagination.js`** - Vanilla JS list paginator
- **`sticky.js`** - Sticky header class handling
- **`teaserLink.js`** - Hover/focus states for teasers
- **`totop.js`** - Back-to-top button with progress indicator

#### Navigation
- **`nav-toggle.js`** - Navigation toggle helper
- **`Navigation/Primary.js`** - Primary navigation logic
- **`Navigation/Secondary.js`** - Secondary navigation logic
- **`Navigation/Tertiary.js`** - Tertiary navigation logic

#### Media Players
- **`player-soundcloud.js`** - GDPR-friendly SoundCloud lazy-loading
- **`player-vimeo.js`** - GDPR-friendly Vimeo lazy-loading
- **`player-youtube.js`** - GDPR-friendly YouTube lazy-loading

#### Layout Helpers
- **`moveHeaderDate.js`** - DOM manipulation for date elements
- **`resizeListener.js`** - Responsive layout adjustments
- **`theme.js`** - Dark mode toggle with localStorage

#### Swiper Integration
- **`Swiper/init.js`** - Swiper initialization
- **`Swiper/config.js`** - Swiper configuration presets

### Shared Utilities

Located in `Build/Assets/Scripts/Utils/domUtils.js`:

#### `debounce(func, wait = 100)`

Debounce helper for performance optimization:

```javascript
import { debounce } from './Utils/domUtils.js';

window.addEventListener('resize', debounce(() => {
  console.log('Resized without spamming logs!');
}, 200));
```

#### `toggleNavState(...)`

Toggles classes and labels for navigation open/closed states.

#### `handleDropdownVisibility(element, showCb, hideCb)`

Adds Bootstrap dropdown event listeners:

```javascript
import { handleDropdownVisibility } from './Utils/domUtils.js';

handleDropdownVisibility(
  dropdownElement,
  () => console.log('Dropdown shown'),
  () => console.log('Dropdown hidden')
);
```

#### `toggleAriaLabelAndTitle(element, openLabel, closeLabel)`

Synchronizes `aria-label` and `title` attributes:

```javascript
import { toggleAriaLabelAndTitle } from './Utils/domUtils.js';

toggleAriaLabelAndTitle(button, 'Open menu', 'Close menu');
```

---

## Vue.js Components

### Existing Components

#### TodoList Component

Located in `Build/Assets/Scripts/components/TodoList.vue`:

- Interactive todo list with localStorage persistence
- Add, edit, delete, and toggle todos
- Data persists across page reloads
- Registered as content element `mpcore_todolist`

### Creating New Components

1. **Create component file:**

```vue
<!-- Build/Assets/Scripts/components/MyComponent.vue -->
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      title: 'My Component',
      count: 0
    };
  },
  methods: {
    increment() {
      this.count++;
    }
  },
  mounted() {
    console.log('Component mounted');
  }
};
</script>

<style scoped>
.my-component {
  padding: 1rem;
  border: 1px solid #ccc;
}
</style>
```

2. **Create entry point:**

```javascript
// Build/Assets/Scripts/mycomponent.js
import { createApp } from 'vue';
import MyComponent from './components/MyComponent.vue';

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.my-component-mount');
  elements.forEach(element => {
    createApp(MyComponent).mount(element);
  });
});
```

3. **Register in Vite config** and build

4. **Use in Fluid template:**

```html
<div class="my-component-mount"></div>
<f:asset.script identifier="mycomponent" src="EXT:mp_core/Resources/Public/JavaScripts/mycomponent.js" />
```

---

## SCSS Architecture

### ITCSS Methodology

The SCSS codebase follows **Inverted Triangle CSS (ITCSS)** for predictable cascade and maintainability.

#### Layer Hierarchy (low to high specificity)

1. **Settings** - Variables, fonts, color maps
2. **Tools/Mixins** - Functions, mixins (no CSS output)
3. **Generic** - Reset, normalize, box-sizing
4. **Elements** - Base HTML elements (`h1`, `p`, `a`)
5. **Objects** - Layout patterns without cosmetics
6. **Components/Modules** - Styled UI components
7. **Utilities** - Helper classes with `!important`

### Directory Structure

Located in `Build/Assets/Scss/`:

```
Scss/
├── Base/                           # Settings & Generic
│   ├── _fonts.scss                 # @font-face declarations
│   └── Bootstrap/
│       ├── _custom-variables.scss  # Light theme variables
│       └── _custom-variables-dark.scss  # Dark theme variables
├── Mixins/                         # Tools
│   ├── mixins.scss                 # Main mixin file
│   ├── _fontface.scss              # Font-face helper
│   └── _iconstyle.scss             # Icon style mixin
├── Elements/                       # Base elements
│   ├── _buttons.scss
│   ├── _blockquote.scss
│   ├── _forms.scss
│   └── ...
├── Modules/                        # Components
│   ├── _accordion.scss
│   ├── _banner.scss
│   ├── _navigation.scss
│   └── ...
├── Templates/                      # Layout helpers
│   ├── _general.scss
│   └── _columns.scss
├── Extensions/                     # TYPO3 extension overrides
│   ├── _backend.scss
│   ├── _ckeditor.scss
│   └── _fsc.scss
├── bootstrap.scss                  # Bootstrap entry
├── screen.scss                     # Main frontend bundle
├── vidply.scss                     # VidPly player theme
├── navigationPrimary.scss          # Primary nav styles
├── navigationSecondary.scss        # Secondary nav styles
├── navigationTertiary.scss         # Tertiary nav styles
├── print.scss                      # Print styles
├── backend.scss                    # Backend styles
└── ckeditor.scss                   # CKEditor styles
```

### Import Order

Example from `screen.scss`:

```scss
// 1. Settings
@use "Base/Bootstrap/custom-variables";
@use "Base/_fonts.scss";

// 2. Tools
@use "Mixins/mixins" as *;

// 3. Generic (from Bootstrap)
@use "bootstrap";

// 4. Elements
@use "Elements/_buttons";
@use "Elements/_forms";

// 5. Objects
// (if any)

// 6. Components/Modules
@use "Modules/_accordion";
@use "Modules/_banner";
@use "Modules/_navigation";

// 7. Utilities
// (from Bootstrap utilities)
```

### Bootstrap Customization

#### Light Theme Variables

`Build/Assets/Scss/Base/Bootstrap/_custom-variables.scss`:

```scss
// Override Bootstrap variables
$primary: #0066cc;
$secondary: #ff6600;
$font-family-base: 'Open Sans', sans-serif;
$font-family-headings: 'Turret Road', sans-serif;

// Custom variables
$navbar-height: 80px;
$container-max-width: 1200px;
```

#### Dark Theme Variables

`Build/Assets/Scss/Base/Bootstrap/_custom-variables-dark.scss`:

```scss
// Dark theme overrides
[data-bs-theme="dark"] {
  --bs-primary: #3399ff;
  --bs-secondary: #ff9933;
  --bs-body-bg: #1a1a1a;
  --bs-body-color: #f0f0f0;
}
```

---

## Adding New Components

### JavaScript Module

1. **Create module file:**

```javascript
// Build/Assets/Scripts/code/myfeature.js
export function initMyFeature() {
  const elements = document.querySelectorAll('.my-feature');
  elements.forEach(element => {
    element.addEventListener('click', () => {
      console.log('Feature clicked');
    });
  });
}
```

2. **Import in entry bundle:**

```javascript
// Build/Assets/Scripts/screen.js
import { initMyFeature } from './code/myfeature.js';

document.addEventListener('DOMContentLoaded', () => {
  initMyFeature();
});
```

3. **Build and test:**

```bash
npm run watch
```

### SCSS Component

1. **Create component file:**

```scss
// Build/Assets/Scss/Modules/_mycomponent.scss
.c-mycomponent {
  padding: 1rem;
  background-color: var(--bs-light);
  
  &__title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  &__content {
    color: var(--bs-body-color);
  }
  
  // Responsive
  @media (min-width: 768px) {
    padding: 2rem;
  }
}
```

2. **Import in entry bundle:**

```scss
// Build/Assets/Scss/screen.scss
@use "Modules/_mycomponent";
```

3. **Build and test:**

```bash
npm run watch
```

---

## Best Practices

### JavaScript

- **Modular code** - Put reusable logic in `code/` modules
- **Shared utilities** - Add common patterns to `Utils/domUtils.js`
- **Event delegation** - Use for dynamic content
- **Debounce/throttle** - For resize/scroll handlers
- **Async loading** - Use for heavy libraries
- **GDPR compliance** - Lazy-load external media
- **Accessibility** - ARIA labels, keyboard navigation
- **Lint before commit** - Run `npm run eslint.fix`

### SCSS

- **ITCSS layers** - Respect the specificity hierarchy
- **BEM naming** - Use `.c-component__element--modifier`
- **CSS variables** - For theming and dynamic values
- **Logical properties** - `margin-inline-start` for RTL support
- **Max nesting** - Keep to 3 levels maximum
- **Mobile first** - Use `min-width` media queries
- **Semantic colors** - Use Bootstrap color variables
- **Lint before commit** - Run `npm run stylelint.fix`

### Vue.js

- **Single File Components** - Keep template, script, style together
- **Scoped styles** - Use `<style scoped>` to avoid conflicts
- **Props validation** - Define prop types
- **Emit events** - For parent communication
- **Composition API** - For complex logic (optional)
- **Lifecycle hooks** - Use appropriately
- **Reactivity** - Understand Vue 3 reactivity system

---

## Code Examples

### Debounced Resize Handler

```javascript
import { debounce } from './Utils/domUtils.js';

const handleResize = debounce(() => {
  const width = window.innerWidth;
  console.log('Window resized to:', width);
}, 250);

window.addEventListener('resize', handleResize);
```

### Bootstrap Dropdown Integration

```javascript
import { handleDropdownVisibility } from './Utils/domUtils.js';

const dropdown = document.querySelector('.dropdown');
handleDropdownVisibility(
  dropdown,
  () => dropdown.classList.add('is-open'),
  () => dropdown.classList.remove('is-open')
);
```

### Dark Mode Toggle

```javascript
// From Build/Assets/Scripts/code/theme.js
const themeToggle = document.querySelector('[data-theme-toggle]');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-bs-theme', currentTheme);

themeToggle?.addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-bs-theme');
  const newTheme = theme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-bs-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});
```

### Responsive SCSS Component

```scss
.c-card {
  padding: 1rem;
  background: var(--bs-white);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &__image {
    width: 100%;
    height: auto;
    border-radius: 0.5rem 0.5rem 0 0;
  }
  
  &__title {
    font-size: 1.25rem;
    margin-block-end: 0.5rem;
  }
  
  &__content {
    color: var(--bs-secondary-color);
  }
  
  // Tablet and up
  @media (min-width: 768px) {
    padding: 1.5rem;
    
    &__title {
      font-size: 1.5rem;
    }
  }
  
  // Desktop and up
  @media (min-width: 1024px) {
    padding: 2rem;
  }
  
  // Dark theme
  [data-bs-theme="dark"] & {
    background: var(--bs-dark);
    box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
  }
}
```

---

## Linting

### ESLint

Configuration in `Build/eslint.config.js`:

```bash
# Check for errors
npm run eslint

# Auto-fix issues
npm run eslint.fix
```

### Stylelint

Configuration in `Build/stylelint.config.js`:

```bash
# Check for errors
npm run stylelint

# Auto-fix issues
npm run stylelint.fix
```

---

## Further Reading

- [Frontend Guide](Frontend-Guide.md) - Build system and project structure
- [Favicons](Favicons.md) - Favicon generation
- [TYPO3 Configuration](TYPO3-Configuration.md) - Site Sets and TypoScript
- [Vue.js 3 Documentation](https://vuejs.org/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [ITCSS Architecture](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)

