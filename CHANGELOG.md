# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Register `RobotsTxtMiddleware` and `LlmsTxtMiddleware` as public DI services so TYPO3 resolves constructor dependencies from the container instead of calling `GeneralUtility::makeInstance()` with no arguments.

### Changed
- Declare `extra.typo3/cms.Package.providesPackages` in `composer.json` for TYPO3 v14.3 metadata.
- Exclude `Build/node_modules` from PHP-CS-Fixer scans; switch ruleset to `@PER-CS1x0`.

## [1.2.12] - 2026-07-05

### Fixed
- Structured data no longer emits a `MusicGroup` extra entity when Site Settings → Additional entity type is set to “none”, even if the legacy `musicGroupEnabled` site configuration flag is still enabled.

## [1.2.11] - 2026-07-04

### Changed
- The teaser headline is now linked whenever a `tx_link` target is set (navigate, non-modal), independent of `tx_link_switch`. `tx_link_switch` now only controls whether the separate button/link-text is shown, not whether the headline links.

## [1.2.10] - 2026-07-04

### Changed
- Teaser vs. modal link elements now differentiate the link target by `tx_link_action`: for `navigate` teasers (`singleteaser`, `stage`) the headline is the stretched link and the button/link-text renders as a non-interactive label; for `modal` link boxes the headline is not linked and the button/link-text becomes the modal trigger.

### Accessibility
- Navigate teasers no longer emit a second link to the same target beneath the `stretched-link` headline, removing duplicate/nested interactive controls announced by assistive technology.

## [1.2.9] - 2026-07-04

### Added
- Structured-data publisher identity Site Settings (`seo.schema.*`): `legalName`, `alternateName`, `description`, `foundingDate`, `vatId`, `taxId`, `email`, `telephone`, a `contactPoint` (type, telephone, email, area served, languages) and a `PostalAddress` (`address.*`). These enrich the Organization/Person publisher node in the JSON-LD `@graph`.
- Publisher expertise Site Setting `seo.schema.knowsAbout` (comma-separated topics) — emitted on both `Organization` and `Person` publishers.
- Person-only publisher Site Setting `seo.schema.person.jobTitle` — emitted on the `Person` publisher only.
- `PublisherSchemaBuilder`: shared service that assembles the Schema.org publisher (Organization/Person) used by both the site-wide `@graph` and the `NewsArticle` markup, so the publisher `@type`, logo and `@id` stay identical across the page.
- `seo.robots.crawlDelay` Site Setting to emit an optional `Crawl-delay` directive in the generated `robots.txt` (0 = off).
- `llms.txt` now includes an optional configurable intro (`seo.llmsTxt.intro`), an "About" section derived from the `seo.schema.*` publisher settings (name, type, email, expertise), and a "Latest news" section listing recent EXT:news articles per language (opt-in via `seo.llmsTxt.news.storagePid` + `seo.llmsTxt.news.detailPageId`, capped by `seo.llmsTxt.news.limit`).
- Per-language `llms.txt` content via Site Configuration → Languages: new `site_language` fields `llmsTxtDescription` and `llmsTxtIntro` (translatable in the backend) override the global description/intro per language; the localized `websiteTitle` is now used for the llms.txt heading.
- `LanguageAwarePageRepositoryFactory` service; the `llms.txt` page menu is now resolved through a language-aware `PageRepository`, so translated variants (e.g. `/en/llms.txt`) list page titles and descriptions in the correct language instead of the default one.
- `LlmsTxtNewsProvider` service that resolves recent EXT:news records and their detail URLs for the llms.txt news section, degrading gracefully when EXT:news is absent or unconfigured.

