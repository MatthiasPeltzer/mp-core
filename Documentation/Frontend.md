# Frontend

Build system, asset pipeline, JavaScript/SCSS architecture, and best practices.

---

## Requirements

- **Node.js** >=22 (Node 24 recommended)
- **npm** >=10

## Technology Stack

- **Vite 8** -- Build tool with HMR
- **Vue.js 3.5** -- Interactive components (TodoList, GallerySwiper, SwiperSlider)
- **Bootstrap 5.3** -- UI framework
- **Sass 1.99** -- CSS preprocessing (modern-compiler API)
- **PostCSS** -- preset-env, pxtorem
- **ESLint 10** / **Stylelint 17** -- Code quality
- **Swiper 12** -- Touch sliders (integrated via Vue components)
- **Jarallax 3** -- Parallax scrolling

---

## Quick Start

```bash
cd Build
npm ci
npm run watch   # Auto-rebuild on file changes
```

Output goes to `Resources/Public/` (JavaScripts, StyleSheets, Fonts, Icons, Images).

| Script | Description |
|--------|-------------|
| `build` | Lint + production build (minified, optimized) |
| `dev` | Lint + development build with source maps |
| `watch` | Development build with file watcher |
| `lint` | Run ESLint + Stylelint |
| `eslint` / `eslint.fix` | JavaScript linting |
| `stylelint` / `stylelint.fix` | CSS/SCSS linting |

Clean build: `rm -rf node_modules Resources/Public && npm ci && npm run build`

---

## Project Structure

### Build Directory

```
Build/
├── Assets/
│   ├── Fonts/                  # Web fonts (WOFF2)
│   ├── Images/                 # Source images, Icons/
│   ├── Scripts/                # JavaScript/Vue
│   │   ├── code/               # Feature modules
│   │   ├── components/         # Vue components
│   │   └── Utils/              # Shared utilities
│   ├── Scss/                   # SCSS (ITCSS layers)
│   │   ├── Base/               # Variables, fonts
│   │   ├── Elements/           # Base elements
│   │   ├── Mixins/             # SCSS mixins
│   │   ├── Modules/            # UI components
│   │   ├── Templates/          # Layout helpers
│   │   └── Extensions/         # TYPO3 extension overrides
│   └── Static/                 # Copied as-is (BackendLayouts, Favicons)
├── vite.config.js
├── eslint.config.js
├── stylelint.config.js
└── postcss.config.js
```

### Resources Directory

```
Resources/
├── Private/                    # Fluid templates (not web-accessible)
│   ├── Backend/, Language/, Layouts/, Partials/, Templates/
├── Extensions/                 # Extension template overrides
│   ├── fluid_styled_content/, form/, indexed_search/, news/
└── Public/                     # Compiled assets (web-accessible)
    ├── Fonts/, Icons/, Images/, JavaScripts/, StyleSheets/, Favicons/
```

---

## Vite Entry Points

Defined in `Build/vite.config.js`:

| Bundle | Purpose |
|--------|---------|
| `bootstrap.js` | Bootstrap framework initialization |
| `screen.js` | Main frontend (sticky header, theme, etc.) |
| `vue.js` | Vue.js 3 components (includes Swiper integration) |
| `navigationPrimary/Secondary/Tertiary.js` | Navigation levels |
| `print.js` | Print-specific styles |
| `backend.js` | TYPO3 backend styles |
| `ckeditor.js` | CKEditor RTE styles |

> **Note:** Swiper is integrated into the `vue.js` bundle -- there is no separate `swiper.js` entry point.

### Adding a New Entry

1. Create JS file in `Build/Assets/Scripts/`
2. Register in `vite.config.js`
3. Run `npm run watch`
4. Include in Fluid:

```html
<f:asset.script identifier="myfeature" src="EXT:mp_core/Resources/Public/JavaScripts/myfeature.js" />
<f:asset.css identifier="myfeature" href="EXT:mp_core/Resources/Public/StyleSheets/myfeature.css" />
```

---

## JavaScript Architecture

### Feature Modules (`Build/Assets/Scripts/code/`)

**Core:** `main.js`, `i18n.js`, `i18nLinkHelper.js`

**UI:** `jarallax.js`, `modalGallery.js`, `openAccordionAndTabs.js`, `pagination.js`, `sticky.js`, `totop.js`

**Navigation:** `nav-toggle.js`, `Navigation/Primary/navigation.js`, `Navigation/Secondary/navigation.js`, `Navigation/Tertiary/navigation.js`

