# Favicon Generation

Generate favicons using [RealFaviconGenerator](https://realfavicongenerator.net/):

**Option 1: Website (Quick)**
1. Upload your favicon to https://realfavicongenerator.net/
2. Download ZIP package
3. Extract to `Build/Assets/Static/Favicons/`
4. Run `npm run build`

**Option 2: CLI (Automated)**
Use the CLI for CI/CD pipelines. Files are generated in `Build/Assets/Static/Favicons/` and copied to `Resources/Public/Favicons/` by Vite.

---

## 1. Install the CLI (one-time)

```bash
npm install --global cli-real-favicon
# Or use npx (no global install required)
```

---

## 2. Create the description file

Create `favicon-settings.json` in `Build/` (same level as `vite.config.js`) and adjust the placeholders:

```json
{
  "icon": {
    "desktop": {
      "regularIconTransformation": {
        "type": "none"
      },
      "darkIconType": "none"
    },
    "touch": {
      "transformation": {
        "type": "none"
      },
      "appTitle": "<<< mpeltzer >>>"
    },
    "webAppManifest": {
      "transformation": {
        "type": "none"
      },
      "backgroundColor": "<<< #333333 >>>",
      "name": "<<< mpeltzer.de >>>",
      "shortName": "<<< mpeltzer >>>",
      "themeColor": "<<< #333333 >>>"
    }
  },
  "path": "<<< /_assets/bf2f413e99e0cd34ae86e6c011aa5121/Favicons/ >>>"
}
```

**Notes:**
- Use 512x512 SVG or PNG for `masterPicture`
- `iconsPath` must point to final public directory
- Adjust theme colors to match your brand

---

## 3. Generate the icon set

From the `Build/` folder run:

```bash
npx realfavicon generate ./Assets/Images/favicon.png favicon-settings.json favicon-output.json ./Assets/Static/Favicons
npx realfavicon inject favicon-output.json Assets/Static/Favicons/ ./Assets/Static/Favicons/output.html
```

This generates:
- `favicon-output.json` - metadata (commit to version control)
- `output.html` - HTML tags for `<head>`
- All favicon files in `Assets/Static/Favicons/`

Then run `npm run build` or `npm run watch` to copy files to `Resources/Public/Favicons/`.

---

## 4. Inject the HTML snippet

Copy contents of `Assets/Static/Favicons/html_code.html` to:
```text
Resources/Private/Partials/Page/Favicons.html
```

---

## 5. Validate

- Check updates: `real-favicon check-for-update --fail-on-update faviconData.json`
- Validate output: https://realfavicongenerator.net/favicon_checker