### Changed
- Publisher/Organization JSON-LD now emits the configured identity, contact and postal-address details, and the logo `ImageObject` now includes `width`/`height`.
- `NewsArticle` JSON-LD now includes `author` (from the news author, falling back to the site title), a full `publisher` (with logo, via the shared builder) and `mainEntityOfPage`.
- `WebPage`/`BlogPosting` now references the `BreadcrumbList` by `@id` and adds `primaryImageOfPage` when page media is present.
- Structured-data output is now gated by both `structuredDataEnabled` (base) and `seo.schema.enabled` (SEO); the previously unused `seo.schema.enabled` toggle is now honored. Both must be true to emit JSON-LD.
- Generated `robots.txt` now includes a header comment (site name), and disallows TYPO3 temp/derivative directories (`/typo3temp/`, `/fileadmin/_processed_/`) and parameterized duplicate URLs (`?cHash=`, `?tx_`) in the default `User-agent: *` group.
- Generated `robots.txt` now advertises one `Sitemap:` line per enabled site language (e.g. `/sitemap.xml` and `/en/sitemap.xml`), so per-language EXT:seo sitemaps are all discoverable from the single root robots.txt.
- `llms.txt` is now served per enabled site language (`/llms.txt`, `/en/llms.txt`, …), each listing that language's pages, linking its own localized XML sitemap and cross-linking the other language variants under a `## Languages` section. The site description now uses the llms.txt spec's `>` blockquote summary.

### Security
- `CssSanitizeViewHelper`: harden the CSS sanitizer against nested/overlapping token bypasses (e.g. `</sty</stylele>` collapsing to `</style>`, `<scr<scriptipt` to `<script`) by re-applying each removal rule until the string stops changing.

### Fixed
- `MP_CORE_PANEL_ALLOWED_CONTENT_TYPES` is now declared with a guarded `define()` instead of a top-level `const`, so re-evaluating the container TCA override (when the TCA is rebuilt more than once in a single PHP process) no longer raises a "Constant already defined" warning.

### Tests
- Unit tests for `PublisherSchemaBuilder` (publisher type resolution, Organization vs Person fields, contact/address assembly, `sameAs`) and for the combined structured-data enable toggle.
- Functional test coverage for the Organization identity/contact/address fields, the WebPage↔BreadcrumbList `@id` reference and the `seo.schema.enabled` opt-out.
- Unit tests for the CSS and JSON-LD trust-boundary ViewHelpers (`CssSanitize`, `CssColor`, JSON `Decode`, `FaqPageJsonLd`, `NewsArticleJsonLd`) and the `StructuredDataExtraEntityType` enum.
- Unit tests for the SEO / structured-data logic: `SocialMediaProcessor`, `HeaderLogoProcessor`, `StructuredDataProcessor`, the `robots.txt` / `llms.txt` middleware and their shared geo-text trait, and `FileException`.
- Functional-test harness (`Build/FunctionalTests.xml` + bootstrap, SQLite by default, overridable to MariaDB/MySQL) with a `WebFontProcessor` test covering the real QueryBuilder / FAL resolution path, and a `StructuredDataProcessor` test that renders a real frontend page and asserts the emitted JSON-LD `@graph` (publisher, WebSite, WebPage and breadcrumb) with real site routing.
- `composer test:functional`, `composer test:coverage` and `composer test:coverage:merged` (merged unit + functional coverage report) scripts.

## [1.2.8] - 2026-07-04

### Added
- `ce_modal` container content element: composed modal overlay (text, images, VidPly) with image/link
  trigger, optional hidden built-in trigger, and Bootstrap modal sizes.
- `tx_link_action` on the shared `link_config` palette: structured links/buttons outside the RTE can
  open a `ce_modal` record on the same page via `Resources/Extensions/fluid_styled_content/Private/Partials/Link/ActionLink.html`.
- RTE bodytext: link browser tab “Modal” (filtered to `ce_modal` records) renders inline modal links
  with icon in the frontend (`config.recordLinks.tx_mpcore_modal`).

### Changed
- RTE link browser: map all link CSS classes to their link-type tabs via `classesAnchor`, with
  sensible defaults (page, URL, file, email, phone, modal, and special internal styles).
- RTE / link browser “Modal” tab: hide target field; offer `modal-link` CSS class (default) for modal
  record links.
- b13/container elements: use `allowedContentTypes` on accordion (TYPO3 14+), extract shared
  `grid_container` TCA, remove dead palette/cObject wiring, unify child rendering in
  Accordion/Tabs templates.
- Accordion, tabs and slider containers: shared `allowedContentTypes` (including nested accordion/tabs
  and `mpc_vidply` inline player).

