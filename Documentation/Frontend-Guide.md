# Frontend Build Guide

Complete guide to the frontend build system, asset pipeline, and project structure.

---

## Requirements

- **Node.js** ≥20 (Node 22 recommended)
- **npm** ≥10

---

## Technology Stack

- **Vite 7.2** - Build tool and dev server with HMR
- **Vue.js 3.5** - Interactive components
- **Bootstrap 5.3.8** - UI framework
- **Sass 1.93** - CSS preprocessing
- **PostCSS** - Autoprefixer, pxtorem
- **ESLint 9** - JavaScript linting
- **Stylelint 16** - CSS/SCSS linting
- **Swiper 12** - Touch sliders
- **Jarallax 2** - Parallax scrolling
- **VidPly 1.0.10** - Accessible media player

---

## Quick Start

### 1. Installation

```bash
cd Build
npm ci
```

### 2. Development Workflow

```bash
cd Build
npm run watch  # Auto-rebuild on file changes
```

Output: `Resources/Public/` (JavaScripts, StyleSheets, Fonts, Icons, Images)

### 3. NPM Scripts

| Script | Description |
|--------|-------------|
| `build` | Production build (minified, optimized) |
| `dev` | Development build with source maps |
| `watch` | Development build with file watcher |
| `eslint` / `eslint.fix` | JavaScript linting |
| `stylelint` / `stylelint.fix` | CSS/SCSS linting |

### 4. Clean Build

```bash
rm -rf node_modules Resources/Public && npm ci && npm run build
```

---

## Project Structure

### Build Directory

```
Build/
├── Assets/                     # Source files
│   ├── Fonts/                  # Web fonts (WOFF2)
│   ├── Images/                 # Source images
│   │   └── Icons/              # SVG icons
│   ├── Scripts/                # JavaScript/Vue
│   │   ├── code/               # Feature modules
│   │   ├── components/         # Vue components
│   │   └── Utils/              # Shared utilities
│   ├── Scss/                   # SCSS files
│   │   ├── Base/               # Variables, fonts
│   │   ├── Elements/           # Base elements
│   │   ├── Mixins/             # SCSS mixins
│   │   ├── Modules/            # UI components
│   │   └── Templates/          # Layout helpers
│   └── Static/                 # Static files (copied as-is)
│       ├── BackendLayouts/     # Backend previews
│       ├── Favicons/           # Generated favicons
│       └── Images/             # Static images
├── node_modules/               # npm dependencies
├── package.json                # npm configuration
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint rules
├── stylelint.config.js         # Stylelint rules
└── postcss.config.js           # PostCSS plugins
```

### Resources Directory

```
Resources/
├── Private/                    # Fluid templates (not web-accessible)
│   ├── Backend/               # Backend module templates
│   ├── Language/              # XLIFF translation files
│   ├── Layouts/               # Page layouts
│   ├── Partials/              # Reusable template fragments
│   │   ├── ContentElements/   # Content element partials
│   │   ├── Header/            # Header rendering variants
│   │   ├── Media/             # Media rendering helpers
│   │   └── Page/              # Page-level partials
│   └── Templates/             # Main templates
│       ├── Content/           # Content element templates
│       ├── Container/         # Container templates
│       └── Page/              # Page templates
├── Extensions/                # Extension template overrides
│   ├── fluid_styled_content/  # FSC overrides
│   ├── form/                  # EXT:form overrides
│   ├── indexed_search/        # EXT:indexed_search overrides
│   └── news/                  # EXT:news overrides
└── Public/                    # Compiled assets (web-accessible)
    ├── BackendLayouts/        # Backend layout preview SVGs
    ├── Favicons/              # Generated favicon files
    ├── Fonts/                 # Web fonts
    ├── Icons/                 # SVG icons
    ├── Images/                # Compiled images
    ├── JavaScripts/           # Compiled JS bundles
    ├── Seo/                   # SEO files
    └── StyleSheets/           # Compiled CSS bundles
```

---

## Vite Configuration

### Entry Points

Entry points are defined in `Build/vite.config.js`:

```javascript
const entryPoints = {
  bootstrap: resolve(__dirname, 'Assets/Scripts/bootstrap.js'),
  screen: resolve(__dirname, 'Assets/Scripts/screen.js'),
  vidply: resolve(__dirname, 'Assets/Scripts/vidply.js'),
  vue: resolve(__dirname, 'Assets/Scripts/vue.js'),
  swiper: resolve(__dirname, 'Assets/Scripts/swiper.js'),
  navigationPrimary: resolve(__dirname, 'Assets/Scripts/navigationPrimary.js'),
  navigationSecondary: resolve(__dirname, 'Assets/Scripts/navigationSecondary.js'),
  navigationTertiary: resolve(__dirname, 'Assets/Scripts/navigationTertiary.js'),
  print: resolve(__dirname, 'Assets/Scripts/print.js'),
  backend: resolve(__dirname, 'Assets/Scripts/backend.js'),
  ckeditor: resolve(__dirname, 'Assets/Scripts/ckeditor.js'),
};
```

### Adding a New Entry

1. Create a JS file in `Build/Assets/Scripts/`:

```javascript
// myfeature.js
import "../Scss/myfeature.scss";
import "./code/myfeature-module.js";
```

2. Register in `Build/vite.config.js`:

```javascript
const entryPoints = {
  // ...existing entries
  myfeature: resolve(__dirname, 'Assets/Scripts/myfeature.js'),
};
```

3. Run build:

```bash
npm run watch
```

4. Include in Fluid template:

```html
<f:asset.script identifier="myfeature" src="EXT:mp_core/Resources/Public/JavaScripts/myfeature.js" />
<f:asset.css identifier="myfeature" href="EXT:mp_core/Resources/Public/StyleSheets/myfeature.css" />
```

