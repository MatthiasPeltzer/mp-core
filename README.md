# MP Core · TYPO3 13 / 14 Site Package

MP Core delivers a Bootstrap- and Vue-powered site package for TYPO3 13.4 / 14.3, including ready-made content elements, container layouts, Schema.org structured data, and a Vite-based frontend toolchain. It is designed as a solid starting point for corporate and public sector websites.

- Prebuilt content modules (stage, banner, gallery, single teaser, menu subpages, Vue todo list) with Fluid templates.
- Container elements (accordion, tabs, slider, grid, wrapper) via b13/container.
- Content Blocks support (definition list) via friendsoftypo3/content-blocks.
- Six Site Sets (`mp-core`, `mp-core-base`, `mp-core-container`, `mp-core-news`, `mp-core-form`, `mp-core-seo`) that plug into TYPO3 Site Settings.
- Schema.org JSON-LD output (WebSite, WebPage, BlogPosting, BreadcrumbList, MusicGroup, NewsArticle).
- Frontend build pipeline based on Vite 8, Bootstrap 5.3, Vue 3, Sass, PostCSS, ESLint, Stylelint, Swiper, and Jarallax.

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

Detailed setup and feature documentation lives in `Documentation/README.md`. Start there for Site Set configuration, content element guides, and frontend workflow notes.

## License & Support

- GPL-2.0-or-later -- see `LICENSE`
- Author: Matthias Peltzer (`mail@mpeltzer.de`, https://www.mpeltzer.de/)
