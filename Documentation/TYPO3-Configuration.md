# TYPO3 Configuration

Complete guide to Site Sets, Site Settings, and TypoScript configuration in MP Core.

---

## Site Sets

MP Core uses TYPO3 13.4+ Site Sets for modular, maintainable configuration.

### Available Sets

1. **`mpc/mp-core`** (required) - Core functionality
2. **`mpc/mp-core-container`** - Container elements (accordion, tabs, slider, grid)
3. **`mpc/mp-core-news`** - News extension integration
4. **`mpc/mp-core-form`** - Form framework configuration
5. **`mpc/mp-core-seo`** - SEO optimization (Open Graph, Twitter Cards, sitemap)

### Enabling Site Sets

#### Via Backend

1. Navigate to **Site Management → Sites**
2. Select your site
3. Go to **Sets** tab
4. Enable `MP Core` (required) and optional sets
5. Order: `MP Core` first, then optional sets

#### Via Configuration File

Edit `config/sites/[your-site]/config.yaml`:

```yaml
base: 'https://example.com'
rootPageId: 1
dependencies:
  - mpc/mp-core           # required
  - mpc/mp-core-container # optional
  - mpc/mp-core-news      # optional
  - mpc/mp-core-form      # optional
  - mpc/mp-core-seo       # optional
```

### Set Contents

#### Core Set (`mpc/mp-core`)

Location: `Configuration/Sets/mp-core/`

Provides:
- TypoScript setup and constants
- Page TSconfig
- Settings definitions and defaults
- Template paths configuration
- Content element rendering
- Base styling and scripts

#### Container Set (`mpc/mp-core-container`)

Provides:
- Container element templates (Accordion, Tabs, Slider, Grid)
- Container-specific settings (columns, gutters, toggle behavior)
- Container styling

#### News Set (`mpc/mp-core-news`)

Provides:
- Custom templates for list and detail views
- Pagination configuration
- Category and tag rendering
- Date format settings
- Related news configuration

#### Form Set (`mpc/mp-core-form`)

Provides:
- Bootstrap-styled form templates
- Email configuration (sender, reply-to)
- Validation settings
- Honeypot spam protection
- Form storage configuration

#### SEO Set (`mpc/mp-core-seo`)

Provides:
- Open Graph meta tags
- Twitter Card configuration
- Schema.org markup
- XML sitemap settings
- Canonical URL configuration

---

## Site Settings

Site Settings provide backend-editable configuration without touching TypoScript.

### Accessing Settings

#### Via Backend (Recommended)

1. Navigate to **Site Management → Sites**
2. Select your site
3. Go to **Settings** tab
4. Modify values organized by category

#### Via YAML File

Edit `config/sites/[your-site]/settings.yaml`:

```yaml
settings:
  mpCore:
    design:
      colors:
        primary: '#0066cc'
        secondary: '#ff6600'
    performance:
      compressJs: true
      compressCss: true
    navigation:
      maxDepth: 3
```

### Settings Categories

#### Core Settings (`mpCore`)

**PIDs (Page IDs)**
- `PIDs.pidHome` - Home page ID (default: 1)
- `PIDs.pidMetaNavTop` - Top meta navigation root
- `PIDs.pidMetaNavFooter` - Footer navigation root
- `PIDs.pidCategories` - Categories folder
- `PIDs.pidSupplement` - Supplement content folder

**Design**
- `design.colors.primary` - Primary brand color
- `design.colors.secondary` - Secondary brand color
- `design.fonts.primary` - Body font family
- `design.fonts.heading` - Heading font family
- `design.breakpoints.*` - Responsive breakpoints
- `design.container.maxWidth` - Container max width

**Performance**
- `performance.compressJs` - Enable JS compression
- `performance.compressCss` - Enable CSS compression
- `performance.concatenateJs` - Concatenate JS files
- `performance.concatenateCss` - Concatenate CSS files
- `performance.enableLazyLoading` - Enable image lazy loading

**Content**
- `content.textmedia.maxWidth` - Max image width
- `content.lightbox.enabled` - Enable lightbox
- `content.lightbox.cssClass` - Lightbox CSS class
- `content.defaultHeaderType` - Default header level
- `content.links.extTarget` - External link target

