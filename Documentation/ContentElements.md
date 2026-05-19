# Content elements

Reference for **mp-core** content types: TCA location, Fluid templates, TSconfig wizards, and custom database fields.

> Field labels in the backend use `locallang_db.xlf`. This document lists **technical keys** and behaviour.

---

## Quick reference

| CType | Kind | TCA file | Frontend template |
|-------|------|----------|-------------------|
| `gallery` | Custom | `tt_content_gallery.php` | `Resources/Private/Templates/Content/Gallery.html` |
| `stage` | Custom | `tt_content_stage.php` | `Resources/Private/Templates/Content/Stage.html` |
| `banner` | Custom | `tt_content_banner.php` | `Resources/Private/Templates/Content/Banner.html` |
| `singleteaser` | Custom | `tt_content_singleteaser.php` | `Resources/Private/Templates/Content/Singleteaser.html` |
| `menu_subpages` | Core override | `tt_content_menu_subpages.php` | fluid_styled_content / extension override |
| `mpcore_todolist` | Custom (Vue) | `tt_content_00_base.php` | Vue mount via `VueComponents.typoscript` |
| `definitionlist` | Content Block | `ContentBlocks/.../definitionlist/` | Content Blocks `frontend.html` |
| `ce_accordion` | b13/container | `tt_content_accordion.php` | `Resources/Private/Templates/Container/` |
| `ce_tabs` | b13/container | `tt_content_tabs.php` | Container templates |
| `ce_slider` | b13/container | `tt_content_slider.php` | Container + `SwiperSlider.vue` |
| `ce_grid` | b13/container | `tt_content_grid.php` | Container templates |
| `ce_container` | b13/container | `tt_content_container.php` | Container wrapper |

TypoScript: `Configuration/TypoScript/Setup/ContentElements/tt_content/*.typoscript`  
Database columns: `ext_tables.sql` (all `tt_content` extensions)

---

## Shared fields (many CTypes)

Defined in `Configuration/TCA/Overrides/tt_content_00_base.php`, `tt_content_00_header.php`, and `tt_content_container.php`.

### Link palette (`link_config`)

Used by stage, banner, singleteaser, and others.

| Field | Type | Description |
|-------|------|-------------|
| `tx_link_switch` | check | Enable link button |
| `tx_link` | link | Page, file, URL, or record |
| `tx_link_text` | input | Custom link label (`displayCond`: switch on) |
| `tx_link_layout` | select | `btn btn-primary/secondary/tertiary/quaternary`, `internal-link`, `external-link`, `download` |
| `tx_link_position` | select | `btn-center`, `btn-left`, `btn-right` |

### Header palette (`header_config`)

| Field | Type | Description |
|-------|------|-------------|
| `header_kicker` | input | Text above headline |
| `tx_header_style` | select | Override semantic level: `h1`–`h6` (visual class) |
| `tx_header_inside` | check | Render header inside content area |

### Grid / background (container TCA)

Used by banner, singleteaser, stage, menu_subpages, containers.

| Field | Type | Description |
|-------|------|-------------|
| `grid_bgcolor` | select | Background colour (`itemsProcFunc`: `ColorPickerValueItems`) |
| `grid_light` | check | Light text on dark background |
| `grid_bgimage` | file | Background image |
| `grid_bgfullsize` | check | Full-width background |
| `grid_parallax` | check | Parallax (jarallax) |
| `grid_icon` / `grid_icon_switch` | file / check | Optional icon |
| `grid_container` | check | Inner container width |
| `grid_columns` | select | Column layout (menu subpages) |

---

## Gallery (`gallery`)

**TCA:** `Configuration/TCA/Overrides/tt_content_gallery.php`  
**Wizard:** `Configuration/TsConfig/Page/ContentElement/Element/Gallery.tsconfig`  
**Frontend:** Vue `GallerySwiper` for slider/thumbs layouts; static layouts otherwise.

### Layout

| Field | Type | Values / default |
|-------|------|------------------|
| `gallery_layout` | select | `gallery-single`, `gallery-tiles`, `gallery-slider`, `gallery-thumbs` (reload on change) |
| `gallery_columns` | select | `1`–`4` slides per view — **only** if layout = `gallery-slider` |

### Swiper options

