# Build Folder

Frontend asset pipeline for TYPO3. Requires Node 22+ and npm.

## Technology Stack

- Vite - Build tool
- Vue.js 3 - Interactive components
- Sass/SCSS - CSS preprocessing
- PostCSS - Autoprefixer  
- ESLint - JavaScript linting
- Stylelint - CSS/SCSS linting

---

## 1. Installation

```bash
cd Build
npm ci
```

---

## 2. NPM Scripts

| Script | Description |
|--------|-------------|
| `dev` | Development build with source maps |
| `build` | Production build (minified, optimized) |
| `watch` | Development build with file watcher |
| `eslint` / `eslint.fix` | JavaScript linting |
| `stylelint` / `stylelint.fix` | CSS/SCSS linting |
| `stylelint.verbose` | Detailed linting output |

### Development Workflow

```bash
cd Build
npm run watch  # Auto-rebuild on file changes
```

Output structure:
```
Resources/Public/
- JavaScripts/    # Compiled JS
- StyleSheets/    # Compiled CSS
- Fonts/          # Web fonts
- Icons/          # SVG icons
- Images/         # Optimized images
```

---

## 3. Documentation

### Quick Start Guides
* [Vue.js 3 DDEV Quick Start](Documentation/Vue-DDEV-QuickStart.md)
* [DDEV Setup Summary](Documentation/DDEV-Setup-Summary.md)

### Frontend Development
* [Vue.js 3 Full Guide](Documentation/Vue.md)
* [JavaScripts](../Documentation/Frontend-JavaScript.md)
* [SCSS](../Documentation/Frontend-SCSS.md)
* [Favicons](../Documentation/Favicons.md)
* [Build Integration](../Documentation/Frontend-Build-Integration.md)

### TYPO3 Configuration
* [Navigation](Documentation/Navigation.md)
* [Site Settings](../Documentation/Site-Settings.md)
* [Site Sets](../Documentation/Site-Set.md)
* [TCA](../Documentation/TCA-Overview.md)
* [TypoScript](../Documentation/TypoScript-Overview.md)

---

## 4. Clean Build

```bash
rm -rf node_modules Resources/Public && npm ci && npm run build
```

---

## 5. Vue.js Component Development

Create Vue 3 single-file components:

1. Create `Assets/Scripts/components/YourComponent.vue`
2. Create entry point in `Assets/Scripts/yourcomponent.js`:
   ```javascript
   import { createApp } from 'vue';
   import YourComponent from './components/YourComponent.vue';
   
   document.addEventListener('DOMContentLoaded', () => {
     const element = document.getElementById('your-component');
     if (element) {
       createApp(YourComponent).mount(element);
     }
   });
   ```
3. Add entry point to `vite.config.js` input object
4. Run `npm run watch` or `npm run build`

### Vite Configuration

Configured via `vite.config.js`:
- Multiple entry points
- Vue 3 SFC support
- SCSS preprocessing
- PostCSS with autoprefixer
- Automatic cleanup
- Source maps in development

See [Vue.js documentation](Documentation/Vue.md) for complete guide.
