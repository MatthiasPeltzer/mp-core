# MP Core · TYPO3 13.4 Site Package

MP Core delivers a Bootstrap- and Vue-powered site package for TYPO3 13.4, including ready-made content elements, container layouts, and a Vite-based frontend toolchain. It is designed as a solid starting point for corporate and public sector websites.

- Prebuilt content modules (stage, banner, media, galleries, Vue todo list) with Fluid templates.
- Optional Site Sets for containers, news, forms, and SEO that plug into TYPO3 Site Settings.
- Frontend build pipeline based on Vite, SCSS, PostCSS, ESLint, Stylelint, Swiper, Jarallax, and VidPly.

## Requirements
- TYPO3 `^13.4`
- PHP `>=8.2`
- Node.js `>=20` and npm `>=10` for the frontend build

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
- GPL-3.0-or-later — see `LICENSE`
- Author: Matthias Peltzer (`mail@mpeltzer.de`, https://www.mpeltzer.de/)
