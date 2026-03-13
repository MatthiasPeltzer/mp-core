# MP Core - Feature Overview

TYPO3 ^13.4 | PHP >=8.2 | Node.js >=20 -- See [README](../README.md) for installation.

---

## Content Elements

- **Gallery** - Responsive image galleries with lightbox
- **Stage** - Hero sections with image/video backgrounds
- **Banner** - Customizable banner sections
- **Single Teaser** - Content teasers with images and links
- **Accordion** - Collapsible content sections (b13/container)
- **Tabs** - Tabbed content panels (b13/container)
- **Slider** - Swiper-powered carousels (b13/container)
- **Grid** - Flexible column layouts (b13/container)
- **Container** - Generic content wrapper (b13/container)
- **TodoList** - Vue.js 3 interactive todo with localStorage
- **Menu Subpages** - Enhanced subpage menus
- **Definition List** - Structured definition lists (Content Block)

## Site Sets

1. `mpc/mp-core` (required) - Core functionality
2. `mpc/mp-core-container` - Container element configuration
3. `mpc/mp-core-news` - News extension integration
4. `mpc/mp-core-form` - Form framework configuration
5. `mpc/mp-core-seo` - SEO optimization settings

## Frontend Stack

- Vite 7.2, Bootstrap 5.3.8, Vue.js 3.5, Sass 1.96, PostCSS, ESLint 9, Stylelint 16, Swiper 12, Jarallax 2
- ITCSS-based SCSS architecture with light/dark themes
- Code splitting, tree shaking, lazy loading, WOFF2 font subsetting

## PHP Classes

- **SvgInlineViewHelper** - Inline SVG rendering with attributes
- **Json\DecodeViewHelper** - JSON decoding in Fluid templates
- **ColorPickerValueItems** - Dynamic color picker from site configuration
- **FilesControlContainer** - Enhanced file field container
- **CustomContentPreviewRenderer** - Backend preview with v14 fallback

## Extension Integrations

- **fluid_styled_content** - Bootstrap 5 styled content rendering
- **EXT:news** - List/detail views, categories, pagination
- **EXT:form** - Bootstrap forms, YAML configuration
- **EXT:indexed_search** - Bootstrap search results
- **EXT:seo** - Open Graph, Twitter Cards, Schema.org, XML sitemap

## Accessibility

- Keyboard navigation, screen reader announcements, ARIA labels/roles
- Skip links, focus management, high contrast mode (forced-colors)

---

## Documentation

- [Frontend](Frontend.md) - Build system, JS/SCSS architecture
- [Configuration](Configuration.md) - Site Sets, TypoScript, TCA
- [Favicons](Favicons.md) - Favicon generation pipeline
