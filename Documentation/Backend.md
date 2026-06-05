# Backend

TYPO3 backend integration for **mpc/mp-core**: Page TSconfig, RTE preset, backend CSS, content previews, backend layouts, and editor-facing PHP helpers.

---

## Overview

| Area | Location | Purpose |
|------|----------|---------|
| Page TSconfig | `Configuration/Sets/mp-core/page.tsconfig` | Loaded via Site Set; imports all backend/editor TSconfig |
| RTE preset | `Configuration/RTE/Default.yaml` | Registered as global preset `default` in `ext_localconf.php` |
| Backend CSS | `Resources/Public/StyleSheets/backend.css` | TYPO3 backend UI tweaks (Vite entry `backend.js`) |
| CKEditor CSS | `Resources/Public/StyleSheets/ckeditor.css` | WYSIWYG appearance in backend + frontend RTE output |
| CKEditor plugin | `Resources/Public/JavaScripts/ckeditor/definition-list.js` | Definition list toolbar plugin |
| Preview renderer | `Classes/Preview/CustomContentPreviewRenderer.php` | Page module content previews |
| Backend layouts | `Configuration/TsConfig/Page/Mod/WebLayout/BackendLayouts/` | Web > Page colPos structure |
| Form YAML | `Resources/Extensions/form/Yaml/BaseSetup.yaml` | EXT:form styling (when `form` is loaded) |

---

## Page TSconfig

Registered through the Site Set (`Configuration/Sets/mp-core/page.tsconfig`):

```typoscript
@import 'EXT:mp_core/Configuration/TsConfig/Page/ContentElement/All.tsconfig'
@import 'EXT:mp_core/Configuration/TsConfig/Page/Mod/WebLayout/BackendLayouts.tsconfig'
@import 'EXT:mp_core/Configuration/TsConfig/Page/RTE.tsconfig'
@import 'EXT:mp_core/Configuration/TsConfig/Page/TCADefaults.tsconfig'
@import 'EXT:mp_core/Configuration/TsConfig/Page/TCEMAIN.tsconfig'
@import 'EXT:mp_core/Configuration/TsConfig/Page/TCEFORM.tsconfig'
```

### `TCEFORM.tsconfig`

Editor-facing form behaviour for `pages` and `tt_content`:

- **Pages:** `layout` — only “Standard” (items 1–4 removed).
- **Content:** hides unused core CTypes (`bullets`, several `menu_*`, `textmedia`, `table`, …).
- **Headers:** extended `header_layout` labels (items 6–12); default TYPO3 layout `0` removed.
- **Frames:** `frame_class` and `linkToTop` disabled globally.
- Per-CType overrides (e.g. `menu_subpages` link fields) — see file for full list.

### `TCADefaults.tsconfig`

Default values when creating records, e.g. `tt_content.filelink_size = 1`, `imagecols = 1`.

### `TCEMAIN.tsconfig`

Default permission flags for new content (group/user edit rights).

### Content element wizards

`Configuration/TsConfig/Page/ContentElement/Element/*.tsconfig` registers **New content element** wizard entries:

| File | CType |
|------|-------|
| `Gallery.tsconfig` | `gallery` |
| `Stage.tsconfig` | `stage` |
| `Banner.tsconfig` | `banner` |
| `Singleteaser.tsconfig` | `singleteaser` |

Container CTypes (`ce_*`) are registered by **b13/container** TCA, not separate wizard TSconfig files.

### Backend layouts

`Mod/WebLayout/BackendLayouts/Default.tsconfig` and `Article.tsconfig` define column structure for the page module:

| Layout | File | Typical colPos |
|--------|------|----------------|
| Default | `Default.tsconfig` | 4 (logos top), 0 (top), 1 (main), 2 (bottom) |
| Article | `Article.tsconfig` | Article-specific regions |

SVG icons: `Resources/Public/BackendLayouts/`.

---

## RTE (CKEditor 5)

### Registration

```php
// ext_localconf.php
$GLOBALS['TYPO3_CONF_VARS']['RTE']['Presets']['default'] = 'EXT:mp_core/Configuration/RTE/Default.yaml';
```

Page TSconfig selects the preset:

```typoscript
// Configuration/TsConfig/Page/RTE.tsconfig
RTE.default.preset = default
```

Tag remapping in the same file: `b` → `strong`, `i` → `em`, `s` → `del` (RTE and DB parser).

### Stylesheets

| Constant | File |
|----------|------|
| `BE.stylesheets.mp_core_backend` | `Resources/Public/StyleSheets/backend.css` |
| `BE.stylesheets.mp_core_ckeditor` | `Resources/Public/StyleSheets/ckeditor.css` |