**Navigation**
- `navigation.maxDepth` - Menu depth
- `navigation.showHiddenPages` - Show hidden pages
- `navigation.enableBreadcrumb` - Enable breadcrumb
- `navigation.breadcrumb.includeHome` - Include home in breadcrumb

**Meta Tags**
- `meta.viewport` - Viewport meta tag
- `meta.robots` - Robots meta tag
- `meta.googleSiteVerification` - Google verification code

**Configuration**
- `config.admPanel` - Enable admin panel
- `config.debug` - Enable debug mode
- `config.noCache` - Disable caching
- `config.spamProtectEmailAddresses` - Protect email addresses

#### Container Settings (`mpc/mp-core-container`)

**Grid**
- `container.grid.enabled` - Enable grid containers
- `container.grid.defaultColumns` - Default column count
- `container.grid.maxColumns` - Maximum columns
- `container.grid.gutterSize` - Gutter size

**Accordion**
- `container.accordion.enabled` - Enable accordions
- `container.accordion.allowMultiple` - Allow multiple open
- `container.accordion.firstOpen` - First item open by default

**Tabs**
- `container.tabs.enabled` - Enable tabs
- `container.tabs.position` - Tab position (top/bottom)

**Wrapper**
- `container.wrapper.maxWidth` - Container max width
- `container.wrapper.padding` - Container padding

#### News Settings (`mpc/mp-core-news`)

**List View**
- `news.list.paginate.itemsPerPage` - Items per page
- `news.list.orderBy` - Sort field
- `news.list.orderDirection` - Sort direction
- `news.list.dateFormat` - Date format
- `news.list.showCategories` - Show categories
- `news.list.showTags` - Show tags

**Detail View**
- `news.detail.showBackLink` - Show back link
- `news.detail.showRelated` - Show related news
- `news.detail.relatedLimit` - Related news limit
- `news.detail.enableComments` - Enable comments

**Media**
- `news.media.maxWidth` - Max image width
- `news.media.maxHeight` - Max image height

#### Form Settings (`mpc/mp-core-form`)

**General**
- `form.honeypot.enabled` - Enable honeypot
- `form.confirmationPage.enabled` - Enable confirmation page
- `form.requiredFieldMarker` - Required field marker

**Email**
- `form.email.senderName` - Sender name
- `form.email.senderEmail` - Sender email
- `form.email.replyToEmail` - Reply-to email

**Validation**
- `form.validation.clientSide` - Enable client-side validation
- `form.validation.showInlineErrors` - Show inline errors

**Storage**
- `form.storage.saveToDatabase` - Save to database
- `form.storage.uploadFolder` - Upload folder path

#### SEO Settings (`mpc/mp-core-seo`)

**Meta Tags**
- `seo.meta.generateDescriptions` - Auto-generate descriptions
- `seo.meta.maxDescriptionLength` - Max description length
- `seo.meta.maxTitleLength` - Max title length
- `seo.meta.titleSeparator` - Title separator

**Open Graph**
- `seo.openGraph.enabled` - Enable Open Graph
- `seo.openGraph.defaultImage` - Default OG image
- `seo.openGraph.imageWidth` - OG image width
- `seo.openGraph.imageHeight` - OG image height

**Twitter Cards**
- `seo.twitter.enabled` - Enable Twitter Cards
- `seo.twitter.cardType` - Card type
- `seo.twitter.site` - Twitter handle

**Sitemap**
- `seo.sitemap.enabled` - Enable XML sitemap
- `seo.sitemap.excludeHiddenPages` - Exclude hidden pages
- `seo.sitemap.priority` - Default priority

**Canonical & Schema**
- `seo.canonical.enabled` - Enable canonical URLs
- `seo.schema.enabled` - Enable Schema.org markup
- `seo.schema.organizationType` - Organization type

### Settings Flow

```
Backend Settings Editor
         ↓
settings.yaml (defaults)
         ↓
TypoScript Constants
         ↓
TypoScript Setup
         ↓
Fluid Templates
```

### Using Settings in TypoScript

**Constants:**
```typoscript
mpCore {
  design {
    primaryColor = {$settings.mpCore.design.colors.primary}
  }
}
```

