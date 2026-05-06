# Configuration

Site Sets, Site Settings, TypoScript, and TCA configuration reference.

---

## Site Sets (TYPO3 13.4+)

| Set | Purpose |
|-----|---------|
| `mpc/mp-core` (aggregator) | Pulls in all feature sets below in one include |
| `mpc/mp-core-base` (required) | Core functionality, templates, base styling, shared settings |
| `mpc/mp-core-container` | Container elements (accordion, tabs, slider, grid) |
| `mpc/mp-core-news` | News extension integration |
| `mpc/mp-core-form` | Form framework configuration |
| `mpc/mp-core-seo` | SEO (Open Graph, Twitter Cards, Schema.org, sitemap) |

`mpc/mp-core` is an aggregator that depends on `mpc/mp-core-base` plus all feature sets. Including only `mpc/mp-core` in your site is sufficient. If you need fine-grained control, include `mpc/mp-core-base` and pick individual feature sets.

### Enabling Sets

**Backend:** Site Management -> Sites -> Sets tab -> enable and order sets.

**YAML** (`config/sites/[site]/config.yaml`):

```yaml
base: 'https://example.com'
rootPageId: 1
dependencies:
  - mpc/mp-core
```

Or cherry-pick individual sets:

```yaml
dependencies:
  - mpc/mp-core-base
  - mpc/mp-core-container
  - mpc/mp-core-seo
```

---

## Site Settings

Editable via **Site Management -> Sites -> Settings** or `config/sites/[site]/settings.yaml`.

### Core (`mpc/mp-core-base`)

#### PIDs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `PIDs.pidSearch` | int | 0 | Search result page |
| `PIDs.pidHome` | int | 1 | Homepage |
| `PIDs.pidMetaNavTop` | int | 66 | Top meta navigation page |
| `PIDs.pidMetaNavFooter` | int | 25 | Footer meta navigation page |
| `PIDs.pidMainNavMeta` | int | 25 | Main navigation meta page |
| `PIDs.pidCategories` | int | 251 | Category storage page |
| `PIDs.pidLogosBannerTop` | int | 391 | Top logos/banner page |
| `PIDs.pidSupplement` | int | 24 | Supplement page |

#### Content

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `content.textmedia.maxWidth` | int | 1200 | Max image width (px) |
| `content.textmedia.maxWidthInText` | int | 600 | Max image width in-text (px) |
| `content.lightbox.enabled` | bool | true | Enable lightbox for images |
| `content.lightbox.cssClass` | string | `lightbox` | Lightbox CSS class |
| `content.defaultHeaderType` | int | 2 | Default header level (h2) |
| `content.links.extTarget` | string | `_blank` | External link target |

#### Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `config.admPanel` | bool | false | Admin panel |
| `config.debug` | bool | false | Debug mode |
| `config.noCache` | bool | false | Disable caching |
| `config.removeDefaultJS` | string | `external` | Default JS removal mode |
| `config.spamProtectEmailAddresses` | bool | true | Email obfuscation |
| `config.spamProtectEmailAddresses_atSubst` | string | `[at]` | @ replacement string |
| `config.absRefPrefix` | string | `auto` | Absolute reference prefix |
| `config.headerComment` | string | (empty) | HTML source header comment |

#### Performance

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `performance.compressJs` | bool | false | Compress JavaScript |
| `performance.compressCss` | bool | false | Compress CSS |
| `performance.concatenateJs` | bool | false | Concatenate JavaScript |
| `performance.concatenateCss` | bool | false | Concatenate CSS |
| `performance.enableLazyLoading` | bool | true | Enable lazy loading |

#### Design

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `design.colors.primary` | string | `#0066cc` | Primary brand color |
| `design.colors.secondary` | string | `#ff6600` | Secondary brand color |
| `design.fonts.primary` | string | `Open Sans, sans-serif` | Primary font family |
| `design.fonts.heading` | string | `Turret Road, sans-serif` | Heading font family |
| `design.breakpoints.mobile` | int | 768 | Mobile breakpoint (px) |
| `design.breakpoints.tablet` | int | 1024 | Tablet breakpoint (px) |
| `design.breakpoints.desktop` | int | 1440 | Desktop breakpoint (px) |
| `design.container.maxWidth` | string | `1200px` | Container max width |

#### Navigation

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `navigation.maxDepth` | int | 3 | Maximum menu depth |
| `navigation.showHiddenPages` | bool | false | Show hidden pages in menus |
| `navigation.enableBreadcrumb` | bool | true | Breadcrumb navigation |
| `navigation.breadcrumb.includeHome` | bool | true | Include home in breadcrumb |

