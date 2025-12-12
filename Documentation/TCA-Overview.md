# TCA Overview

This extension delivers a sizeable set of TYPO3 TCA **override** files to tailor the backend editing experience to the design system used in *mp_core*.

---

## Quick Reference

| File | Purpose |
|------|---------|
| `tt_content_00_base.php` | Global link wizard, palettes, Vue TodoList CType |
| `tt_content_00_header.php` | Extended header options and configuration |
| `pages.php` | Page feature toggles, teaser description, link icon |
| `sys_category.php` | Main category relation on pages |
| `sys_file_metadata.php` | RTE description, accessibility flag |
| `sys_file_reference.php` | Outline and download options |
| `sys_template.php` | Static TypoScript template registration |

---

## 1. Page Related TCA

### `pages.php`

Adds feature toggles and teaser fields to pages.

**Fields added:**

| Field | Type | Description                          |
|-------|------|--------------------------------------|
| `newsletter` | Checkbox toggle | Enable newsletter signup box on page |
| `socialmedia` | Checkbox toggle | Show social media sharing bar        |
| `breadcrumb` | Checkbox toggle | Display breadcrumb navigation        |
| `headercontainer` | Checkbox toggle | Use header container layout          |
| `teaser_description` | Textarea | Description text for teasers/cards   |
| `link_icon` | File (SVG) | Custom icon for page links           |
| `link_icon_background` | Checkbox toggle | Show icon within the background      |

**Palette integration:**
- Feature toggles → `layout` palette (after `newUntil`)
- Teaser fields → `media` palette (after `media`)

**Example usage in Fluid:**

```html
<f:if condition="{data.breadcrumb}">
    <nav aria-label="Breadcrumb">...</nav>
</f:if>

<f:if condition="{data.teaser_description}">
    <p class="teaser-description">{data.teaser_description}</p>
</f:if>
```

### `sys_category.php`

Introduces `mainCategory` one-to-one relation on pages for primary categorization.

---

## 2. File Related TCA

### `sys_file_metadata.php`

| Field | Type | Description |
|-------|------|-------------|
| `description` | RTE text | Rich text description for files |
| `is_accessible` | Checkbox | Mark file as accessible (for compliance) |

### `sys_file_reference.php`

| Field | Type | Description |
|-------|------|-------------|
| `outline` | Checkbox | Display image with outline/border |
| `allow_download` | Checkbox | Show download button for file |

---

## 3. Global Content Element Additions

### `tt_content_00_base.php` — Link Configuration

Provides a reusable link wizard for any content element.

**Fields:**

| Field | Type | Options |
|-------|------|---------|
| `tx_link_switch` | Checkbox toggle | Enable/disable link section |
| `tx_link` | Link wizard | Page, file, URL, record |
| `tx_link_layout` | Select | Primary/Secondary/Tertiary button, Internal/External/Download link |
| `tx_link_text` | Text input | Custom link text |
| `tx_link_position` | Select | Center, Left, Right alignment |

**Palette:** `link_config`

**Usage in your content element:**

```php
// In your tt_content_*.php
$GLOBALS['TCA']['tt_content']['types']['my_element'] = [
    'showitem' => '
        --div--;General,
            header,
            bodytext,
        --div--;Link,
            --palette--;;link_config,
        --div--;Appearance,
            --palette--;;frames,
    ',
];
```

### `tt_content_00_header.php` — Extended Headers

Extends standard header fields with additional configuration options.

**Palette:** `header_config`

---

## 4. Custom Content Elements

Each content element is defined in its own TCA file:

### Media Elements

#### Gallery (`tt_content_gallery.php`)

Image galleries with responsive layouts and lightbox support.

**Key fields:** `image`, `imagecols`, `image_zoom`

### Layout Elements

#### Stage (`tt_content_stage.php`)

Hero sections with image or video backgrounds.

**Custom fields:**

| Field | Type | Description |
|-------|------|-------------|
| `tx_stage_switch` | Select | Image (0) or Video (1) mode |
| `tx_stage_video` | File | Video file (mp4, webm, ogg) |
| `tx_stage_position` | Select | Content position (default, top, middle, bottom) |
| `tx_stage_bgcolor` | Checkbox | Enable background color overlay |

**Palettes:**
- `stagefile_config` — Media selection (image/video toggle, files, bodytext)
- `stageposition_config` — Layout options (position, background settings)

**Example showitem structure:**

```php
'showitem' => '
    --div--;General,
        --palette--;;general,
        header_kicker,
        header,
        --palette--;;header_config,
        subheader,
    --div--;Stage,
        --palette--;;stagefile_config,
        --palette--;;stageposition_config,
        --palette--;;link_config,
    --div--;Appearance,
        --palette--;;frames,
',
```

#### Banner (`tt_content_banner.php`)

Customizable banner sections with various layout options.