### Fixed
- `ce_modal` backend icon: register `Modal.svg` as `tx_modal` and use the icon identifier in b13/container (same as accordion/tabs).
- `ce_modal` new content element wizard: register explicit `iconIdentifier = tx_modal` in Page TSconfig (same pattern as gallery/stage).
- `ce_modal` modal header: show container or first child headline left of the close button (Gallery layout); hide duplicate VidPly headline in the body.
- `ce_modal`: pause VidPly and native video/audio when the modal is closed (previously `pauseOutside(document.body)` kept in-modal playback running).
- `ce_modal` trigger image: load the container `image` FAL field into Fluid (`files` was wired to `grid_icon` only, so trigger thumbnails never appeared).
- `ce_modal` trigger layout: image above button-style label; entire trigger stays one clickable `<button>`.
- `ce_modal` trigger position: honour `tx_link_position` on the full-width trigger wrapper (left/center/right in the column).
- `ce_modal` trigger image: clip rounded corners like other content images (`overflow: hidden` on the image wrapper).
- `ce_modal` stacked trigger: one rounded card for image + button; FAL outline uses Bootstrap `border` utilities on the card (no duplicate `.outline` ring); inner `btn` keeps full button styling in `card-body`.
- Vue Swiper slider/gallery: initialize VidPly after slide HTML is injected via `v-html` and
  pause playback when leaving a slide.
- `ce_modal` page headline: do not wrap the container header in `teaser-link` (`tx_link` is for the
  built-in trigger label/style only).
- `ce_modal` backend icon: restore `Modal.svg` in `Build/Assets/Static/Icons` so Vite build no longer
  deletes it from `Resources/Public/Icons`.

## [1.2.7] - 2026-06-30

### Fixed
- Swiper – Upgrade to version 14.01
- Add typo3 13 compatibility

## [1.2.6] - 2026-06-22

### Fixed
- Swiper – Upgrade to version 14
- Swiper slider config mix-up when multiple sliders mount on the same page (parallel Vue mount race).
- Swiper prev/next buttons are only clickable at the edges when Swiper v14 pagination overlay blocked clicks (`z-index: 20` on nav buttons; layout unchanged).
- Swiper slides use equal `height: 100%` instead of content-based `height: auto` (container locked to tallest slide via JS; re-measures on resize/images; thumb strips unchanged).

## [1.2.5] - 2026-06-22

### Added
- Dynamic `robots.txt` middleware with sitemap reference, default backend disallow rules (`/typo3/`, `/typo3_src/`), and configurable AI-crawler policy (`seo.robots.*` site settings).
- Dynamic `llms.txt` middleware serving a markdown site map for AI agents (`seo.llmsTxt.enabled` site setting), with two-level page structure and per-page descriptions (from page `description` / `abstract`).
- Optional FAQPage JSON-LD on accordion content elements via the `container_accordion_faq_schema` toggle and `FaqPageJsonLdViewHelper`.
- Add CHANGELOG.md

### Changed
- Accordion TCA tab now includes the FAQ structured data toggle (off by default).
- `robots.txt` / `llms.txt` middleware now runs before the static-route-resolver so it deterministically supersedes any `staticText` `robots.txt` site route (which can be removed from site config).

## [1.2.4] - 2026-06-14

### Fixed
- Secondary and tertiary navigation link icons and link targets.

## [1.2.3] - 2026-06-13

### Changed
- Updated Vue, ESLint and Sass and rebuilt the frontend assets.
- Enforce LF line endings via `.gitattributes`.

## [1.2.2] - 2026-06-11

### Changed
- Updated jarallax, Vue and stylelint.

## [1.2.1] - 2026-06-11

### Fixed
- `prepend` link helper.

## [1.2.0] - 2026-06-05

### Added
- Editor-managed web fonts.

### Changed
- Added bundle-size budgets to the frontend build.

### Security
- Hardened the Content Security Policy.

### Accessibility
- Accessibility fixes.

## [1.1.32] - 2026-05-31

### Changed
- Replaced the responsive-table wrapper `div` with a class on the `figure` element.

### Accessibility
- Added `tabindex` to the scrollable table container so it is keyboard-focusable.

## [1.1.31] - 2026-05-31

### Accessibility
- Improved tertiary navigation toggle labels.

## [1.1.30] - 2026-05-31

### Changed
- Maintenance release (version bump only).