#### Meta

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `meta.viewport` | string | `width=device-width, initial-scale=1` | Viewport meta tag |
| `meta.robots` | string | `index,follow` | Robots meta tag |
| `meta.appleMobileWebAppCapable` | string | `no` | Apple web app capable |
| `meta.compatible` | string | `IE=edge` | X-UA-Compatible |
| `meta.google` | string | `notranslate` | Google meta tag |
| `meta.googleSiteVerification` | string | (empty) | Google site verification |

#### Templates

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `basePath` | string | `EXT:mp_core` | Extension base path |
| `pageTemplates` | string | `EXT:mp_core/Resources/Private/Templates/Page/` | Page templates |
| `pagePartials` | string | `EXT:mp_core/Resources/Private/Partials/Page/` | Page partials |
| `pageLayouts` | string | `EXT:mp_core/Resources/Private/Layouts/Page/` | Page layouts |
| `pageFaviconsFile` | string | `EXT:mp_core/Resources/Private/Partials/Page/Favicons.html` | Favicons partial |
| `contentElementTemplates` | string | `EXT:mp_core/.../fluid_styled_content/.../Templates/` | Content element templates |
| `contentElementPartials` | string | `EXT:mp_core/.../fluid_styled_content/.../Partials/` | Content element partials |
| `contentElementLayouts` | string | `EXT:mp_core/.../fluid_styled_content/.../Layouts/` | Content element layouts |
| `containerElementTemplates` | string | `EXT:mp_core/Resources/Private/Templates/Container/` | Container templates |
| `containerElementPartials` | string | `EXT:mp_core/Resources/Private/Partials/Container/` | Container partials |
| `containerElementLayouts` | string | `EXT:mp_core/Resources/Private/Layouts/Container/` | Container layouts |
| `pluginsNewsTemplates` | string | `EXT:mp_core/Resources/Extensions/news/Templates/` | News templates |
| `pluginsNewsPartials` | string | `EXT:mp_core/Resources/Extensions/news/Partials/` | News partials |
| `pluginsNewsLayouts` | string | `EXT:mp_core/Resources/Extensions/news/Layouts/` | News layouts |
| `pluginsIndexedSearchTemplates` | string | `EXT:mp_core/.../indexed_search/Templates/` | Search templates |
| `pluginsIndexedSearchPartials` | string | `EXT:mp_core/.../indexed_search/Partials/` | Search partials |
| `pluginsIndexedSearchLayouts` | string | `EXT:mp_core/.../indexed_search/Layouts/` | Search layouts |
| `contentTypesTemplates` | string | `EXT:mp_core/Resources/Private/Templates/Content/` | Custom content templates |
| `contentTypesGalleryTemplates` | string | `EXT:mp_core/Resources/Private/Templates/Content/` | Gallery templates |
| `resourcesPrivate` | string | `EXT:mp_core/Resources/Private` | Private resources base |
| `resourcesExtensions` | string | `EXT:mp_core/Resources/Extensions` | Extension overrides base |

#### Structured Data / MusicGroup

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `structuredDataEnabled` | bool | true | Enable Schema.org JSON-LD output |
| `musicGroupEnabled` | bool | false | Enable MusicGroup schema |
| `musicGroupName` | string | `Pellerhead` | MusicGroup name |
| `musicGroupGenre` | string | `Rock, Punk, Electronic` | MusicGroup genre |
| `musicGroupDescription` | string | (empty) | MusicGroup description |
| `musicGroupImage` | string | (empty) | MusicGroup image reference |

### Container (`mpc/mp-core-container`)

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `container.grid.enabled` | bool | true | Enable grid element |
| `container.grid.defaultColumns` | int | 2 | Default column count |
| `container.grid.maxColumns` | int | 4 | Maximum columns |
| `container.grid.gutterSize` | string | `20px` | Grid gutter |
| `container.accordion.enabled` | bool | true | Enable accordion element |
| `container.accordion.allowMultiple` | bool | false | Allow multiple open items |
| `container.accordion.firstOpen` | bool | true | Open first item by default |
| `container.tabs.enabled` | bool | true | Enable tabs element |
| `container.tabs.position` | string | `top` | Tab bar position |
| `container.wrapper.maxWidth` | string | `1200px` | Wrapper max width |
| `container.wrapper.padding` | string | `15px` | Wrapper padding |

### News (`mpc/mp-core-news`)

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `news.list.paginate.itemsPerPage` | int | 10 | Items per page |
| `news.list.orderBy` | string | `datetime` | Sort field |
| `news.list.orderDirection` | string | `desc` | Sort direction |
| `news.list.dateFormat` | string | `d.m.Y` | Date format |
| `news.list.showCategories` | bool | true | Show categories in list |
| `news.list.showTags` | bool | true | Show tags in list |
| `news.detail.showBackLink` | bool | true | Show back link |
| `news.detail.showRelated` | bool | true | Show related news |
| `news.detail.relatedLimit` | int | 3 | Related news limit |
| `news.detail.enableComments` | bool | false | Enable comments |
| `news.media.maxWidth` | int | 1200 | Max image width |
| `news.media.maxHeight` | int | 800 | Max image height |