Shown when layout is `gallery-slider` and/or `gallery-thumbs` (see TCA `displayCond`).

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `gallery_space_between` | number | 10 | px |
| `gallery_speed` | number | 300 | ms transition |
| `gallery_loop` | check | 0 | |
| `gallery_navigation_enabled` | check | 1 | Prev/next |
| `gallery_pagination_enabled` | check | 1 | |
| `gallery_pagination_type` | select | `bullets` | `fraction`, `progressbar` |
| `gallery_pagination_clickable` | check | 1 | Bullets only |
| `gallery_pagination_dynamic_bullets` | check | 1 | Bullets only |
| `gallery_autoplay_enabled` | check | 0 | Slider only |
| `gallery_autoplay_delay` | number | 3000 | Slider only |
| `gallery_thumbs_per_view` | select | 4 | Thumbs layout: 3–6 |
| `gallery_thumbs_space_between` | number | 10 | Thumbs layout |

### Core content fields

| Field | Notes |
|-------|-------|
| `header_kicker`, `header`, `subheader`, `bodytext` | RTE on `bodytext` |
| `image` | Multi-image; FAL `description`/`link`/`title`/`caption` passthrough |

---

## Stage (`stage`)

**TCA:** `Configuration/TCA/Overrides/tt_content_stage.php`  
**Wizard:** `Configuration/TsConfig/Page/ContentElement/Element/Stage.tsconfig`

### Media

| Field | Type | Description |
|-------|------|-------------|
| `tx_stage_switch` | select | `0` = image background, `1` = video (reload) |
| `tx_stage_video` | file | mp4, webm, ogg — if switch = video |
| `image` | FAL | Max 1 — hero image |
| `video` | core | Core video field in palette |
| `bodytext` | RTE | Overlay copy |

### Position & appearance

| Field | Type | Values |
|-------|------|--------|
| `tx_stage_position` | select | `stage-default`, `stage-top`, `stage-middle`, `stage-bottom` |
| `grid_bgcolor` | select | Shared colour picker |
| `tx_stage_bgcolor` | check | Stage-specific background toggle |
| `date` | datetime | Optional date line |
| `link_config` palette | | CTA link |

---

## Banner (`banner`)

**TCA:** `Configuration/TCA/Overrides/tt_content_banner.php`  
**Wizard:** `Configuration/TsConfig/Page/ContentElement/Element/Banner.tsconfig`

Minimal hero strip: **header** + **single image** + optional background/link.

| Field | Notes |
|-------|-------|
| `header` | Title |
| `image` | Max 1 |
| `grid_bgcolor`, `grid_light` | Section colours |
| `link_config` | Optional CTA |
| `bodytext` | Plain text (RTE disabled) |

---

## Single teaser (`singleteaser`)

**TCA:** `Configuration/TCA/Overrides/tt_content_singleteaser.php`  
**Wizard:** `Configuration/TsConfig/Page/ContentElement/Element/Singleteaser.tsconfig`

| Field | Notes |
|-------|-------|
| `header_kicker`, `header`, `subheader` | |
| `image` | Max 1; `imageorient`, `imagewidth` in palette |
| `bodytext` | RTE |
| `grid_bgcolor` | |
| `link_config` | |
| `date` | Optional |

---

## Menu subpages (`menu_subpages`)

**TCA:** `tt_content_menu_subpages.php` — overrides core `showitem` only.

| Field | Notes |
|-------|-------|
| `pages` | Selected pages |
| `header_subpages` | Heading level for submenu titles (`h2`–`h6`) |
| `grid_bgcolor`, `grid_columns`, `grid_light` | Card/grid styling |
| `tx_link_switch`, `tx_link_text`, `tx_link_layout` | Per-item link styling |

---

## Todo list (`mpcore_todolist`)

**TCA:** `tt_content_00_base.php`  
**FlexForm:** `Configuration/FlexForms/TodoList.xml`  
**Frontend:** Vue `TodoList` — `data-container="vue"` `data-component="TodoList"`

### FlexForm settings (`pi_flexform`)

| Setting | Type | Default |
|---------|------|---------|
| `settings.showDeleteButton` | check | 1 |
| `settings.showFilter` | check | 1 |
| `settings.showClearCompleted` | check | 1 |
| `settings.maxItems` | number | (see XML) |
| `settings.cardTitle` | input | Card heading |
| `settings.colorScheme` | select | Bootstrap colour variant |

---

## Definition list (`definitionlist`)

**Content Block** — not classic TCA CType file.

