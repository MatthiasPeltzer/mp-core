# MP Core Documentation

Documentation hub for **mpc/mp-core** — the TYPO3 13.4 / 14.3 site package (`extension-key`: `mp_core`).

---

## Getting Started

- **[Installation & Quick Start](../README.md)** -- Composer install, extension activation, first build
- **[Feature Overview](OVERVIEW.md)** -- Content elements, Site Sets, PHP stack, integrations

## Guides

| Guide | Topics |
|-------|--------|
| [Frontend](Frontend.md) | Vite 8, SCSS (ITCSS), JavaScript modules, Vue 3 components |
| [Configuration](Configuration.md) | Site Sets, Site Settings (auto-synced from YAML), TypoScript, TCA |
| [Backend](Backend.md) | RTE preset, Page TSconfig, previews, backend layouts, Content Blocks |
| [Content elements](ContentElements.md) | Per-CType field reference (gallery, stage, containers, …) |
| [Favicons](Favicons.md) | Icon assets, `Favicons.html`, site config, dynamic manifest (`typeNum` 8412) |

## Package layout (quick reference)

| Path | Purpose |
|------|---------|
| `Build/` | Vite source and `npm` scripts — edit assets here |
| `Classes/` | PHP (DataProcessors, ViewHelpers, Middleware, Backend) |
| `Configuration/` | Site Sets, TypoScript, TCA, Services |
| `ContentBlocks/` | TYPO3 Content Blocks (e.g. definition list) |
| `Resources/Private/` | Fluid templates, XLF, Form YAML |
| `Resources/Public/` | **Generated** — output of `npm run build`; do not edit |

## External Resources

- [TYPO3 Documentation](https://docs.typo3.org/)
- [Bootstrap 5](https://getbootstrap.com/docs/5.3/)
- [Vue.js 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Swiper](https://swiperjs.com/)
- [b13/container](https://github.com/b13/container)
