# Configuration

Site Sets, Site Settings, TypoScript, and TCA configuration reference.

---

## Site Sets (TYPO3 13.4+)

| Set | Purpose |
|-----|---------|
| `mpc/mp-core` (required) | Core functionality, templates, base styling |
| `mpc/mp-core-container` | Container elements (accordion, tabs, slider, grid) |
| `mpc/mp-core-news` | News extension integration |
| `mpc/mp-core-form` | Form framework configuration |
| `mpc/mp-core-seo` | SEO (Open Graph, Twitter Cards, sitemap) |

### Enabling Sets

**Backend:** Site Management -> Sites -> Sets tab -> enable and order sets (`MP Core` first).

**YAML** (`config/sites/[site]/config.yaml`):

```yaml
base: 'https://example.com'
rootPageId: 1
dependencies:
  - mpc/mp-core
  - mpc/mp-core-container
  - mpc/mp-core-news
  - mpc/mp-core-form
  - mpc/mp-core-seo
```

---

## Site Settings

Editable via **Site Management -> Sites -> Settings** or `config/sites/[site]/settings.yaml`.

### Core (`mpCore`)

| Category | Key examples | Description |
|----------|-------------|-------------|
| PIDs | `PIDs.pidHome`, `PIDs.pidMetaNavTop`, `PIDs.pidCategories` | Page IDs for navigation, categories |
| Design | `design.colors.primary`, `design.fonts.primary`, `design.breakpoints.*` | Colors, fonts, breakpoints |
| Performance | `performance.compressJs`, `performance.compressCss`, `performance.enableLazyLoading` | Compression, lazy loading |
| Content | `content.textmedia.maxWidth`, `content.lightbox.enabled`, `content.defaultHeaderType` | Image sizes, lightbox, headers |
| Navigation | `navigation.maxDepth`, `navigation.enableBreadcrumb` | Menu depth, breadcrumbs |
| Meta | `meta.viewport`, `meta.robots`, `meta.googleSiteVerification` | Meta tags |
| Config | `config.admPanel`, `config.debug`, `config.spamProtectEmailAddresses` | Debug, caching, spam |

### Container (`mpc/mp-core-container`)

Grid, accordion, tabs, slider settings (enabled, columns, gutters, toggle behavior).

### News (`mpc/mp-core-news`)

List pagination, ordering, date format, detail view back link, related news, media sizes.

### Form (`mpc/mp-core-form`)

Honeypot, email sender/reply-to, validation, storage, upload folder.

### SEO (`mpc/mp-core-seo`)

Open Graph, Twitter Cards, Schema.org, XML sitemap, canonical URLs.

### Using Settings in TypoScript

```typoscript
# Constants
mpCore.design.primaryColor = {$settings.mpCore.design.colors.primary}

# Setup
page.10.templateRootPaths.10 = {$settings.mpCore.templates.templateRootPath}
```

---

## TypoScript Structure

```
Configuration/
├── Sets/mp-core/
│   ├── config.yaml, settings.yaml, settings.definitions.yaml
│   ├── constants.typoscript, setup.typoscript, page.tsconfig
├── TypoScript/
│   ├── constants.typoscript, setup.typoscript
│   ├── VueComponents.typoscript
│   ├── Helper/PageClass.typoscript
│   ├── Constants/*.typoscript
│   └── Setup/
│       ├── 10.Config, 20.Page, 30.Page.Styles, 40.Page.Scripts
│       ├── 50.Page.Navigation, 60.Lib, 90.CleanupRTE
│       ├── Page/*.typoscript
│       └── ContentElements/tt_content/*.typoscript
└── Extensions/
    ├── constants.typoscript, setup.typoscript
```

| File | Purpose |
|------|---------|
| `10.Config` | Basic TYPO3 config (charset, language, cache) |
| `20.Page` | Page object, template paths, data processors |
| `30.Page.Styles` | CSS includes |
| `40.Page.Scripts` | JavaScript includes |
| `50.Page.Navigation` | Conditional navigation bundles |
| `60.Lib` | Shared `lib.*` objects |
| `ContentElements/tt_content/*` | Content element rendering |

### Template Path Configuration

```typoscript
page.10 = FLUIDTEMPLATE
page.10 {
  templateRootPaths {
    0 = EXT:mp_core/Resources/Private/Templates/Page/
    10 = {$settings.mpCore.templates.templateRootPath}
  }
  partialRootPaths {
    0 = EXT:mp_core/Resources/Private/Partials/
    10 = {$settings.mpCore.templates.partialRootPath}
  }
  layoutRootPaths {
    0 = EXT:mp_core/Resources/Private/Layouts/
    10 = {$settings.mpCore.templates.layoutRootPath}
  }
}
```

Path precedence: `0` = core, `10` = extension, `20+` = project. Higher numbers override lower.

### Extension Overrides

```typoscript
plugin.tx_news.view.templateRootPaths.10 = EXT:mp_core/Resources/Extensions/news/Templates/
plugin.tx_form.view.templateRootPaths.10 = EXT:mp_core/Resources/Extensions/form/Templates/
plugin.tx_indexedsearch.view.templateRootPaths.10 = EXT:mp_core/Resources/Extensions/indexed_search/Templates/
```

