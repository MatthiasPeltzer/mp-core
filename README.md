# MP Core · TYPO3 13 / 14 Site Package

MP Core delivers a Bootstrap 6– and Vue-powered site package for TYPO3 13.4 / 14.3, including ready-made content elements, container layouts, Schema.org structured data, and a Vite-based frontend toolchain. It is designed as a solid starting point for personal, corporate and public sector websites.

> **Git branches:** Frontend work on **`feature/bootstrap-6`** uses **Bootstrap 6** (`6.0.0-alpha.1`). Release branch **`main`** still ships **Bootstrap 5.3** for production — do not merge BS6 into `main`. See [Frontend — Bootstrap branches](Documentation/Frontend.md#bootstrap-version-and-git-branches).

- Prebuilt content modules (stage, banner, gallery, single teaser, menu subpages, Vue todo list) with Fluid templates.
- Container elements (accordion, tabs, slider, grid, wrapper) via b13/container.
- Content Blocks support (definition list) via friendsoftypo3/content-blocks.
- Six Site Sets (`mp-core`, `mp-core-base`, `mp-core-container`, `mp-core-news`, `mp-core-form`, `mp-core-seo`) that plug into TYPO3 Site Settings.
- Schema.org JSON-LD output (WebSite, WebPage, BlogPosting, BreadcrumbList, MusicGroup, NewsArticle).
- Frontend build pipeline: Vite 8, strict TypeScript, Bootstrap **6.0.0-alpha.1**, Vue 3, Sass, PostCSS, ESLint, Stylelint, Vitest (browser), Swiper 14, and Jarallax (`Build/` — see [Build/README.md](Build/README.md)).

## Requirements

- TYPO3 `^13.4 || ^14.3`
- PHP `>=8.2`
- Node.js `>=22` and npm `>=10` for the frontend build

## Quick Start

```bash
composer require mpc/mp-core
vendor/bin/typo3 extension:activate mp_core
cd Build && npm ci
npm run build
```

## Documentation

Detailed guides live in [`Documentation/README.md`](Documentation/README.md):

- [Feature overview](Documentation/OVERVIEW.md) — content elements, Site Sets, PHP classes
- [Frontend / Vite](Documentation/Frontend.md) — build pipeline, TypeScript, and Vue components
- [Bootstrap 6 migration](Documentation/Bootstrap6Migration.md) — wizards, codemods, verification (feature branch)
- [Configuration](Documentation/Configuration.md) — Site Settings, TypoScript, TCA
- [Backend](Documentation/Backend.md) — RTE, TSconfig, backend previews
- [Content elements](Documentation/ContentElements.md) — per-CType TCA reference
- [Favicons](Documentation/Favicons.md) — assets, Fluid partial, site config (not static HTML paste)

## License & Support

- GPL-2.0-or-later -- see `LICENSE`
- Author: Matthias Peltzer (`mail@mpcore.de`, https://www.mpcore.de/)
