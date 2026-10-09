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

## Stored content

Upgrade wizards update `tt_content.tx_link_layout`, `bodytext`, and `tx_link_text`. New editors use BS6 classes from TCA and [`Configuration/RTE/Default.yaml`](../Configuration/RTE/Default.yaml).

## SCSS tokens (BS6-native)

Bootstrap 6 theme configuration lives in compile-time maps:

- `_mpc-bootstrap-theme.scss` — `$theme-colors` (primary, secondary, danger, tertiary, quaternary, …)
- `_mpc-bs6-root-overrides.scss` — `$root-tokens` (typography, body fg/bg, links, MPC accent colours)
- `_mpc-bs6-config-overrides.scss` — `$font-sizes`

MPC SCSS uses **BS6 custom properties** (`--primary-base`, `--fg-body`, `--gray-800`, …). Frame content colours use **`--mpc-color-1` … `--mpc-color-8`** (defaults in `Templates/_general.scss`, overrides in `Styles.html` when color-toggle is on). There is **no** `--bs-*` variable bridge in `bootstrap.scss`.

Custom CSS in site configuration should prefer BS6 token names; legacy `--bs-*` in stored `styles` YAML is not rewritten automatically.

See also [Frontend.md — Bootstrap version and Git branches](Frontend.md#bootstrap-version-and-git-branches).