**Setup:**
```typoscript
page.10 {
  templateRootPaths {
    10 = {$settings.mpCore.templates.templateRootPath}
  }
}
```

---

## TypoScript Structure

### File Organization

```
Configuration/
├── Sets/
│   └── mp-core/
│       ├── config.yaml              # Site set definition
│       ├── constants.typoscript     # Constants
│       ├── setup.typoscript         # Main setup (imports)
│       ├── page.tsconfig            # Page TSconfig
│       ├── settings.definitions.yaml # Settings schema
│       └── settings.yaml            # Default values
├── TypoScript/
│   ├── constants.typoscript         # Legacy constants
│   ├── setup.typoscript             # Legacy setup
│   ├── VueComponents.typoscript     # Vue.js setup
│   ├── Helper/
│   │   └── PageClass.typoscript     # Page class helper
│   ├── Constants/
│   │   ├── 10.Paths.typoscript
│   │   ├── 20.Page.typoscript
│   │   └── ...
│   └── Setup/
│       ├── 10.Config.typoscript
│       ├── 20.Page.typoscript
│       ├── 30.Page.Styles.typoscript
│       ├── 40.Page.Scripts.typoscript
│       ├── 50.Page.Navigation.typoscript
│       ├── 60.Lib.typoscript
│       ├── Page/
│       │   └── *.typoscript
│       └── ContentElements/
│           └── tt_content/
│               └── *.typoscript
└── Extensions/
    ├── constants.typoscript
    └── setup.typoscript
```

### Setup File Purposes

| File | Purpose |
|------|---------|
| `10.Config.typoscript` | Basic TYPO3 config (charset, language, cache) |
| `20.Page.typoscript` | Page object, template paths, data processors |
| `30.Page.Styles.typoscript` | CSS includes |
| `40.Page.Scripts.typoscript` | JavaScript includes |
| `50.Page.Navigation.typoscript` | Conditional navigation bundles |
| `60.Lib.typoscript` | Shared objects (`lib.*`) |
| `ContentElements/tt_content/*.typoscript` | Content element rendering |
| `VueComponents.typoscript` | Vue.js component setup |

### Import Pattern

From `Configuration/Sets/mp-core/setup.typoscript`:

```typoscript
@import 'EXT:mp_core/Configuration/TypoScript/Helper/PageClass.typoscript'
@import 'EXT:mp_core/Configuration/TypoScript/Setup/Page/*.typoscript'
@import 'EXT:mp_core/Configuration/TypoScript/Setup/*.typoscript'
@import 'EXT:mp_core/Configuration/Extensions/setup.typoscript'
@import 'EXT:mp_core/Configuration/TypoScript/Setup/ContentElements/tt_content/*.typoscript'
@import 'EXT:mp_core/Configuration/TypoScript/VueComponents.typoscript'
```

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

**Path Precedence:** Higher numbers override lower numbers.

### Asset Includes

**CSS:**
```typoscript
page {
  includeCSS {
    bootstrap = EXT:mp_core/Resources/Public/StyleSheets/bootstrap.css
    screen = EXT:mp_core/Resources/Public/StyleSheets/screen.css
    vidply = EXT:mp_core/Resources/Public/StyleSheets/vidply.css
  }
}
```

**JavaScript:**
```typoscript
page {
  includeJSFooter {
    bootstrap = EXT:mp_core/Resources/Public/JavaScripts/bootstrap.js
    screen = EXT:mp_core/Resources/Public/JavaScripts/screen.js
    vidply = EXT:mp_core/Resources/Public/JavaScripts/vidply.js
  }
}
```

**Conditional Navigation:**
```typoscript
[traverse(site, 'configuration/navType') == 'primary']
  page.includeJSFooter.navigationPrimary = EXT:mp_core/Resources/Public/JavaScripts/navigationPrimary.js
[END]
```

### Content Element Rendering

