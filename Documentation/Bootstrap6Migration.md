# Bootstrap 6 migration (mp-core)

Work happens on git branch **`feature/bootstrap-6`**. **`main`** remains Bootstrap 5 for production. **Never merge `feature/bootstrap-6` into `main`** — ship and test BS6 only on the feature branch (e.g. DDEV checked out to that branch).

## After pulling the branch

1. `cd Build && npm ci && npm run build`
2. In TYPO3 **Admin Tools → Upgrade → Upgrade Wizard**, run in order:
   - **MP Core: Migrate tx_link_layout button classes to Bootstrap 6**
   - **MP Core: Migrate RTE HTML fields to Bootstrap 6 markup**
3. Flush caches and visually compare with [mpcore.de](https://www.mpcore.de/) (navigation, dark mode, gallery, forms, search).

## Developer checks

From `Build/`:

```bash
npm run audit:bs6
npm run codemod:bs6-utilities   # after bulk template edits from main
npm run codemod:bs6-rename
npm run build
```

From package root (DDEV recommended for PHPUnit):

```bash
composer cs
composer test:unit
composer test:functional
```

GitHub **CI** (`frontend` job) runs the same frontend gate as a local release check: `npm run lint`, Playwright install, `npm run test:unit`, `npm run audit:bs6`, and `npm run build` (includes bundle size budgets).

## Site configuration (colour tokens)

When `color-toggle` is enabled, [Resources/Private/Partials/Page/Styles.html](../Resources/Private/Partials/Page/Styles.html) emits BS6 token names (`--primary-base`, `--bg-1` … `--bg-8` for editor frame colours, …). The mpc site config (`config/sites/mpc/config.yaml`) should **not** use legacy `--bs-*` in the `styles` field — that YAML is not migrated by upgrade wizards. After pulling the branch, confirm `styles:` is empty or uses BS6 custom properties only.

## Stored content

Upgrade wizards update `tt_content.tx_link_layout`, `bodytext`, and `tx_link_text`. New editors use BS6 classes from TCA and [`Configuration/RTE/Default.yaml`](../Configuration/RTE/Default.yaml).

## SCSS tokens (BS6-native)

Bootstrap 6 theme configuration lives in compile-time maps:

- `_mpc-bootstrap-theme.scss` — `$theme-colors` (primary, secondary, danger, tertiary, quaternary) with full BS6 semantic keys (`bg-subtle`, `bg-muted`, `focus-ring`, …) so `:root` exposes `--{role}-bg-subtle` etc.
- `_mpc-bs6-root-overrides.scss` — `$root-tokens` (typography, body fg/bg, links, MPC accent colours)
- BS6 default `$font-sizes` (no MPC scale override; CKEditor mirrors via `_ckeditor-text-mixins.scss`)

MPC SCSS uses **BS6 custom properties** (`--primary-base`, `--fg-body`, `--gray-800`, `--font-size-md`, …). Editor frame backgrounds (`bgcolor-1` … `bgcolor-8`) use **`--bg-1` … `--bg-8`** from Bootstrap’s `$theme-bgs` (slots 5–8 extended in `_mpc-bootstrap-theme.scss`; 1–4 are BS6 defaults). Site `color-1` … `color-8` YAML overrides map to `--bg-*` in `Styles.html`. Typography uses BS6 **`--font-size-*` / `--line-height-*`** (default fluid scale). There is **no** `--bs-*` variable bridge in `bootstrap.scss`.

Custom CSS in site configuration should prefer BS6 token names; legacy `--bs-*` in stored `styles` YAML is not rewritten automatically.

## Grid light / dark

Fluid layouts add `grid-light` or `grid-dark` on containers/teasers. Only **`.grid-light`** has extra SCSS ([Elements/_gridlightdark.scss](../Build/Assets/Scss/Elements/_gridlightdark.scss)) — same as on Bootstrap 5 `main`. **`.grid-dark`** relies on default `--fg-body` on the frame; no extra rules required.

## Guiding rule (minimal overrides)

Bootstrap 6 owns breakpoints, containers, spacing, radius, the fluid `$font-sizes` scale, and component metrics. MPC overrides only **brand**: OpenSans/SpecialElite, `$theme-colors`, and body/link tokens in `_mpc-bs6-root-overrides.scss`.

When something looks wrong, fix in order: **Fluid markup (BS6 utilities/variants) → component CSS tokens → minimal SCSS**. Avoid `bs6-component-specificity` unless markup and tokens cannot reach parity.

Visual parity with [mpcore.de](https://www.mpcore.de/) means the same design language (colours, pills, icons, dark/light), not pixel-identical BS5 breakpoints or font sizes.

## Feature inventory (vs `main`)

Compare on **https://mpcore.ddev.docker/** after `npm run build` and `vendor/bin/typo3 cache:flush`. Mark each row when sign-off is done.

| Area | Feature | Template / script |
|------|---------|-------------------|
| Page | Default, Article layouts | `Templates/Page/*.html` |
| Nav | Primary / Secondary / Tertiary desktop + mobile | `Partials/Page/Navigation/**`, `code/Navigation/*/navigation.ts`, `nav-toggle.ts` |
| Nav | Breadcrumb, subnav, language, search autosuggest | `_breadcrumb.scss`, `SubNav.html`, `Search.html`, `searchAutosuggest.ts` |
| Nav | Theme switch | `NavMeta.html`, `theme.ts` |
| Content | Stage, Banner, Singleteaser, supplement | `Stage.html`, `Banner.html`, `Singleteaser.html`, FSC partials |
| Content | Gallery (single, tiles, slider, thumbs) + description dialog | `Gallery.html`, `galleryDialog.ts`, `modalGallery.ts`, Vue `GallerySwiper` |
| Container | Accordion, Tabs, Grid, Slider, Modal record link | `Container/*.html`, `openAccordionAndTabs.ts`, `Modal.html`, `modalContent.ts` |
| FSC | Text/media, uploads, menus, image popup | `Resources/Extensions/fluid_styled_content/**` |
| Search | indexed_search form + results | `Resources/Extensions/indexed_search/**` |
| Global | Sticky header, totop, jarallax, pagination | `sticky.ts`, `totop.ts`, `jarallax.ts`, `pagination.ts` |
| Global | VidPly dynamic content hooks | `vidply-dynamic-content.ts` |
| Editor | CKEditor frontend mirror | `ckeditor.css`, `Configuration/RTE/Default.yaml` |

**Frontend modules** (all imported from `screen.ts` on BS6): `main`, `theme`, `sticky`, `totop`, `jarallax`, `pagination`, `searchAutosuggest`, `openAccordionAndTabs`, `modalContent`, `modalGallery`, `galleryDialog`, `nav-toggle`, `moveMeta`, `moveHeaderDate`, `i18n`, `i18nLinkHelper`, Primary/Secondary/Tertiary navigation, Vue gallery/slider/todo.

Branch diff vs `main`: ~30 Fluid files changed; remaining templates already matched BS6 or use FSC overrides only.

## Override audit (ongoing)

Track fights against BS6 and shrink them:

| Pattern | Where | Direction |
|---------|-------|-----------|
| `bs6-component-specificity` | `_modal.scss`, `_carousel.scss`, `_gallery.scss`, navigation BS6 shells | Prefer markup/utilities; keep for `btn-close` until BS6 token API covers gallery chrome |
| `!important` | buttons, nav, print, ckeditor | Remove when token or utility replaces |
| `light-theme` mixin | legacy SCSS modules | Replace with `light-dark()` / `data-bs-theme` tokens |
| Hard-coded radii (25px pills) | `_modal.scss` | Prefer `--radius-*` / `rounded-pill` in templates where possible |
| Per-slide `.carousel-iterator` | removed from gallery | Counter lives in footer markup; `galleryDialog.ts` updates on `slid.bs.carousel` |

Run `rg "bs6-component-specificity|!important" Build/Assets/Scss` after each parity pass.

## Visual parity sign-off (vs production)

Compare **https://mpcore.ddev.docker/** with [mpcore.de](https://www.mpcore.de/) in **dark and light** theme:

- Primary / secondary / tertiary navigation (desktop flyout + mobile menu)
- Breadcrumb, subnav, search autosuggest (Menu)
- Theme switch (metanav)
- Frame colours `bgcolor-1` … `bgcolor-8` and grid-light headlines
- Stage, teaser, supplement (secondary subtle gradient), banner
- Gallery (Dialog + footer counter + prev/next + download/copyright Menu)
- Carousel CE, accordion/details, tabs hash deep-link
- ext:form fields, indexed search (collapse advanced)
- CKEditor frontend (`ckeditor.css`) on RTE test pages

Record fixes in `CHANGELOG.md` `[Unreleased]`; leave the changelog unstaged until release curation.

## Upgrade wizards

If `php vendor/bin/typo3 upgrade:list` reports **no wizards available**, link-layout and RTE migrations were already applied on that database. Re-run only after restoring an older DB snapshot or when wizards are marked pending again in the Install Tool.

See also [Frontend.md — Bootstrap version and Git branches](Frontend.md#bootstrap-version-and-git-branches).