## [1.1.29] - 2026-05-31

### Changed
- Moved the "to top" button into the footer section.

## [1.1.28] - 2026-05-30

### Fixed
- Form now sets focus to the correct element on validation error.

## [1.1.27] - 2026-05-30

### Fixed
- Prevented layout shift from the Swiper slider using placeholders.

## [1.1.26] - 2026-05-29

### Changed
- Updated Vue and the Swiper slider library.

## [1.1.25] - 2026-05-29

### Changed
- Added `hyphens: auto` to secondary and tertiary main navigation.

### Fixed
- Prevented the navigation backdrop layer from flickering on menu toggle and page navigation.

## [1.1.24] - 2026-05-28

### Changed
- Simplified the main navigation; adjusted stage and teaser image widths.

## [1.1.23] - 2026-05-27

### Changed
- HTML is now minified during initial generation.

## [1.1.22] - 2026-05-25

### Fixed
- Always use the `mpcore.de` base URL.

## [1.1.21] - 2026-05-25

### Added
- Flexible Schema.org "extra entity" settings with labeled types.

## [1.1.20] - 2026-05-24

### Changed
- No-JS optimization: load the no-JS snippet first.

## [1.1.19] - 2026-05-24

### Changed
- No-JS optimization: load the no-JS snippet first.

## [1.1.18] - 2026-05-24

### Changed
- No-JS optimization: dark mode by default, video/audio without player, optimized navigation.
- Updated README files and favicon generation.
- Updated `.gitignore`.

### Fixed
- Bootstrap table hover color in dark mode.

## [1.1.17] - 2026-05-17

### Changed
- Removed deprecations.
- Removed redundant inline documentation.

## [1.1.16] - 2026-05-17

### Changed
- Removed redundant `<f:spaceless>` wrappers (now handled by the whitespace middleware).
- Removed unneeded code.

### Accessibility
- Added visually-hidden text inside the logo link.

## [1.1.15] - 2026-05-17

### Fixed
- Logo header size and default.

## [1.1.14] - 2026-05-16

### Fixed
- Logo header size and default.

## [1.1.13] - 2026-05-16

### Changed
- Logo header is now always visible regardless of format and can be customized per language.
- Centralized the `SiteProcessor` declaration via `lib.contentProcessors.site`.
- Replaced deprecated `no_cache=1` with `cache_period=86400` on the manifest PAGE; corrected manifest Content-Type and Cache-Control for browser caching.
- Capped the categories `DatabaseQueryProcessor` with `LIMIT 50`.
- Collapsed the 26-fold social-media partial into a single `f:for` loop.
- Migrated accordion/tab numeric fields to TCA `type=number`.
- Dropped orphan TypoScript root files.
- Use the FAL image argument for inline SVGs in navigation partials.

### Security
- Escaped `header_kicker` text and `websiteTitle` in title attributes.

## [1.1.12] - 2026-05-12

### Added
- TYPO3 13/14 dual-version form template support.

## [1.1.11] - 2026-05-12

### Changed
- Updated README files.

### Fixed
- Resolved modal z-index stacking by eliminating unnecessary stacking contexts.

## [1.1.10] - 2026-05-02

### Fixed
- Secondary/tertiary main navigation font style.

## [1.1.9] - 2026-05-02

### Changed
- Made news, mpc_rss and mpc_vidply suggested/optional dependencies.

## [1.1.8] - 2026-05-02

### Fixed
- Secondary and tertiary main navigation.

## [1.1.7] - 2026-05-02

### Fixed
- Banner z-index.

## [1.1.6] - 2026-05-02

### Changed
- npm updates.

### Fixed
- Display of nested frames.

## [1.1.5] - 2026-05-01

### Added
- Default logo.

### Fixed
- z-index problems; standalone fixes.

## [1.1.4] - 2026-04-30

### Fixed
- Restored the `menu_recently_updated` CType; deduplicated `menu_subpages`.

## [1.1.3] - 2026-04-30

### Added
- Schema.org JSON-LD graph, news Article markup, and `og:type` for routed URLs.

## [1.1.2] - 2026-04-29

### Added
- GitHub, GitLab, OpenCode, Packagist and npm links in site config and footer social links.

