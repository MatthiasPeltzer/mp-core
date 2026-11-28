# Build folder

Frontend asset pipeline for **mpc/mp-core**. Requires **Node.js 26+** and npm (aligned with mpcore DDEV `nodejs_version`).

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
| `build` | ESLint + Stylelint + Vite production build |
| `dev` | Lint + development build (source maps) |
| `watch` | Development build with watcher |
| `lint` | ESLint + Stylelint |
| `eslint` / `eslint.fix` | JavaScript |
| `stylelint` / `stylelint.fix` | SCSS |

---

## Vite

- Config: `vite.config.js`
- Static copy: `Assets/Static/` → `Resources/Public/` (includes **Favicons**, BackendLayouts)
- Entry points: `bootstrap`, `screen`, `navigationPrimary|Secondary|Tertiary`, `ckeditor`, `backend`, `print`, `vue`

See **[Documentation/Frontend.md](../Documentation/Frontend.md)** for architecture, SCSS layers, and Vue components.

---

## Documentation

All guides live in **`../Documentation/`**:

| Guide | Topic |
|-------|--------|
| [Documentation/README.md](../Documentation/README.md) | Hub |
| [Frontend.md](../Documentation/Frontend.md) | Vite, JS, SCSS, Vue |
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

---

## PHP quality (`composer ci`)

Run from the **mp-core** package root. With DDEV (from `mpcore/`):

```bash
ddev exec bash -c "cd packages/mp-core && composer ci"
```

Composer invokes linters under **`Build/scripts/`** (lowercase). Git always uses that path; on Windows the folder must use the same casing on disk or DDEV’s Linux mount exposes `Build/Scripts` and `php Build/scripts/...` fails.

If `composer ci` or `lint:*` reports a missing `Build/scripts/*.php` file inside DDEV but the files exist under `Build\Scripts`, fix NTFS casing (no content change in git):

```bash
git mv Build/scripts Build/_scripts_tmp
git mv Build/_scripts_tmp Build/scripts
```

Confirm in the container: `ls packages/mp-core/Build/scripts/lintPhp.php`.
