# MP Core -- Feature Overview

Overview of all functions, features, and integrations provided by **mpc/mp-core**.

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

1. `mpc/mp-core` (aggregator) -- Pulls in all feature sets below; **include this one** in `config/sites/*/config.yaml` for a full stack
2. `mpc/mp-core-base` (required foundation) -- System extension dependencies (`typo3/form`, `typo3/indexed-search`, …) and shared Site Settings definitions (YAML files live under `Configuration/Sets/mp-core/`)
3. `mpc/mp-core-container` -- Container element configuration
4. `mpc/mp-core-news` -- News extension integration (`georgringer/news`)
5. `mpc/mp-core-form` -- Form framework configuration
6. `mpc/mp-core-seo` -- SEO optimization settings

**Custom feature sets** must depend on `mpc/mp-core-base`, not on `mpc/mp-core` — otherwise TYPO3’s SetRegistry can deadlock (`aggregator → child → aggregator → …`). See `Configuration/Sets/mp-core/config.yaml`.

### Optional extension dependencies (`mpc/mp-core-base`)

Activated automatically when the extension is installed:

| Set / extension | Purpose |
|-----------------|---------|
| `georgringer/news-recordlinks` | News record links |
| `georgringer/news-sitemap` | News sitemap |
| `mpc/mpc-vidply` | VidPly video player integration |
| `mpc/mpc-rss` | RSS feed integration |

## Frontend Stack

- Vite 8, Bootstrap 5.3, Vue.js 3.5, Sass 1.99, PostCSS, ESLint 10, Stylelint 17, Swiper 12, Jarallax 3
- ITCSS-based SCSS architecture with light/dark themes
- Code splitting, tree shaking, lazy loading, WOFF2 font subsetting

## PHP Classes

### DataProcessors

- **HeaderLogoProcessor** -- Resolves per-language and site-level logo settings (`logoBig`, `logoSmall`, `logoSvg`, `logoText`, `logoTextHidden`, `websiteTitle`) once per page render for `Header.Logo.html` / `Header.Background.html`
- **StructuredDataProcessor** -- Builds a Schema.org JSON-LD `@graph` (WebSite, WebPage/BlogPosting, BreadcrumbList, MusicGroup) with safe `json_encode` output
- **SocialMediaProcessor** -- Extracts social media URLs from site configuration for `sameAs` arrays and template rendering

### Event listeners

- **CompressHtmlWhitespaceOnCacheableContentListener** -- Minifies HTML on `AfterCacheableContentIsGeneratedEvent` before the page cache row is written. Preserves `<pre>`, `<textarea>`, `<script>`, `<style>`, `<svg>`, and HTML comments. Always on; no Site Setting toggle.

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
- [Configuration](Configuration.md) -- Site Sets, TypoScript, TCA, Site Settings
- [Backend](Backend.md) -- RTE, TSconfig, previews, Content Blocks
- [Content elements](ContentElements.md) -- Gallery, stage, banner, containers, field reference
- [Favicons](Favicons.md) -- Favicon assets, `Favicons.html`, web manifest