### Changed
- TYPO3 14 LTS dependency; npm updates.

## [1.1.1] - 2026-04-09

### Changed
- Updated npm dependencies (Vite, ESLint, Vue, Sass, stylelint).
- Performance and code-quality improvements.

### Security
- Hardened PHP/JS security; additional security audit fixes.

### Accessibility
- Accessibility and best-practice audit fixes; CSP-safe theme initialization; i18n cleanup.

### Fixed
- Added `text-left` to the modal dialog.
- Force the custom preview renderer to catch TYPO3 core TypeErrors.

## [1.1.0] - 2026-03-25

### Changed
- Updated npm dependencies (Swiper 12.1.3, Vite).

## [1.0.67] - 2026-03-21

### Changed
- npm updates.

### Fixed
- Stage video now plays inline on mobile devices.

## [1.0.66] - 2026-03-18

### Changed
- Updated jarallax to v3.0.0.

## [1.0.65] - 2026-03-16

### Fixed
- Indexed-search `tx-indexedsearch-info` translations.

## [1.0.64] - 2026-03-15

### Fixed
- Indexed-search pagination.

## [1.0.63] - 2026-03-15

### Fixed
- Indexed-search pagination.

## [1.0.62] - 2026-03-15

### Changed
- Modernized the indexed_search templates.

### Fixed
- Sorting bugs in indexed search.

## [1.0.61] - 2026-03-14

### Fixed
- Header now stays the same height.

## [1.0.60] - 2026-03-13

### Changed
- Upgraded to Vite 8; refactored PHP classes and site config; reworked the sticky header.
- Updated npm dependencies (Vue, Sass, ESLint).

## [1.0.59] - 2026-03-03

### Changed
- npm and Vue updates.

## [1.0.58] - 2026-02-21

### Changed
- Updated Swiper to 12.1.2.

## [1.0.57] - 2026-02-10

### Added
- German translations for the CKEditor 5 RTE configuration.

## [1.0.56] - 2026-02-09

### Fixed
- Added the missing TCA header language label.

## [1.0.55] - 2026-02-08

### Changed
- SEO tags are now handled by TYPO3 with fallbacks.

## [1.0.54] - 2026-02-08

### Fixed
- Split the browse menu to prevent wrong `rel="prev/next"` assignment.

## [1.0.53] - 2026-02-03

### Fixed
- Fallback to a content image in meta tags.

## [1.0.52] - 2026-02-03

### Fixed
- Replaced deprecated `lastImageResourceInfo` usage.

## [1.0.51] - 2026-02-03

### Fixed
- Replaced deprecated `lastImageResourceInfo` usage.

## [1.0.50] - 2026-02-03

### Added
- Comprehensive meta tag fallbacks for Open Graph and Twitter cards.

## [1.0.49] - 2026-02-01

### Changed
- Updated npm dependencies (Swiper 12.1.0, autoprefixer, globals, stylelint).

## [1.0.48] - 2026-01-26

### Fixed
- Fallback fonts.

## [1.0.47] - 2026-01-26

### Changed
- Updated npm dependencies (Sass, PostCSS, globals).

## [1.0.46] - 2026-01-22

### Fixed
- Primary/secondary/tertiary navigation open states.
- Swiper prev/next button icon color in light mode.

## [1.0.45] - 2026-01-21

### Added
- i18n support / German translations for the gallery Swiper.

### Fixed
- Removed duplicate click handlers from navigation buttons and the gallery Swiper component.

## [1.0.44] - 2026-01-21

### Fixed
- Start-page Swiper slider top margin.
- Double-slide navigation bug; added `slidesPerGroup` support.

## [1.0.43] - 2026-01-20

### Changed
- Pre-build linting with ESLint & stylelint.
- SCSS: added utility mixins and consolidated repeated patterns.

## [1.0.42] - 2026-01-18

### Changed
- CKEditor: removed table options from the toolbar; added table captions.

## [1.0.41] - 2026-01-18

### Added
- CKEditor: `dl`/`dt`/`dd` support and advanced list properties.

### Fixed
- Different list marker styles; Swiper inactive-button fix.

## [1.0.40] - 2026-01-16

### Fixed
- Swiper: show the complete hover/focus outline.