```typoscript
lib.contentElement {
  templateRootPaths {
    0 = EXT:fluid_styled_content/Resources/Private/Templates/
    10 = EXT:mp_core/Resources/Private/Templates/
  }
  partialRootPaths {
    0 = EXT:fluid_styled_content/Resources/Private/Partials/
    10 = EXT:mp_core/Resources/Private/Partials/
  }
  layoutRootPaths {
    0 = EXT:fluid_styled_content/Resources/Private/Layouts/
    10 = EXT:mp_core/Resources/Private/Layouts/
  }
}
```

### Extension Overrides

MP Core provides TypoScript for common extensions:

**News:**
```typoscript
plugin.tx_news {
  view {
    templateRootPaths.10 = EXT:mp_core/Resources/Extensions/news/Templates/
    partialRootPaths.10 = EXT:mp_core/Resources/Extensions/news/Partials/
    layoutRootPaths.10 = EXT:mp_core/Resources/Extensions/news/Layouts/
  }
}
```

**Form:**
```typoscript
plugin.tx_form {
  view {
    templateRootPaths.10 = EXT:mp_core/Resources/Extensions/form/Templates/
    partialRootPaths.10 = EXT:mp_core/Resources/Extensions/form/Partials/
    layoutRootPaths.10 = EXT:mp_core/Resources/Extensions/form/Layouts/
  }
}
```

**Indexed Search:**
```typoscript
plugin.tx_indexedsearch {
  view {
    templateRootPaths.10 = EXT:mp_core/Resources/Extensions/indexed_search/Templates/
    partialRootPaths.10 = EXT:mp_core/Resources/Extensions/indexed_search/Partials/
    layoutRootPaths.10 = EXT:mp_core/Resources/Extensions/indexed_search/Layouts/
  }
}
```

---

## Page TSconfig

Located in `Configuration/Sets/mp-core/page.tsconfig` and `Configuration/TsConfig/Page/*.tsconfig`.

Provides:
- RTE configuration
- Content element wizard configuration
- Backend layout configuration
- Module configuration
- User permissions

---

## Best Practices

### Site Sets
- Always enable `mpc/mp-core` first
- Add optional sets as needed
- Use consistent ordering across sites
- Document custom sets in your project

### Site Settings
- Use backend editor for non-developers
- Use YAML files for version control
- Override only what you need
- Document custom settings

### TypoScript
- Use Site Settings instead of hardcoded values
- Follow the import pattern
- Use numbered paths for overrides
- Keep custom TypoScript in your sitepackage
- Use conditions for site-specific logic

### Template Paths
- Use path numbers: 0 (core), 10 (extension), 20+ (project)
- Higher numbers override lower
- Keep consistent across all path types
- Document custom paths

---

## Common Tasks

### Override Template Paths

In `config/sites/[site]/settings.yaml`:

```yaml
settings:
  mpCore:
    templates:
      templateRootPath: 'EXT:my_sitepackage/Resources/Private/Templates/'
      partialRootPath: 'EXT:my_sitepackage/Resources/Private/Partials/'
      layoutRootPath: 'EXT:my_sitepackage/Resources/Private/Layouts/'
```

### Add Custom TypoScript

Create `Configuration/TypoScript/setup.typoscript` in your sitepackage:

```typoscript
# Include MP Core
@import 'EXT:mp_core/Configuration/Sets/mp-core/setup.typoscript'

# Your custom configuration
page.10.variables {
  myCustomVar = TEXT
  myCustomVar.value = Hello World
}
```

### Conditional Configuration

```typoscript
# Different config per site
[traverse(site, 'identifier') == 'mysite']
  page.10.variables.siteName = TEXT
  page.10.variables.siteName.value = My Site
[END]

# Different config per language
[siteLanguage('languageId') == 1]
  config.language = de
  config.locale_all = de_DE.UTF-8
[END]
```

---

## Further Reading

- [TCA Overview](TCA-Overview.md) - Content element configuration
- [Frontend Guide](Frontend-Guide.md) - Asset pipeline
- [OVERVIEW](OVERVIEW.md) - Complete feature reference
- [TYPO3 Site Sets Documentation](https://docs.typo3.org/m/typo3/reference-coreapi/main/en-us/ApiOverview/SiteHandling/SiteSets.html)
- [TYPO3 TypoScript Reference](https://docs.typo3.org/m/typo3/reference-typoscript/main/en-us/)