#### Single Teaser (`tt_content_singleteaser.php`)

Individual content teasers with images and links.

### Container Elements (b13/container)

Uses [b13/container](https://github.com/b13/container) for nested content:

| Element | File | Description |
|---------|------|-------------|
| Accordion | `tt_content_accordion.php` | Collapsible content sections |
| Tabs | `tt_content_tabs.php` | Tabbed content panels |
| Slider | `tt_content_slider.php` | Swiper-powered carousels |
| Grid | `tt_content_grid.php` | Flexible column layouts |
| Container | `tt_content_container.php` | Generic wrapper element |

### Interactive Elements

#### TodoList (`tt_content_00_base.php`)

Vue.js 3 interactive todo list registered as CType `mpcore_todolist`.

**Configuration:**
- CType: `mpcore_todolist`
- Group: `special`
- Icon: `typo3-vite-demo-todolist`
- FlexForm: `Configuration/FlexForms/TodoList.xml`

#### Menu Subpages (`tt_content_menu_subpages.php`)

Enhanced subpage menu with custom rendering options.

---

## 5. Site Configuration Overrides

`Configuration/SiteConfiguration/Overrides/sites.php` extends Site Settings with:

- Navigation type selection
- Search toggle
- Favicon links
- Color scheme pickers
- Social media URLs
- Logo variants
- And more...

See [TYPO3-Configuration.md](TYPO3-Configuration.md) for full settings reference.

---

## 6. Common Customization Patterns

### Adding a Field to an Existing Element

```php
<?php
// Configuration/TCA/Overrides/tt_content_myfield.php
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

defined('TYPO3') || die();

$myColumns = [
    'tx_my_custom_field' => [
        'label' => 'My Custom Field',
        'config' => [
            'type' => 'input',
            'size' => 30,
            'eval' => 'trim',
        ],
    ],
];

ExtensionManagementUtility::addTCAcolumns('tt_content', $myColumns);
ExtensionManagementUtility::addToAllTCAtypes(
    'tt_content',
    'tx_my_custom_field',
    'textmedia',  // CType to add to
    'after:bodytext'
);
```

### Creating a Checkbox Toggle

```php
'my_toggle' => [
    'exclude' => 1,
    'label' => 'LLL:EXT:my_ext/Resources/Private/Language/locallang_db.xlf:my_toggle',
    'l10n_mode' => 'exclude',
    'config' => [
        'type' => 'check',
        'renderType' => 'checkboxToggle',
        'items' => [
            [
                'label' => '',
                'labelChecked' => 'Enabled',
                'labelUnchecked' => 'Disabled',
            ],
        ],
    ],
],
```

### Creating a Select Dropdown

```php
'my_select' => [
    'label' => 'Layout Style',
    'config' => [
        'type' => 'select',
        'renderType' => 'selectSingle',
        'items' => [
            ['label' => 'Default', 'value' => ''],
            ['label' => 'Boxed', 'value' => 'boxed'],
            ['label' => 'Full Width', 'value' => 'full-width'],
        ],
    ],
],
```

### Creating a Reusable Palette

```php
$GLOBALS['TCA']['tt_content']['palettes']['my_settings'] = [
    'label' => 'My Settings',
    'showitem' => 'my_field_1, my_field_2, --linebreak--, my_field_3',
];

// Use in showitem:
// --palette--;;my_settings
```

---

## 7. Database Schema

New fields require database columns. Add to `ext_tables.sql`:

```sql
CREATE TABLE tt_content (
    tx_my_custom_field varchar(255) DEFAULT '' NOT NULL,
    tx_my_toggle smallint(5) unsigned DEFAULT '0' NOT NULL
);

CREATE TABLE pages (
    my_page_field varchar(255) DEFAULT '' NOT NULL
);
```

After adding columns, run **Admin Tools → Maintenance → Analyze Database Structure**.

---

## Tips & Best Practices

1. **Reuse existing palettes** — Check `tt_content_00_base.php` and `tt_content_00_header.php` before creating new ones

2. **Follow naming conventions** — Prefix custom fields with `tx_` to avoid conflicts

3. **Use language files** — Always use `LLL:EXT:...` references for labels

4. **Test after changes** — Flush caches and use DB compare when adding new columns

5. **Use displayCond** — Show fields conditionally based on other field values:
   ```php
   'displayCond' => 'FIELD:my_toggle:=:1',
   ```

6. **Backend search** — Use TYPO3 backend search to find field names, then match to TCA override file

---

## Further Reading

- [TYPO3 Configuration](TYPO3-Configuration.md) — Site Sets, Settings, TypoScript
- [Frontend Guide](Frontend-Guide.md) — Asset pipeline and templates
- [TYPO3 TCA Reference](https://docs.typo3.org/m/typo3/reference-tca/main/en-us/)
- [b13/container Documentation](https://github.com/b13/container)