## [1.0.39] - 2026-01-16

### Added
- Swiper: i18n translations for accessibility and navigation labels.

## [1.0.38] - 2026-01-15

### Changed
- Converted the Swiper slider to Vue; use CSS `:has()` for teaser hover states.

## [1.0.37] - 2026-01-12

### Changed
- Consolidated and optimized navigation JS/SCSS modules.
- Sorted language files; updated npm globals.

## [1.0.36] - 2026-01-01

### Added
- Move meta content between desktop and mobile at the `lg` breakpoint.

### Changed
- npm updates.

## [1.0.35] - 2025-12-26

### Removed
- Unused table columns.

## [1.0.34] - 2025-12-25

### Changed
- Optimized the SVG ViewHelper; npm updates.

### Removed
- External audio/video online-media support.

## [1.0.33] - 2025-12-21

### Fixed
- Grid element: parentheses around the `new` call for PHP < 8.4.

## [1.0.32] - 2025-12-21

### Fixed
- Flexform TCA misconfiguration for the `mpcore_todolist` content element.

## [1.0.31] - 2025-12-20

### Fixed
- composer configuration.

## [1.0.30] - 2025-12-20

### Fixed
- composer configuration.

## [1.0.29] - 2025-12-20

### Fixed
- composer configuration.

## [1.0.28] - 2025-12-20

### Removed
- TurretRoad Bold web font.

## [1.0.27] - 2025-12-20

### Added
- Grid: Bootstrap 5.3 responsive grid controls (breakpoint, widths, offsets, gutter).

## [1.0.26] - 2025-12-19

### Added
- Version number in `composer.json`.

### Changed
- Updated npm dependencies (ESLint, Vite, Sass).

## [1.0.25] - 2025-12-15

### Changed
- Updated README files.

### Fixed
- Cleaned up CKEditor data-attributes from list tags; fixed tertiary language; editable language attributes in overlays.

## [1.0.24] - 2025-12-12

### Fixed
- Print button.

## [1.0.23] - 2025-12-09

### Removed
- Remaining unused audio/video code.

### Fixed
- Removed the underline on the first navigation level.

## [1.0.22] - 2025-12-07

### Changed
- Applied TCA migrations for TYPO3 13+; made mpc-vidply independent from mp-core.

## [1.0.21] - 2025-12-07

### Added
- Hide external-link pages (doktype 3) in menu templates.

## [1.0.20] - 2025-12-07

### Added
- Configurable l10n behavior for custom TCA fields.

## [1.0.19] - 2025-12-07

### Added
- Link icon in every navigation; optional as a background image in the main content.

## [1.0.18] - 2025-12-07

### Added
- Link icon in every navigation; optional as a background image in the main content.

## [1.0.17] - 2025-12-06

### Fixed
- Added the missing container-element icon.

## [1.0.16] - 2025-12-04

### Fixed
- Doubled h1 header area when no automatic header is set.

## [1.0.15] - 2025-12-04

### Fixed
- Doubled h1 header area when no automatic header is set.

## [1.0.14] - 2025-12-03

### Changed
- npm update (Vite).

### Fixed
- Wrong layout and `display:block` on `figure` for SVG images.

## [1.0.13] - 2025-11-29

### Changed
- Extracted media functionality into the mpc_vidply extension.

## [1.0.12] - 2025-11-28

### Removed
- Removed vidply from core.

## [1.0.11] - 2025-11-20

### Added
- Accessible video player.

## [1.0.10] - 2025-11-18

### Added
- Accessible video player.

## [1.0.9] - 2025-11-17

### Changed
- Maintenance release (version bump only).

## [1.0.8] - 2025-11-16

### Changed
- Maintenance release (version bump only).

## [1.0.7] - 2025-11-16

### Changed
- Updated vidply to v1.0.15.

## [1.0.6] - 2025-11-16

### Changed
- Updated vidply to v1.0.13.

## [1.0.5] - 2025-11-13

- Initial tracked release.