---

## Asset Handling

### Images in SCSS

```scss
// Relative to the importing file
.icon {
  background: url('../../Images/Icons/icon.png') no-repeat;
}
```

### Fonts

```scss
// Using the font-face mixin
@include font-face('CustomFont', '../../Fonts/custom-webfont', 400, normal, woff2);
```

### Inline SVG

```scss
// svg-load() paths are relative to the entry point
.button {
  background-image: svg-load('../Images/Icons/arrow.svg');
}
```

### Static Files

Files in `Build/Assets/Static/` are copied as-is to `Resources/Public/`:

```
Build/Assets/Static/Favicons/favicon.ico
→ Resources/Public/Favicons/favicon.ico
```

---

## Vue.js Components

### Creating a Component

1. Create component file:

```vue
<!-- Build/Assets/Scripts/components/MyComponent.vue -->
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      title: 'Hello Vue'
    };
  },
  methods: {
    handleClick() {
      console.log('Clicked!');
    }
  }
};
</script>

<style scoped>
.my-component {
  padding: 1rem;
}
</style>
```

2. Create entry point:

```javascript
// Build/Assets/Scripts/mycomponent.js
import { createApp } from 'vue';
import MyComponent from './components/MyComponent.vue';

document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById('my-component');
  if (element) {
    createApp(MyComponent).mount(element);
  }
});
```

3. Add to `vite.config.js` and build

4. Include in Fluid template:

```html
<div id="my-component"></div>
<f:asset.script identifier="mycomponent" src="EXT:mp_core/Resources/Public/JavaScripts/mycomponent.js" />
```

---

## Migration Guide

### Migrating Existing Assets

| Old Location | New Location | Notes |
|--------------|--------------|-------|
| `Resources/Public/Fonts/` | `Build/Assets/Fonts/` | Copied as-is |
| `Resources/Public/Images/` | `Build/Assets/Images/` | Optimized by Vite |
| `Resources/Public/JavaScript/` | `Build/Assets/Scripts/` | Bundled and minified |
| `Resources/Private/Design/Scss/` | `Build/Assets/Scss/` | Compiled to CSS |
| `Resources/Public/BackendLayouts/` | `Build/Assets/Static/BackendLayouts/` | Copied as-is |

### Migration Checklist

- [ ] Move fonts to `Build/Assets/Fonts/`
- [ ] Move and organize images in `Build/Assets/Images/`
- [ ] Refactor JavaScript into modules in `Build/Assets/Scripts/`
- [ ] Port SCSS into ITCSS structure in `Build/Assets/Scss/`
- [ ] Move static files to `Build/Assets/Static/`
- [ ] Update asset references in templates
- [ ] Run `npm run build` and test

---

## Template Integration

### Fluid Asset ViewHelpers

```html
<!-- CSS -->
<f:asset.css identifier="screen" href="EXT:mp_core/Resources/Public/StyleSheets/screen.css" />

<!-- JavaScript -->
<f:asset.script identifier="screen" src="EXT:mp_core/Resources/Public/JavaScripts/screen.js" />

<!-- Async JavaScript -->
<f:asset.script async="async" identifier="vidply" src="EXT:mp_core/Resources/Public/JavaScripts/vidply.js" />
```

### TypoScript Asset Includes

```typoscript
page {
  includeCSS {
    screen = EXT:mp_core/Resources/Public/StyleSheets/screen.css
  }
  includeJSFooter {
    screen = EXT:mp_core/Resources/Public/JavaScripts/screen.js
  }
}
```

---

## Template Path Precedence

TYPO3 uses numbered paths (higher numbers override lower):

```typoscript
page.10 {
  templateRootPaths {
    0 = EXT:fluid_styled_content/Resources/Private/Templates/
    10 = EXT:mp_core/Resources/Private/Templates/
    20 = EXT:your_sitepackage/Resources/Private/Templates/
  }
}
```

---

## Extension Overrides

MP Core provides customized templates for:

### Fluid Styled Content
- Path: `Resources/Extensions/fluid_styled_content/Private/`
- Overrides default TYPO3 content rendering
- Maintains 1:1 folder structure

### EXT:form
- Path: `Resources/Extensions/form/`
- Bootstrap 5 styled forms
- YAML config: `Yaml/BaseSetup.yaml`

### EXT:news
- Path: `Resources/Extensions/news/`
- List and detail views
- Category and pagination templates

### EXT:indexed_search
- Path: `Resources/Extensions/indexed_search/`
- Bootstrap styled search results

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 on font files | Wrong relative path | Check `../` segments from SCSS to `Fonts/` |
| Images missing in CSS | Asset not imported | Verify path in `Assets/Images/` |
| Bundle too large | Unused imports | Import only needed Bootstrap components |
| HMR not working | Vite dev server not running | Use `npm run watch` |
| Changes not appearing | Cache issue | Clear browser cache and TYPO3 caches |

---

## Important Notes

### Compiled Assets

- **Never edit files in `Resources/Public/` directly**
- Always edit source files in `Build/Assets/`
- Run `npm run build` before committing
- Compiled assets are committed for deployment

### Build Performance

- Use `npm run watch` during development for fast rebuilds
- Use `npm run build` for production (minified, optimized)
- Large projects: consider code splitting in `vite.config.js`

---

## Further Reading

- [Frontend Development](Frontend-Development.md) - JavaScript and SCSS architecture
- [Favicons](Favicons.md) - Favicon generation guide
- [TYPO3 Configuration](TYPO3-Configuration.md) - Site Sets and TypoScript
- [Vite Documentation](https://vitejs.dev/)
- [Vue.js Documentation](https://vuejs.org/)

