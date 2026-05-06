# MP Core -- Feature Overview

TYPO3 ^13.4 / ^14.3 | PHP >=8.2 | Node.js >=20 -- See [README](../README.md) for installation.

---

## Content Elements

- **Gallery** -- Responsive image galleries with lightbox (Swiper-powered via Vue)
- **Stage** -- Hero sections with image/video backgrounds
- **Banner** -- Customizable banner sections
- **Single Teaser** -- Content teasers with images and links
- **Accordion** -- Collapsible content sections (b13/container)
- **Tabs** -- Tabbed content panels (b13/container)
- **Slider** -- Swiper-powered carousels (b13/container)
- **Grid** -- Flexible column layouts (b13/container)
- **Container** -- Generic content wrapper (b13/container)
- **TodoList** -- Vue.js 3 interactive todo with localStorage
- **Menu Subpages** -- Enhanced subpage menus
- **Definition List** -- Structured definition lists (Content Block)

## Site Sets

1. `mpc/mp-core` (aggregator) -- Pulls in all feature sets below
2. `mpc/mp-core-base` (required) -- Core functionality, shared settings, system dependencies
3. `mpc/mp-core-container` -- Container element configuration
4. `mpc/mp-core-news` -- News extension integration
5. `mpc/mp-core-form` -- Form framework configuration
6. `mpc/mp-core-seo` -- SEO optimization settings

## Frontend Stack

- Vite 8, Bootstrap 5.3, Vue.js 3.5, Sass 1.99, PostCSS, ESLint 10, Stylelint 17, Swiper 12, Jarallax 3
- ITCSS-based SCSS architecture with light/dark themes
- Code splitting, tree shaking, lazy loading, WOFF2 font subsetting

## PHP Classes

### DataProcessors

- **StructuredDataProcessor** -- Builds a Schema.org JSON-LD `@graph` (WebSite, WebPage/BlogPosting, BreadcrumbList, MusicGroup) with safe `json_encode` output
- **SocialMediaProcessor** -- Extracts social media URLs from site configuration for `sameAs` arrays and template rendering

### ViewHelpers

- **SvgInlineViewHelper** (`mpc:svgInline`) -- Inline SVG rendering with DOM sanitization, attribute merging, and per-request caching
- **Format\CssSanitizeViewHelper** (`mpc:format.cssSanitize`) -- Sanitizes CSS strings to prevent style-tag breakout and dangerous constructs
- **Format\Json\DecodeViewHelper** (`mpc:format.json.decode`) -- JSON decoding in Fluid templates
- **Schema\NewsArticleJsonLdViewHelper** (`mpc:schema.newsArticleJsonLd`) -- Emits NewsArticle JSON-LD for EXT:news detail views

### Backend / UserFunc

- **ColorPickerValueItems** -- Dynamic color picker `itemsProcFunc` reading `color-*` keys from site configuration
- **FilesControlContainer** -- Enhanced file field container forwarding `fieldInformation` config
- **CustomContentPreviewRenderer** -- Backend preview renderer with TYPO3 v14 TypeError fallback handling

### Exceptions

- **FileException** -- Domain exception for SVG/file operations with context array

## Vue Components

- **TodoList** -- Interactive todo list with localStorage persistence
- **GallerySwiper** -- Swiper-based gallery carousel for the gallery content element
- **SwiperSlider** -- Generic Swiper slider component for container slider elements

## Extension Integrations

- **fluid_styled_content** -- Bootstrap 5 styled content rendering
- **EXT:news** -- List/detail views, categories, pagination
- **EXT:form** -- Bootstrap forms, YAML configuration
- **EXT:indexed_search** -- Bootstrap search results
- **EXT:seo** -- Open Graph, Twitter Cards, Schema.org, XML sitemap

## Accessibility

- Keyboard navigation, screen reader announcements, ARIA labels/roles
- Skip links, focus management, high contrast mode (forced-colors)

---

## Documentation

- [Frontend](Frontend.md) -- Build system, JS/SCSS architecture
- [Configuration](Configuration.md) -- Site Sets, TypoScript, TCA
- [Favicons](Favicons.md) -- Favicon generation pipeline
