# Frontend

Build system, asset pipeline, JavaScript/SCSS architecture, and best practices.

---

## Requirements

- **Node.js** >=22 (Node 24 recommended)
- **npm** >=10

## Technology Stack

- **Vite 8** -- Build tool with HMR
- **Vue.js 3.5** -- Interactive components (TodoList, GallerySwiper, SwiperSlider)
- **Bootstrap** -- **5.3** on `main` (production line); **6.0.0-alpha.1** (npm) on `feature/bootstrap-6` — see [Bootstrap version and Git branches](#bootstrap-version-and-git-branches)
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

## Bootstrap version and Git branches

The Bootstrap 6 migration is developed on a long-lived feature branch. **`main` stays on Bootstrap 5** for production releases. **Do not merge `feature/bootstrap-6` into `main`** — keep BS6 work on the feature branch only.

| Git branch | Bootstrap (`Build/package.json`) | Role |
|------------|----------------------------------|------|
| **`main`** | `5.3.x` (npm) | Default branch; matches [mpcore.de](https://www.mpcore.de/) and receives version releases / hotfixes. |
| **`feature/bootstrap-6`** | `6.0.0-alpha.1` (npm) | Work-in-progress: SCSS bundle, Fluid markup, JS (Menu/Dialog), and rebuilt public assets. |

### Workflow

1. **Bootstrap 6 work** — Check out **`feature/bootstrap-6`**, commit and push there until the frontend is updated and verified (local DDEV, visual/regression checks, tests).
2. **Production and releases** — Branch from **`main`**, merge back to **`main`**. **Never merge `feature/bootstrap-6` into `main`.**
3. **Stay current** — Periodically merge **`main`** into **`feature/bootstrap-6`** (or rebase the feature branch) so BS5-line fixes and dependency updates are not lost during the migration.
4. **Local vs deployed** — DDEV (or any BS6 environment) checks out **`feature/bootstrap-6`**. Production and release tags stay on **`main`** (Bootstrap 5).

After `git checkout`, confirm the active dependency:

```bash
grep '"bootstrap"' Build/package.json
```

Document migration notes in **`CHANGELOG.md`** under `[Unreleased]` on the feature branch; **`main`** release versioning stays manual and separate from the BS6 branch.

**Upgrade wizards and DDEV steps:** [Bootstrap6Migration.md](Bootstrap6Migration.md).

### Migration principles (`feature/bootstrap-6`)

On this branch, **prefer Bootstrap 6 defaults** (compiled tokens, component markup, utilities, JS APIs) and migrate HTML, SCSS, and JavaScript off Bootstrap 5 patterns. Keep MPC-only layout/theming in site SCSS; avoid long-lived v5 class aliases when Fluid or RTE content can use v6 names.

| Area | Bootstrap 5 (do not add) | Bootstrap 6 |
|------|--------------------------|---------------|
| Floating placement | `@popperjs/core`, `data-bs-popper`, `popperConfig` | `@floating-ui/dom` (peer dep + Vite chunk `vendor-floating-ui`), Menu `data-bs-display` / `data-bs-reference` / `data-bs-boundary` / `data-bs-placement`, optional `floatingConfig` in JS |
| Overlays | `.modal`, `data-bs-toggle="modal"`, `*.bs.modal` | `.dialog`, `<dialog>`, `data-bs-toggle="dialog"`, `*.bs.dialog` |
| Flyouts | `.dropdown`, `.dropdown-menu`, `data-bs-toggle="dropdown"`, `*.bs.dropdown` | `.menu`, `data-bs-toggle="menu"`, `*.bs.menu` (toggle and `.menu` are siblings) |
| Responsive utilities | `col-md-6`, `d-lg-none`, … | `md:col-6`, `lg:d-none`, … |

MPC SCSS reads **BS6 tokens** only: `--primary-base`, `--bg-body`, `--gray-*`, `--font-size-*`, `--line-height-*`, frame ladder `--bg-1` … `--bg-8` (from `$theme-bgs`). Override BS6 **token maps** in `_mpc-bootstrap-theme.scss` (`$theme-colors`, `$theme-bgs`) and `_mpc-bs6-root-overrides.scss` (`$root-tokens`). Typography uses Bootstrap 6’s default `$font-sizes` (fluid `clamp()` from `lg` upward). In Fluid/Vue markup prefer BS6 utilities (`fs-sm`, `fs-md`, `fs-lg`, … or `text-md` for size + line-height) — not legacy `fs-base` or BS5 numeric `fs-1`…`fs-6`. Bootstrap 5 **`_custom-variables*.scss`** remain on **`main`** only; they are not part of the BS6 branch build.

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

### Baseline (2026-10-10)

Captured after vendor chunking, BS6 Menu overrides, full `$theme-colors` semantic keys, and Sass module migration. Entry chunks below; vendor JS/CSS are separate (`vendor-bootstrap`, `vendor-vue`, `vendor-swiper`, …).

| Bundle | Raw | Gzip | Brotli |
|---|---:|---:|---:|
| `bootstrap.js` (stub) | 39 B | 59 B | 43 B |
| `screen.js` | 16.7 KiB | 5.5 KiB | 4.9 KiB |
| `vue.js` | 1.9 KiB | 936 B | 822 B |
| `navigationPrimary.js` | 1.8 KiB | 838 B | 718 B |
| `navigationSecondary.js` | 5.5 KiB | 1.6 KiB | 1.4 KiB |
| `navigationTertiary.js` | 4.8 KiB | 1.5 KiB | 1.3 KiB |
| `bootstrap.css` | 674.6 KiB | 53.8 KiB | 35.3 KiB |
| `screen.css` | 79.8 KiB | 11.7 KiB | 10.0 KiB |
| `vue.css` | 8.8 KiB | 1.6 KiB | 1.4 KiB |
| `navigationPrimary.css` | 18.1 KiB | 2.7 KiB | 2.4 KiB |
| `navigationSecondary.css` | 38.6 KiB | 4.5 KiB | 4.0 KiB |
| `navigationTertiary.css` | 29.8 KiB | 4.0 KiB | 3.6 KiB |
| `ckeditor.css` | 18.3 KiB | 2.6 KiB | 2.3 KiB |
| `print.css` | 1.3 KiB | 558 B | 430 B |
| **total (all JS+CSS in Public/)** | -- | **205.5 KiB** | **169.2 KiB** |

Navigation CSS budgets in `scripts/bundle-budgets.json` include headroom for BS6 specificity overrides; WARN near 90% of budget is expected until the next trim pass.

### Vendor splitting

`vite.config.js` declares a `manualChunks` map that pulls these
`node_modules` paths into named vendor chunks:

| Chunk | Contents |
|---|---|
| `vendor-vue` | `vue`, `@vue/*` |
| `vendor-swiper` | `swiper` |
| `vendor-bootstrap` | `bootstrap` |
| `vendor-floating-ui` | `@floating-ui/dom` (Menu / floating components; replaces v5 Popper) |
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

## TypeScript frontend sources

Page-facing scripts under `Build/Assets/Scripts/` are **strict TypeScript** (`.ts` / Vue SFC `<script setup lang="ts">`), following Bootstrap 6 upstream conventions: `moduleResolution: nodenext`, relative imports with a **`.js` extension** (resolved to `.ts` at build time), no semicolons, erasable syntax only.

- **Typecheck:** `npm run typecheck` (`vue-tsc --noEmit`) — runs before production `npm run build`.
- **Unit tests:** `npm run test:unit` — Vitest **browser mode** with Playwright (Chromium). One-time setup: `npm run test:browser:install`.
- **Larger UI modules** extend Bootstrap `BaseComponent` (navigation variants, search autosuggest, modals, sticky header, back-to-top).
- **Backend stubs** `backend.js` / `ckeditor.js` stay plain JavaScript.

Config: `Build/tsconfig.json`, `Build/env.d.ts`, `Build/vitest.config.mts`.

---

## JavaScript Architecture

### Feature Modules (`Build/Assets/Scripts/code/`)

**Core:** `main.ts`, `i18n.ts`, `i18nLinkHelper.ts`

**UI:** `jarallax.ts`, `modalGallery.ts`, `openAccordionAndTabs.ts`, `pagination.ts`, `sticky.ts`, `totop.ts`

**Navigation:** `nav-toggle.ts`, `Navigation/Primary/navigation.ts`, `Navigation/Secondary/navigation.ts`, `Navigation/Tertiary/navigation.ts`

**Layout:** `moveHeaderDate.ts`, `moveMeta.ts`, `theme.ts`

**Search:** `searchAutosuggest.ts` — type-ahead for `indexed_search` (header and `/suche` form)

### Shared Utilities (`code/Utils/domUtils.ts`)

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

Component registration is handled in `code/Vue/vue-initialisation.ts`.

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

On **`feature/bootstrap-6`**, theme and layout tokens live under `Build/Assets/Scss/Base/Bootstrap/` — e.g. `_mpc-bootstrap-theme.scss`, `_mpc-bs6-root-overrides.scss`, `_mpc-bootstrap-bundle.scss`, `_bootstrap-config.scss`.

Grid breakpoints and container max-widths are **Bootstrap 6 defaults** from npm (`bootstrap/scss/_config.scss`: `lg` 1024px, `xl` 1280px, `2xl` 1536px) — no separate MPC override file. Responsive `<picture>` sources and Swiper JSON use the same `lg` threshold (1024px).

On **`main`**, Bootstrap 5 uses `_custom-variables.scss` and `_custom-variables-dark.scss` (not shipped on the BS6 branch).

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
| fluid_styled_content | `Resources/Extensions/fluid_styled_content/Private/` | Bootstrap markup aligned with the active branch (5 on `main`, 6 on `feature/bootstrap-6`) |
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
- [Vite](https://vitejs.dev/) | [Vue.js](https://vuejs.org/) | [Bootstrap 6](https://getbootstrap.com/docs/6.0/) | [ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
