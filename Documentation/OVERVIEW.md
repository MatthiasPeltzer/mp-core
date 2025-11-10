# MP Core - Complete Feature Overview

Comprehensive guide to all features, components, and capabilities of the MP Core TYPO3 extension.

---

## System Requirements

- **TYPO3**: ^13.4
- **PHP**: ≥8.2 (tested with 8.2 and 8.3)
- **Node.js**: ≥20 (Node 22 recommended)
- **npm**: ≥10

---

## Core Features

### 1. Modern Frontend Stack

- **Vite 7.2** - Lightning-fast build tool with HMR
- **Bootstrap 5.3.8** - Responsive UI framework with custom theming
- **Vue.js 3.5** - Progressive framework for interactive components
- **Sass 1.93** - Advanced CSS preprocessing with ITCSS architecture
- **PostCSS** - Autoprefixer and px-to-rem conversion
- **ESLint 9** & **Stylelint 16** - Code quality enforcement

### 2. Accessible Media Player (VidPly 1.0.10)

WCAG 2.1 AA compliant audio and video player with:
- Multi-quality source selection
- WebVTT captions and subtitles
- Interactive transcripts
- Audio descriptions
- Sign language overlay
- Keyboard navigation
- Screen reader support
- Customizable playback controls
- HLS streaming support

### 3. Content Elements

#### Media Elements
- **Audio** - VidPly-powered audio player with playlists
- **Video** - VidPly-powered video player with advanced features
- **Gallery** - Responsive image galleries with lightbox

#### Layout Elements
- **Stage** - Hero sections with image/video backgrounds
- **Banner** - Customizable banner sections
- **Single Teaser** - Content teasers with images and links

#### Container Elements (b13/container)
- **Accordion** - Collapsible content sections
- **Tabs** - Tabbed content panels
- **Slider** - Swiper-powered carousels
- **Grid** - Flexible grid layouts
- **Container** - Generic content wrapper

#### Interactive Elements
- **TodoList** - Vue.js 3 todo list with localStorage
- **Menu Subpages** - Enhanced subpage menus

#### Content Blocks
- **Definition List** - Structured definition lists

### 4. Site Sets (TYPO3 13.4+)

Modular configuration system with five sets:

1. **mpc/mp-core** (required) - Core functionality
2. **mpc/mp-core-container** - Container element configuration
3. **mpc/mp-core-news** - News extension integration
4. **mpc/mp-core-form** - Form framework configuration
5. **mpc/mp-core-seo** - SEO optimization settings

### 5. Site Settings

Backend-editable configuration categories:

- **PIDs** - Page IDs for navigation, categories, supplements
- **Content** - Text/media settings, lightbox, headers, links
- **Config** - Admin panel, debug, cache, spam protection
- **Performance** - JS/CSS compression, concatenation, lazy loading
- **Design** - Colors, fonts, breakpoints, container widths
- **Navigation** - Menu depth, breadcrumbs, hidden pages
- **Meta** - Viewport, robots, Google verification
- **Container** - Grid, accordion, tabs, slider settings
- **News** - Pagination, ordering, categories, media
- **Form** - Email, validation, storage, honeypot
- **SEO** - Open Graph, Twitter Cards, sitemap, canonical URLs

### 6. Enhanced TCA

#### Page Enhancements
- Feature toggles (newsletter, social media, breadcrumb, header container, highlight)
- Teaser description field
- Category title field
- Main category relation

#### File Metadata
- Accessibility flag (`is_accessible`)
- RTE-enabled description
- Enhanced file reference fields (outline, allow_download, caption, language code, track kind, quality label)

#### Content Element Additions
- Global link wizard with layout options
- Extended header configuration
- Custom palettes for consistent field grouping

### 7. Extension Integrations

#### Fluid Styled Content
- Custom templates for all content elements
- Bootstrap 5 styling
- Responsive image rendering

#### EXT:news
- List and detail view templates
- Category and tag rendering
- Pagination support
- Custom date formats

#### EXT:form
- Bootstrap-styled form elements
- Custom layouts and templates
- YAML configuration
- Validation styling

#### EXT:indexed_search
- Search form and results templates
- Bootstrap styling

#### EXT:seo
- Open Graph meta tags
- Twitter Card support
- Schema.org markup
- XML sitemap generation

### 8. Custom PHP Classes

#### ViewHelpers
- **SvgInlineViewHelper** - Inline SVG rendering with attributes
- **Json\DecodeViewHelper** - JSON decoding in Fluid

#### UserFunc
- **ColorPickerValueItems** - Dynamic color picker from site config

#### Backend
- **FilesControlContainer** - Enhanced file field container with domain validation

#### Resource Helpers
- **GenericExternalAudioHelper** - External audio source support
- **GenericExternalVideoHelper** - External video source support
- **GenericExternalAudioRenderer** - Audio rendering
- **GenericExternalVideoRenderer** - Video rendering

### 9. JavaScript Modules

#### Entry Bundles
- `bootstrap.js` - Bootstrap framework
- `screen.js` - Main frontend functionality
- `vidply.js` - VidPly player
- `vue.js` - Vue components
- `swiper.js` - Swiper carousels
- `navigationPrimary/Secondary/Tertiary.js` - Navigation levels
- `print.js` - Print styles
- `backend.js` - Backend styles
- `ckeditor.js` - CKEditor styles

