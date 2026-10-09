# Build folder

Frontend asset pipeline for **mpc/mp-core**. Requires **Node.js 22+** and npm. On **`feature/bootstrap-6`**, dependencies target **Bootstrap 6.0.0-alpha.1** (see `package.json`).

Output is written to **`../Resources/Public/`** (JavaScripts, StyleSheets, Fonts, Icons, Images, Favicons, BackendLayouts).

---

## Quick start

```bash
cd Build
npm ci
npm run watch   # development + file watcher
# or
npm run build   # production
```

In an mpc monorepo with DDEV: `ddev mp-core-build` from the site root.

---

## NPM scripts

| Script | Description |
|--------|-------------|
| `build` | Typecheck + ESLint + Stylelint + Vite production build |
| `typecheck` | `vue-tsc --noEmit` (strict TypeScript, Bootstrap upstream style) |
| `test:unit` | Vitest browser mode (Playwright / Chromium) |
| `test:browser:install` | Install Playwright Chromium for Vitest browser tests |
| `dev` | Lint + development build (source maps) |
| `watch` | Development build with watcher |
| `lint` | ESLint + Stylelint |
| `audit:bs6` | Scan sources for leftover Bootstrap 5 class/API patterns |
| `eslint` / `eslint.fix` | JavaScript and TypeScript (`Assets/Scripts`) |
| `stylelint` / `stylelint.fix` | SCSS |

---

## Vite

- Config: `vite.config.js`
- Static copy: `Assets/Static/` → `Resources/Public/` (includes **Favicons**, BackendLayouts)
- Entry points: `bootstrap`, `screen`, `navigationPrimary|Secondary|Tertiary`, `ckeditor`, `backend`, `print`, `vue`

See **[Documentation/Frontend.md](../Documentation/Frontend.md)** for architecture, SCSS layers, and Vue components.

**Bootstrap:** This branch builds **Bootstrap 6** (Menu, Dialog, BS6 utilities/tokens, Floating UI). Git **`main`** remains on **Bootstrap 5.3** for tagged releases — **do not merge `feature/bootstrap-6` into `main`**. Branch policy and markup differences: [Frontend.md — Bootstrap version and Git branches](../Documentation/Frontend.md#bootstrap-version-and-git-branches), [Bootstrap6Migration.md](../Documentation/Bootstrap6Migration.md).

---

## Documentation

All guides live in **`../Documentation/`**:

| Guide | Topic |
|-------|--------|
| [Documentation/README.md](../Documentation/README.md) | Hub |
| [Frontend.md](../Documentation/Frontend.md) | Vite, TypeScript, SCSS, Vue |
| [Bootstrap6Migration.md](../Documentation/Bootstrap6Migration.md) | BS6 upgrade wizards and verification |
| [Favicons.md](../Documentation/Favicons.md) | Icon files + `Favicons.html` (not static HTML injection) |
| [Backend.md](../Documentation/Backend.md) | RTE, TSconfig |
| [Configuration.md](../Documentation/Configuration.md) | Site Sets, settings |
| [ContentElements.md](../Documentation/ContentElements.md) | TCA reference |

---

## Clean build

```bash
rm -rf node_modules ../Resources/Public && npm ci && npm run build
```

On Windows, delete `node_modules` and `Resources/Public` manually, then run `npm ci` and `npm run build`.