See [Backend.md](Backend.md#content-blocks-backend-editor) for editor fields.  
RTE definition lists are also available inside the main RTE preset (toolbar plugin).

---

## Container elements (b13/container)

Child content lives in **colPos 101** unless noted. Icons and labels in `locallang_db.xlf`.

### Accordion (`ce_accordion`)

**TCA:** `tt_content_accordion.php`

| Field | Type | Description |
|-------|------|-------------|
| `container_accordion_type` | select | `1` Bootstrap, `2` native `<details>` |
| `container_headline` | input | Section title |
| `container_accordion_toggle` | check | Collapse toggle UI |
| `container_accordion_toggle_all` | check | Expand/collapse all |
| `container_accordion_open` | check | First panel open |
| `grid_container` | check | Width container |

**Allowed child CTypes:** `header`, `text`, `textpic`, `ce_accordion`, `ce_container`

### Tabs (`ce_tabs`)

**TCA:** `tt_content_tabs.php`

| Field | Type | Description |
|-------|------|-------------|
| `container_headline` | input | |
| `container_tab_open` | check | Open first tab |
| `grid_container` | check | |

### Slider (`ce_slider`)

**TCA:** `tt_content_slider.php` — **Vue `SwiperSlider`** on frontend.

| Field | Type | Default |
|-------|------|---------|
| `slider_type` | select | `slide`, `fade`, `cube`, `coverflow`, `flip`, `cards`, `creative` |
| `slider_slides_per_view` | number | 1 |
| `slider_slides_per_group` | number | 1 |
| `slider_space_between` | number | 0 |
| `slider_loop` | check | 0 |
| `slider_speed` | number | 300 |
| `slider_autoplay_enabled` | check | 0 |
| `slider_autoplay_delay` | number | 3000 |
| `slider_autoplay_disable_on_interaction` | check | 1 |
| `slider_navigation_enabled` | check | 1 |
| `slider_pagination_enabled` | check | 1 |
| `slider_pagination_type` | select | `bullets`, `fraction`, `progressbar` |
| `slider_pagination_clickable` | check | 0 |
| `slider_pagination_dynamic_bullets` | check | 0 |
| `slider_keyboard_enabled` | check | 1 |
| `slider_mousewheel_enabled` | check | 0 |
| `slider_free_mode_enabled` | check | 0 |
| `slider_zoom_enabled` | check | 0 |
| `slider_breakpoints` | text | JSON breakpoints (advanced) |

### Grid (`ce_grid`)

**TCA:** `tt_content_grid.php` — Bootstrap column editor.

| Field | Type | Description |
|-------|------|-------------|
| `grid_type` | select | `ul` (list) or `div` (div wrapper) |
| `grid_columns` | select | 1–4 columns |
| `grid_breakpoint` | select | `xl`, `md`, `lg`, `xxl` |
| `grid_col1` … `grid_col4` | select | Bootstrap width 1–12 per column |
| `grid_offset1` … `grid_offset4` | select | Column offsets |
| `grid_gutter` | select | Gutter 0–5 |
| Shared `grid_*` background fields | | From container TCA |

Uses palette `frames_ce_grid` (spacing only, no frame layout select).

### Container (`ce_container`)

**TCA:** `tt_content_container.php` — generic wrapper with background palettes (`grid_bgcolor`, `grid_bgimage`, parallax, icon, etc.).

---

## Adding a new content element

1. **TCA** — `Configuration/TCA/Overrides/tt_content_myelement.php` + columns in `ext_tables.sql`.
2. **Template** — `Resources/Private/Templates/Content/Myelement.html`.
3. **TypoScript** — `Configuration/TypoScript/Setup/ContentElements/tt_content/Myelement.typoscript`.
4. **Wizard** — `Configuration/TsConfig/Page/ContentElement/Element/Myelement.tsconfig`.
5. **Icon** — `Configuration/Icons.php`.
6. Reuse palettes: `link_config`, `header_config`, `grid_*` where applicable.

See [Configuration.md](Configuration.md) for TCA patterns and [Frontend.md](Frontend.md) for asset includes.

---

## Related documentation

- [Backend.md](Backend.md) — RTE, TSconfig, previews, Content Blocks
- [Configuration.md](Configuration.md) — Site Sets and global TCA
- [OVERVIEW.md](OVERVIEW.md) — Feature summary