#### Feature Modules
- Theme switcher (dark mode)
- Sticky header
- Back-to-top with progress
- Modal galleries
- Jarallax parallax
- GDPR-friendly external players (YouTube, Vimeo, SoundCloud)
- Pagination
- Accordion/tabs deep linking
- Teaser hover states

#### Vue Components
- TodoList - Interactive todo list with localStorage

### 10. SCSS Architecture (ITCSS)

Organized in layers:
1. **Settings** - Variables, fonts, colors
2. **Tools** - Mixins and functions
3. **Generic** - Reset, normalize
4. **Elements** - Base HTML elements
5. **Objects** - Layout patterns
6. **Components** - UI modules
7. **Utilities** - Helper classes

Includes:
- Bootstrap 5 customization (light & dark themes)
- Custom font integration (Open Sans, Turret Road)
- VidPly theming
- Responsive breakpoints
- CSS logical properties for RTL support

### 11. Backend Features

- Custom backend layouts with preview SVGs
- CKEditor preset with custom styles
- Backend CSS for consistent editing experience
- Color picker integration with site configuration
- Enhanced file upload with domain validation
- FlexForm for Vue components

### 12. Accessibility Features

- WCAG 2.1 AA compliant media player
- Keyboard navigation support
- Screen reader announcements
- ARIA labels and roles
- Skip links
- Focus management
- High contrast mode support (forced-colors)
- Semantic HTML structure

### 13. Performance Optimizations

- Vite-optimized asset bundling
- Code splitting
- Tree shaking
- CSS/JS minification
- Image optimization
- Lazy loading support
- Async script loading
- Font subsetting (WOFF2)

### 14. Developer Experience

- Hot Module Replacement (HMR) with Vite
- ESLint with modern config
- Stylelint with SCSS support
- Source maps in development
- Watch mode for continuous builds
- Consistent code formatting
- Modular architecture
- Clear separation of concerns

---

## File Structure

```
mp_core/
├── Build/                          # Frontend build system
│   ├── Assets/                     # Source files
│   │   ├── Fonts/                  # Web fonts
│   │   ├── Images/                 # Source images
│   │   ├── Scripts/                # JavaScript/Vue
│   │   ├── Scss/                   # SCSS files
│   │   └── Static/                 # Static files (copied as-is)
│   ├── node_modules/               # npm dependencies
│   ├── package.json                # npm configuration
│   ├── vite.config.js              # Vite configuration
│   ├── eslint.config.js            # ESLint configuration
│   └── stylelint.config.js         # Stylelint configuration
├── Classes/                        # PHP classes
│   ├── Backend/                    # Backend classes
│   ├── Exception/                  # Custom exceptions
│   ├── Resource/                   # FAL helpers
│   ├── UserFunc/                   # TCA user functions
│   └── ViewHelpers/                # Fluid ViewHelpers
├── Configuration/                  # TYPO3 configuration
│   ├── Extensions/                 # Extension overrides
│   ├── FlexForms/                  # FlexForm definitions
│   ├── RTE/                        # CKEditor configuration
│   ├── Sets/                       # Site Sets
│   ├── SiteConfiguration/          # Site config overrides
│   ├── TCA/                        # TCA definitions
│   ├── TsConfig/                   # TSconfig
│   ├── TypoScript/                 # TypoScript
│   ├── Icons.php                   # Icon registry
│   ├── JavaScriptModules.php       # Backend JS modules
│   └── Services.yaml               # Dependency injection
├── ContentBlocks/                  # Content Blocks
│   └── ContentElements/            # Content Block elements
├── Documentation/                  # Extension documentation
├── Resources/                      # Templates and assets
│   ├── Extensions/                 # Extension template overrides
│   ├── Private/                    # Fluid templates
│   │   ├── Backend/                # Backend templates
│   │   ├── Language/               # Translation files
│   │   ├── Layouts/                # Fluid layouts
│   │   ├── Partials/               # Fluid partials
│   │   └── Templates/              # Fluid templates
│   └── Public/                     # Compiled assets
│       ├── BackendLayouts/         # Backend layout previews
│       ├── Favicons/               # Favicon files
│       ├── Fonts/                  # Compiled fonts
│       ├── Icons/                  # Compiled icons
│       ├── Images/                 # Compiled images
│       ├── JavaScripts/            # Compiled JS
│       └── StyleSheets/            # Compiled CSS
├── composer.json                   # Composer configuration
├── ext_emconf.php                  # Extension metadata
├── ext_localconf.php               # Extension configuration
├── ext_tables.sql                  # Database schema
└── README.md                       # Quick start guide
```

---

## Quick Links

### Getting Started
- [README](../README.md) - Quick start guide
- [Installation Guide](README.md#installation) - Detailed setup

### Frontend Development
- [Frontend Guide](Frontend-Guide.md) - Build system and project structure
- [Frontend Development](Frontend-Development.md) - JavaScript and SCSS architecture
- [Favicons](Favicons.md) - Favicon generation

### TYPO3 Configuration
- [TYPO3 Configuration](TYPO3-Configuration.md) - Site Sets, Settings, TypoScript
- [TCA Overview](TCA-Overview.md) - Content element configuration

### Special Features
- [VidPly Integration](Vidply.md)

### External Resources
- [TYPO3 Documentation](https://docs.typo3.org/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Vue.js Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [VidPly Documentation](https://github.com/MatthiasPeltzer/vidply)

---

**Version**: 1.0.0
**TYPO3**: 13.4+
**PHP**: ≥8.2
**License**: GPL-3.0-or-later
**Author**: Matthias Peltzer

