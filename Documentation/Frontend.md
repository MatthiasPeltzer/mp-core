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

In an **mpc monorepo** with DDEV running, you can also build from the site root: `ddev mp-core-build` (same as `npm run build` inside `libs/mp-core/Build/`).

Output goes to `Resources/Public/` (JavaScripts, StyleSheets, Fonts, Icons, Images, **Favicons**, BackendLayouts).

| Script | Description |
|--------|-------------|
| `build` | Lint + production build (minified, optimized) + bundle-size gate |
| `build:analyze` | Production build with `rollup-plugin-visualizer` (writes `reports/bundle-stats.html`) |
| `dev` | Lint + development build with source maps |
| `watch` | Development build with file watcher |
| `check-size` | Run the bundle-size budget gate against `Resources/Public/` |
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
│   │   │   ├── Utils/          # Shared utilities (domUtils.js, …)
│   │   │   ├── Vue/            # vue-initialisation.js (component registry)
│   │   │   └── Navigation/     # Primary / Secondary / Tertiary
│   │   └── components/         # Vue SFCs
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

## Bundle Budgets

Every `npm run build` finishes by invoking `scripts/check-bundle-size.js`. The
script reads each compiled JS/CSS file from `Resources/Public/`, computes
gzip (level 9) and brotli (quality 11) sizes, compares them against
`scripts/bundle-budgets.json`, and exits non-zero if any per-file or
combined-total budget is exceeded. A WARN (orange light) is emitted when a
bundle is within 10% of its budget -- that is the signal to refactor before
the next feature pushes us over.

If a bundle grew legitimately (new component, intentional dependency upgrade),
update `scripts/bundle-budgets.json` in the **same commit** as the size
change. Never raise a budget just to silence the gate.

### Baseline (2026-06-03)

Captured against Vite 8, Bootstrap 5.3.8, Vue 3.5, Swiper 12.

| Bundle | Raw | Gzip | Brotli |
|---|---:|---:|---:|
| `bootstrap.js` | 65.9 KiB | 20.1 KiB | 17.9 KiB |
| `screen.js` | 33.0 KiB | 9.6 KiB | 8.6 KiB |
| `vue.js` | 239.8 KiB | 72.5 KiB | 63.8 KiB |
| `navigationPrimary.js` | 1.7 KiB | 662 B | 560 B |
| `navigationSecondary.js` | 5.6 KiB | 1.3 KiB | 1.2 KiB |
| `navigationTertiary.js` | 4.4 KiB | 1.3 KiB | 1.1 KiB |
| `paginationTruncate.js` | 1.7 KiB | 733 B | 579 B |
| `theme-init.js` | 222 B | 183 B | 129 B |
| `bootstrap.css` | 174.1 KiB | 24.2 KiB | 17.5 KiB |
| `screen.css` | 67.4 KiB | 10.6 KiB | 9.1 KiB |
| `vue.css` | 24.2 KiB | 3.9 KiB | 3.4 KiB |
| `navigationPrimary.css` | 7.8 KiB | 1.8 KiB | 1.6 KiB |
| `navigationSecondary.css` | 25.2 KiB | 3.6 KiB | 3.2 KiB |
| `navigationTertiary.css` | 17.3 KiB | 3.2 KiB | 2.8 KiB |
| `ckeditor.css` | 18.3 KiB | 2.7 KiB | 2.3 KiB |
| `print.css` | 1.3 KiB | 559 B | 432 B |
| **total** | -- | **158.7 KiB** | **135.8 KiB** |

After the manual-chunk + dynamic-import refactor (see "Vendor splitting"
below), expect `vue.js` itself to shrink considerably as the Vue runtime,
Swiper, and the three Vue SFCs move into long-lived `vendor-*` / per-SFC
chunks. Re-run `npm run check-size` once after the next build and lower
the affected budgets in `scripts/bundle-budgets.json`.

### Vendor splitting