Rebuild with `npm run build` in `Build/` after SCSS changes.

### Preset highlights (`Configuration/RTE/Default.yaml`)

- **contentsCss:** `ckeditor.css` — editor reflects frontend typography/buttons.
- **Toolbar:** headings, styles, language, lists (incl. definition list), tables, source editing, etc.
- **Style plugin:** Bootstrap buttons, kicker/lead, blockquote, headline level classes, link type classes, text utilities.
- **List properties:** custom styles, start index, reversed order.
- **Definition list plugin:** custom module `@mpc/mp-core/ckeditor/definition-list.js` (see `Configuration/JavaScriptModules.php`).
- **Allowed link classes:** `internal-link`, `external-link`, `download`, `email`, `phone`, `audio`, `video`, `glossary`, `public`, `legal`, `gallery`, `chart`.
- **Processing:** extra allowed tags (`figure`, `figcaption`, `dl`, `dt`, `dd`, …).

Labels: `Resources/Private/Language/locallang_rte.xlf`.

### Frontend RTE output

TypoScript `lib.parseFunc_RTE` in `Configuration/TypoScript/Setup/60.Lib.typoscript` and `90.CleanupRTE.typoscript` control HTML sanitization and wrapping on the frontend.

---

## Content preview (`CustomContentPreviewRenderer`)

Registered globally on `tt_content`:

```php
// Configuration/TCA/Overrides/tt_content_00_base.php
$GLOBALS['TCA']['tt_content']['ctrl']['previewRenderer'] =
    \Mpc\MpCore\Preview\CustomContentPreviewRenderer::class;
```

**Behaviour:**

- Delegates to TYPO3’s `StandardContentPreviewRenderer` when possible.
- Catches `TypeError` from core preview utilities (missing file refs, null sanitization) and renders a **fallback**: optional 150×150 image thumb, header, subheader, bodytext excerpt (200 chars).
- Implements `LoggerAwareInterface`. Every caught throwable is logged at `warning` level with `method`, `uid`, `pid`, `CType`, and the exception, so upstream regressions stay visible in the TYPO3 log instead of being masked by the fallback.
- Intended as a temporary workaround until core preview edge cases are fixed.

---

## PHP backend helpers

| Class | Role |
|-------|------|
| `UserFunc\ColorPickerValueItems` | `itemsProcFunc` for `grid_bgcolor` -- builds colour options from site config `color-*` keys. Filters values through `Service\CssColorValidator` and caps labels at 200 chars so malformed configs cannot pollute the BE select. |
| `Service\CssColorValidator` | Pure static validator for CSS `<color>` tokens (named, `#rgb[a]`, `#rrggbb[aa]`, `rgb()/rgba()/hsl()/hsla()`); rejects any byte that could break out of a CSS declaration. Reused by `Format\CssColorViewHelper`. |
| `Backend\Form\Container\FilesControlContainer` | File field container; forwards `fieldInformation` to child fields |
| `Preview\CustomContentPreviewRenderer` | See above |

Registered in `Configuration/Services.yaml` (`ColorPickerValueItems` is `public: true` so TYPO3 can resolve the `itemsProcFunc` callback from the container). See [Configuration → Dependency Injection](Configuration.md#dependency-injection-servicesyaml) for the full list and the local-overrides pattern.

---

## Content Blocks (backend editor)

**Definition list** — `ContentBlocks/ContentElements/definitionlist/`

| Item | Value |
|------|-------|
| `name` | `dl/definitionlist` |
| `typeName` | `definitionlist` |
| Group | `lists` |

**Fields (Content Blocks schema):**

| Field | Type | Notes |
|-------|------|-------|
| `TYPO3/Header` | Basic | Reuses core header fields |
| `radioboxes` | Radio | `0` = below each other, `1` = side by side |
| `item` | Collection | Term (`text`) + definition (`textarea`, RTE enabled) |
| `TYPO3/Appearance` | Basic | Frames, spacing |

Templates:

- Frontend: `templates/frontend.html`
- Backend preview: `templates/backend-preview.html`

Content Blocks are provided by `friendsoftypo3/content-blocks` (Composer dependency).

---

## Icons

`Configuration/Icons.php` registers SVG icons for CTypes and containers (`tx_gallery`, `tx_stage`, `ce_accordion`, …) used in the new-content wizard and page tree.

---

## Related documentation

- [Content elements](ContentElements.md) — per-CType TCA fields and templates
- [Configuration](Configuration.md) — Site Settings, site `config.yaml` fields
- [Frontend](Frontend.md) — Vite build for `backend.css` / `ckeditor.css`