[1.2.12]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.2.11...v1.2.12
[1.2.11]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.2.10...v1.2.11
[1.2.10]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.2.9...v1.2.10
[1.2.9]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.2.8...v1.2.9
[1.2.8]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.2.7...v1.2.8
[1.2.7]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.2.6...v1.2.7
[1.2.6]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.2.5...v1.2.6
[1.2.5]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.2.4...v1.2.5
[1.2.4]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.32...v1.2.0
[1.1.32]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.31...v1.1.32
[1.1.31]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.30...v1.1.31
[1.1.30]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.29...v1.1.30
[1.1.29]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.28...v1.1.29
[1.1.28]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.27...v1.1.28
[1.1.27]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.26...v1.1.27
[1.1.26]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.25...v1.1.26
[1.1.25]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.24...v1.1.25
[1.1.24]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.23...v1.1.24
[1.1.23]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.22...v1.1.23
[1.1.22]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.21...v1.1.22
[1.1.21]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.20...v1.1.21
[1.1.20]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.19...v1.1.20
[1.1.19]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.18...v1.1.19
[1.1.18]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.17...v1.1.18
[1.1.17]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.16...v1.1.17
[1.1.16]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.15...v1.1.16
[1.1.15]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.14...v1.1.15
[1.1.14]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.13...v1.1.14
[1.1.13]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.12...v1.1.13
[1.1.12]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.11...v1.1.12
[1.1.11]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.10...v1.1.11
[1.1.10]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.9...v1.1.10
[1.1.9]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.8...v1.1.9
[1.1.8]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.7...v1.1.8
[1.1.7]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.6...v1.1.7
[1.1.6]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.5...v1.1.6
[1.1.5]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.67...v1.1.0
[1.0.67]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.66...v1.0.67
[1.0.66]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.65...v1.0.66
[1.0.65]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.64...v1.0.65
[1.0.64]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.63...v1.0.64
[1.0.63]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.62...v1.0.63
[1.0.62]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.61...v1.0.62
[1.0.61]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.60...v1.0.61
[1.0.60]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.59...v1.0.60
[1.0.59]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.58...v1.0.59
[1.0.58]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.57...v1.0.58
[1.0.57]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.56...v1.0.57
[1.0.56]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.55...v1.0.56
[1.0.55]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.54...v1.0.55
[1.0.54]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.53...v1.0.54
[1.0.53]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.52...v1.0.53
[1.0.52]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.51...v1.0.52
[1.0.51]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.50...v1.0.51
[1.0.50]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.49...v1.0.50
[1.0.49]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.48...v1.0.49
[1.0.48]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.47...v1.0.48
[1.0.47]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.46...v1.0.47
[1.0.46]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.45...v1.0.46
[1.0.45]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.44...v1.0.45
[1.0.44]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.43...v1.0.44
[1.0.43]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.42...v1.0.43
[1.0.42]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.41...v1.0.42
[1.0.41]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.40...v1.0.41
[1.0.40]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.39...v1.0.40
[1.0.39]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.38...v1.0.39
[1.0.38]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.37...v1.0.38
[1.0.37]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.36...v1.0.37
[1.0.36]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.35...v1.0.36
[1.0.35]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.34...v1.0.35
[1.0.34]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.33...v1.0.34
[1.0.33]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.32...v1.0.33
[1.0.32]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.31...v1.0.32
[1.0.31]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.30...v1.0.31
[1.0.30]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.29...v1.0.30
[1.0.29]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.28...v1.0.29
[1.0.28]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.27...v1.0.28
[1.0.27]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.26...v1.0.27
[1.0.26]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.25...v1.0.26
[1.0.25]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.24...v1.0.25
[1.0.24]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.23...v1.0.24
[1.0.23]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.22...v1.0.23
[1.0.22]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.21...v1.0.22
[1.0.21]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.20...v1.0.21
[1.0.20]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.19...v1.0.20
[1.0.19]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.18...v1.0.19
[1.0.18]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.17...v1.0.18
[1.0.17]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.16...v1.0.17
[1.0.16]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.15...v1.0.16
[1.0.15]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.14...v1.0.15
[1.0.14]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.13...v1.0.14
[1.0.13]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.12...v1.0.13
[1.0.12]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.11...v1.0.12
[1.0.11]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.10...v1.0.11
[1.0.10]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.9...v1.0.10
[1.0.9]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/MatthiasPeltzer/mp-core/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/MatthiasPeltzer/mp-core/releases/tag/v1.0.5