`vite.config.js` declares a `manualChunks` map that pulls these
`node_modules` paths into named vendor chunks:

| Chunk | Contents |
|---|---|
| `vendor-vue` | `vue`, `@vue/*` |
| `vendor-swiper` | `swiper` |
| `vendor-bootstrap` | `bootstrap` |
| `vendor-popper` | `@popperjs/core` |
| `vendor-jarallax` | `jarallax` |

Vendor chunks change only when the pinned dependency changes, so they stay
in HTTP cache across deployments while our own application code rotates.

### Code splitting Vue components

`code/Vue/vue-initialisation.js` uses dynamic `import()` per component, so
each `.vue` SFC compiles to its own chunk. A page that mounts only
`SwiperSlider` never downloads `TodoList` or `GallerySwiper`. Add new
components by extending the `componentLoaders` map in
`vue-initialisation.js`.

### On-demand vendor: Jarallax

`code/jarallax.js` lazy-loads the Jarallax vendor bundle via dynamic
`import('jarallax')`, gated on a `document.querySelectorAll('.grid-parallax')`
presence check. The `.grid-parallax` wrapper is only emitted by
`fluid_styled_content/Layouts/Container.html` when an editor toggles the
**Parallax** checkbox (`grid_parallax = 1`) on a `ce_container`-style
content element.

Effect: pages without a parallax container never request the
`vendor-jarallax-*.js` chunk (~26 KiB raw / ~7 KiB gzip / ~6 KiB brotli).
The chunk stays a separate, cacheable asset thanks to the `manualChunks`
map; only the network request changes from eager to deferred.

### Visualising the bundle

```bash
npm run build:analyze
```

Writes `Build/reports/bundle-stats.html` (treemap, gzip + brotli aware,
gitignored). Open it directly in a browser; no server required.

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

**Search:** `searchAutosuggest.js` — type-ahead for `indexed_search` (header and `/suche` form)

### Shared Utilities (`code/Utils/domUtils.js`)

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

Vue mounts on elements with `data-container="vue"` and `data-component="ComponentName"` (see `VueComponents.typoscript` and content element templates). Optional `data-*` attributes pass props (e.g. `data-card-title` on TodoList).

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
| indexed_search | `Resources/Extensions/indexed_search/` | Bootstrap search results + autosuggest combobox |

---

## Search (indexed_search)

mp-core replaces the default indexed_search templates and adds an accessible **autosuggest** combobox for the header search field and the dedicated search page (`/suche`).

### Site settings

Configure in **Site Management → Sites → Settings → Search** (or `config/sites/<id>/settings.yaml`):

| Setting | Default | Effect |
|---------|---------|--------|
| `search.headerSearch` | `true` | Show the header search field (all navigation variants) |
| `search.autosuggest` | `true` | Type-ahead suggestions for header and `/suche` forms |

When autosuggest is off, both forms fall back to a plain search field.

### Behaviour

- Suggestions are fetched as JSON from `SearchSuggestMiddleware` / `SearchSuggestService` — indexed base words plus matching page titles, scoped to the current site, language, and frontend-user access (no Solr required).
- The combobox follows the WAI-ARIA listbox pattern with keyboard navigation and polite status announcements.
- **Top results** link to the same detail URLs as full search results (including mediathek entries resolved via indexer route arguments).
- Header search submits via POST to the indexed_search `search` action route (cHash-safe). On desktop navType 1/2/3 the field appears in the meta-bar flyout or inline in the mobile hamburger menu depending on breakpoint.

Frontend module: `Build/Assets/Scripts/code/searchAutosuggest.js` (bundled in `screen.js`).

---

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

- [Favicons](Favicons.md) -- Favicon assets and Fluid partial (do not overwrite with `output.html`)
- [Configuration](Configuration.md) -- Site Sets, TypoScript, TCA
- [Vite](https://vitejs.dev/) | [Vue.js](https://vuejs.org/) | [Bootstrap 5](https://getbootstrap.com/docs/5.3/) | [ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