### Form (`mpc/mp-core-form`)

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `form.honeypot.enabled` | bool | true | Enable honeypot spam protection |
| `form.confirmationPage.enabled` | bool | true | Show confirmation page |
| `form.requiredFieldMarker` | string | `*` | Required field marker |
| `form.email.senderName` | string | `Website Contact Form` | Email sender name |
| `form.email.senderEmail` | string | `noreply@example.com` | Email sender address |
| `form.email.replyToEmail` | string | `info@example.com` | Reply-to address |
| `form.validation.clientSide` | bool | true | Client-side validation |
| `form.validation.showInlineErrors` | bool | true | Show inline errors |
| `form.storage.saveToDatabase` | bool | false | Save submissions to DB |
| `form.storage.uploadFolder` | string | `1:/forms/` | Upload folder |

### SEO (`mpc/mp-core-seo`)

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `seo.meta.defaultDescription` | string | (empty) | Default meta description |
| `seo.meta.generateDescriptions` | bool | true | Auto-generate descriptions |
| `seo.meta.maxDescriptionLength` | int | 160 | Max description length |
| `seo.meta.maxTitleLength` | int | 60 | Max title length |
| `seo.meta.titleSeparator` | string | ` \| ` | Title separator |
| `seo.openGraph.enabled` | bool | true | Enable Open Graph |
| `seo.openGraph.defaultImage` | string | (empty) | Default OG image |
| `seo.openGraph.imageWidth` | int | 1200 | OG image width |
| `seo.openGraph.imageHeight` | int | 630 | OG image height |
| `seo.twitter.enabled` | bool | true | Enable Twitter Cards |
| `seo.twitter.cardType` | string | `summary_large_image` | Twitter card type |
| `seo.twitter.site` | string | (empty) | Twitter @username |
| `seo.sitemap.enabled` | bool | true | Enable XML sitemap |
| `seo.sitemap.excludeHiddenPages` | bool | true | Exclude hidden pages |
| `seo.sitemap.priority` | string | `0.5` | Default sitemap priority |
| `seo.canonical.enabled` | bool | true | Enable canonical URLs |
| `seo.schema.enabled` | bool | true | Enable Schema.org |
| `seo.schema.organizationType` | string | `Organization` | Publisher @type for JSON-LD |

### Using Settings in TypoScript

```typoscript
# Constants
mpCore.design.primaryColor = {$settings.design.colors.primary}

# Setup
page.10.templateRootPaths.10 = {$settings.pageTemplates}
```

---

## TypoScript Structure

```
Configuration/
├── Sets/
│   ├── mp-core/
│   │   └── config.yaml (aggregator)
│   ├── mp-core-base/
│   │   └── config.yaml, settings.yaml, settings.definitions.yaml
│   ├── mp-core-container/
│   │   ├── config.yaml, settings.yaml, settings.definitions.yaml
│   │   ├── constants.typoscript, setup.typoscript
│   ├── mp-core-news/
│   │   ├── config.yaml, settings.yaml, settings.definitions.yaml
│   │   ├── constants.typoscript, setup.typoscript
│   ├── mp-core-form/
│   │   ├── config.yaml, settings.yaml, settings.definitions.yaml
│   │   ├── constants.typoscript, setup.typoscript
│   └── mp-core-seo/
│       ├── config.yaml, settings.yaml, settings.definitions.yaml
│       ├── constants.typoscript, setup.typoscript
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
    10 = {$settings.pageTemplates}
  }
  partialRootPaths {
    0 = EXT:mp_core/Resources/Private/Partials/
    10 = {$settings.pagePartials}
  }
  layoutRootPaths {
    0 = EXT:mp_core/Resources/Private/Layouts/
    10 = {$settings.pageLayouts}
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

- [Frontend](Frontend.md) -- Build system and asset pipeline
- [Favicons](Favicons.md) -- Favicon generation
- [TYPO3 TCA Reference](https://docs.typo3.org/m/typo3/reference-tca/main/en-us/)
- [TYPO3 Site Sets](https://docs.typo3.org/m/typo3/reference-coreapi/main/en-us/ApiOverview/SiteHandling/SiteSets.html)
- [TYPO3 TypoScript Reference](https://docs.typo3.org/m/typo3/reference-typoscript/main/en-us/)
- [b13/container](https://github.com/b13/container)