**Layout:** `moveHeaderDate.js`, `moveMeta.js`, `theme.js`

### Shared Utilities (`Utils/domUtils.js`)

- `debounce(func, wait)` -- Performance-safe resize/scroll handling
- `toggleNavState(...)` -- Navigation open/closed state
- `handleDropdownVisibility(element, showCb, hideCb)` -- Bootstrap dropdown events
- `toggleAriaLabelAndTitle(element, openLabel, closeLabel)` -- Accessible label toggling

---

## Vue.js Components

Located in `Build/Assets/Scripts/components/`:

| Component | Description |
|-----------|-------------|
| `TodoList.vue` | Interactive todo with localStorage, registered as CType `mpcore_todolist` |
| `GallerySwiper.vue` | Swiper-based gallery carousel for the gallery content element |
| `SwiperSlider.vue` | Generic Swiper slider for container slider elements |

Component registration is handled in `code/Vue/vue-initialisation.js`.

### Creating a New Component

1. Create `.vue` file in `Build/Assets/Scripts/components/`
2. Register in `code/Vue/vue-initialisation.js`
3. Build and include via `<f:asset.script>` in Fluid (the `vue.js` entry point auto-mounts registered components).

---

## SCSS Architecture (ITCSS)

Layers from low to high specificity:

1. **Settings** (`Base/`) -- Variables, fonts, color maps
2. **Tools** (`Mixins/`) -- Functions, mixins (no CSS output)
3. **Generic** -- Reset, normalize (from Bootstrap)
4. **Elements** (`Elements/`) -- Base HTML elements
5. **Objects** -- Layout patterns
6. **Components** (`Modules/`) -- Styled UI components
7. **Utilities** -- Helper classes

### Bootstrap Customization

- Light theme: `Build/Assets/Scss/Base/Bootstrap/_custom-variables.scss`
- Dark theme: `Build/Assets/Scss/Base/Bootstrap/_custom-variables-dark.scss`

---

## Asset Handling

| Asset Type | Pattern |
|------------|---------|
| Images in SCSS | `url('../../Images/Icons/icon.png')` (relative path) |
| Fonts | `@include font-face('Name', '../../Fonts/file', 400, normal, woff2)` |
| Inline SVG | `svg-load('../Images/Icons/arrow.svg')` |
| Static files | `Build/Assets/Static/` -> copied to `Resources/Public/` |

---

## Template Integration

### Fluid

```html
<f:asset.css identifier="screen" href="EXT:mp_core/Resources/Public/StyleSheets/screen.css" />
<f:asset.script identifier="screen" src="EXT:mp_core/Resources/Public/JavaScripts/screen.js" />
```

### TypoScript

```typoscript
page {
  includeCSS.screen = EXT:mp_core/Resources/Public/StyleSheets/screen.css
  includeJSFooter.screen = EXT:mp_core/Resources/Public/JavaScripts/screen.js
}
```

Template path precedence: higher numbers override lower (`0` = core, `10` = extension, `20+` = project).

---

## Extension Overrides

| Extension | Path | Notes |
|-----------|------|-------|
| fluid_styled_content | `Resources/Extensions/fluid_styled_content/Private/` | Bootstrap 5 styled |
| form | `Resources/Extensions/form/` | Bootstrap forms + YAML config |
| news | `Resources/Extensions/news/` | List, detail, category views |
| indexed_search | `Resources/Extensions/indexed_search/` | Bootstrap search results |

---

## Best Practices

**JavaScript:** Modular code in `code/`, shared patterns in `Utils/`, debounce resize/scroll, event delegation, ARIA labels, lint before commit.

**SCSS:** Respect ITCSS layers, CSS variables for theming, logical properties for RTL, max 3 nesting levels, mobile-first `min-width` queries.

**Vue.js:** Single File Components, scoped styles, prop validation, Composition API for complex logic.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on fonts | Check `../` segments from SCSS to `Fonts/` |
| Images missing in CSS | Verify path in `Assets/Images/` |
| Bundle too large | Import only needed Bootstrap components |
| Changes not appearing | Clear browser + TYPO3 caches |

**Important:** Never edit `Resources/Public/` directly. Always edit in `Build/Assets/` and run `npm run build`.

---

## Further Reading

- [Favicons](Favicons.md) -- Favicon generation
- [Configuration](Configuration.md) -- Site Sets, TypoScript, TCA
- [Vite](https://vitejs.dev/) | [Vue.js](https://vuejs.org/) | [Bootstrap 5](https://getbootstrap.com/docs/5.3/) | [ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
