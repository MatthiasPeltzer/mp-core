# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.7] - 2026-06-30

### Fixed
- Swiper - Ugrade to version 14.01
- Add typo3 13 compatibility

## [1.2.6] - 2026-06-22

### Fixed
- Swiper - Ugrade to version 14
- Swiper slider config mix-up when multiple sliders mount on the same page (parallel Vue mount race).
- Swiper prev/next buttons only clickable at the edges when Swiper v14 pagination overlay blocked clicks (`z-index: 20` on nav buttons; layout unchanged).
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
