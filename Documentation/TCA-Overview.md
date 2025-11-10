# TCA Overview

This extension delivers a sizeable set of TYPO3 TCA **override** files to tailor the backend editing experience to the design system used in *mp_core*.

---

## 1. Page related TCA

| File | Purpose |
|------|---------|
| `Configuration/TCA/Overrides/pages.php` | Adds four feature toggles, teaser description, and a link icon; integrates into existing palettes. |
| `Configuration/TCA/Overrides/sys_category.php` | Introduces a one-to-one relation `mainCategory` on pages. |

---

## 2. File related TCA

| File | Purpose |
|------|---------|
| `Configuration/TCA/Overrides/sys_file_metadata.php` | Turns on the RTE for `description`; adds an accessibility flag `is_accessible`. |
| `Configuration/TCA/Overrides/sys_file_reference.php` | Adds `outline` and `allow_download` on file references; palette adjustments. |

---

## 3. TypoScript template registration

| File | Purpose |
|------|---------|
| `Configuration/TCA/Overrides/sys_template.php` | Registers the static TypoScript template. |

---

## 4. Global `tt_content` additions

| File | Purpose |
|------|---------|
| `Configuration/TCA/Overrides/tt_content.php` | Generic link wizard fields and palette `link_config`. |
| `Configuration/TCA/Overrides/tt_content_header.php` | Extends header options and adds palette `header_config`. |

---

## 5. Custom Content Elements

Each content element has its own TCA file in `Configuration/TCA/Overrides/`:

### Media Elements

- **Audio** (`tt_content_audio.php`) - VidPly audio player with captions, transcripts, quality selection, and full accessibility features
- **Video** (`tt_content_video.php`) - VidPly video player with captions, chapters, audio descriptions, sign language overlay, and accessibility features
- **Gallery** (`tt_content_gallery.php`) - Image galleries with responsive layouts and lightbox support

### Layout Elements

- **Stage** (`tt_content_stage.php`) - Hero/stage sections with image or video backgrounds
- **Banner** (`tt_content_banner.php`) - Banner sections with customizable layouts
- **Single Teaser** (`tt_content_singleteaser.php`) - Individual content teasers with images and links

### Container Elements (b13/container)

Uses [b13/container](https://github.com/b13/container) for nested content:

- **Accordion** (`tt_content_accordion.php`) - Collapsible content sections with toggle options
- **Tabs** (`tt_content_tabs.php`) - Tabbed content with configurable default tab
- **Slider** (`tt_content_slider.php`) - Content sliders/carousels with Swiper.js
- **Grid** (`tt_content_grid.php`) - Flexible grid layouts with column configuration
- **Container** (`tt_content_container.php`) - Generic container wrapper

### Interactive Elements

- **TodoList** (`tt_content.php`) - Vue.js 3 interactive todo list with FlexForm configuration and localStorage persistence
- **Menu Subpages** (`tt_content_menu_subpages.php`) - Enhanced subpage menu with custom rendering

---

## 6. Site configuration overrides

`Configuration/SiteConfiguration/Overrides/sites.php` extends the site settings module with many switches and colour pickers (navigation type, search toggle, favicon links, colour scheme, social media URLs, logo variants, etc.). See also `Site-Set.md`.

---

### Where to go from here?

- Use backend search to find field names -> match to TCA override file
- Reuse existing palettes to stay consistent
- After changing TCA, flush caches and use DB compare when introducing new columns