### Conditional Configuration

```typoscript
[traverse(site, 'configuration/navType') == 'primary']
  page.includeJSFooter.navigationPrimary = EXT:mp_core/Resources/Public/JavaScripts/navigationPrimary.js
[END]
```

---

## TCA Overrides

### Quick Reference

| File | Purpose |
|------|---------|
| `tt_content_00_base.php` | Global link wizard, palettes, Vue TodoList CType |
| `tt_content_00_header.php` | Extended header options |
| `pages.php` | Feature toggles, teaser description, link icon |
| `sys_category.php` | Main category relation on pages |
| `sys_file_metadata.php` | RTE description, accessibility flag |
| `sys_file_reference.php` | Outline and download options |
| `sys_template.php` | Static TypoScript registration |

### Page Fields (`pages.php`)

| Field | Type | Description |
|-------|------|-------------|
| `newsletter` | Checkbox toggle | Newsletter signup box |
| `socialmedia` | Checkbox toggle | Social media sharing bar |
| `breadcrumb` | Checkbox toggle | Breadcrumb navigation |
| `headercontainer` | Checkbox toggle | Header container layout |
| `teaser_description` | Textarea | Teaser/card description |
| `link_icon` | File (SVG) | Custom page link icon |
| `link_icon_background` | Checkbox toggle | Icon background |

### Global Link Wizard (`tt_content_00_base.php`)

| Field | Type | Options |
|-------|------|---------|
| `tx_link_switch` | Checkbox toggle | Enable/disable link |
| `tx_link` | Link wizard | Page, file, URL, record |
| `tx_link_layout` | Select | Primary/Secondary/Tertiary button, link styles |
| `tx_link_text` | Text input | Custom link text |
| `tx_link_position` | Select | Center, Left, Right |

Palette: `link_config`

### Custom Content Elements

| Element | File | Description |
|---------|------|-------------|
| Gallery | `tt_content_gallery.php` | Responsive image galleries + lightbox |
| Stage | `tt_content_stage.php` | Hero sections (image/video backgrounds) |
| Banner | `tt_content_banner.php` | Customizable banner sections |
| Single Teaser | `tt_content_singleteaser.php` | Content teasers with images/links |
| Accordion | `tt_content_accordion.php` | Collapsible sections (b13/container) |
| Tabs | `tt_content_tabs.php` | Tabbed panels (b13/container) |
| Slider | `tt_content_slider.php` | Swiper carousels (b13/container) |
| Grid | `tt_content_grid.php` | Flexible column layouts (b13/container) |
| Container | `tt_content_container.php` | Generic wrapper (b13/container) |
| TodoList | `tt_content_00_base.php` | Vue.js 3 todo (CType: `mpcore_todolist`) |
| Menu Subpages | `tt_content_menu_subpages.php` | Enhanced subpage menu |

### File Metadata / References

| Table | Field | Description |
|-------|-------|-------------|
| `sys_file_metadata` | `description` | RTE text description |
| `sys_file_metadata` | `is_accessible` | Accessibility compliance flag |
| `sys_file_reference` | `outline` | Display with border |
| `sys_file_reference` | `allow_download` | Show download button |

---

## Common Customization Patterns

### Adding a Field to an Existing Element

```php
$myColumns = [
    'tx_my_field' => [
        'label' => 'My Field',
        'config' => ['type' => 'input', 'size' => 30],
    ],
];
ExtensionManagementUtility::addTCAcolumns('tt_content', $myColumns);
ExtensionManagementUtility::addToAllTCAtypes('tt_content', 'tx_my_field', 'textmedia', 'after:bodytext');
```

### Database Schema

Add columns to `ext_tables.sql`, then run **Admin Tools -> Maintenance -> Analyze Database Structure**.

```sql
CREATE TABLE tt_content (
    tx_my_field varchar(255) DEFAULT '' NOT NULL
);
```

---

## Tips

1. **Reuse existing palettes** from `tt_content_00_base.php` and `tt_content_00_header.php`
2. **Prefix custom fields** with `tx_` to avoid conflicts
3. **Use `LLL:EXT:...`** references for all labels
4. **Use `displayCond`** for conditional field visibility: `'displayCond' => 'FIELD:my_toggle:=:1'`
5. **Use Site Settings** instead of hardcoded TypoScript values
6. **Follow path numbering**: `0` (core), `10` (extension), `20+` (project)

---

## Further Reading

- [Frontend](Frontend.md) - Build system and asset pipeline
- [Favicons](Favicons.md) - Favicon generation
- [TYPO3 TCA Reference](https://docs.typo3.org/m/typo3/reference-tca/main/en-us/)
- [TYPO3 Site Sets](https://docs.typo3.org/m/typo3/reference-coreapi/main/en-us/ApiOverview/SiteHandling/SiteSets.html)
- [TYPO3 TypoScript Reference](https://docs.typo3.org/m/typo3/reference-typoscript/main/en-us/)
- [b13/container](https://github.com/b13/container)
