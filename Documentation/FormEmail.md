# Form email branding

Branded HTML and plain-text mails for **EXT:form** finishers `EmailToReceiver` and `EmailToSender`: site colours, optional logo, legal footer, and deliverable sender addresses. Shipped in **mpc/mp-core ≥ 1.3.4** (use **≥ 1.3.5** for TYPO3 13.4 finisher DI fixes).

**Requirements:** TYPO3 **13.4 or 14.3**, `typo3/cms-form`, Site Set **`mpc/mp-core-form`**, Symfony Mailer in `config/system/settings.php`.

---

## Overview

| Topic | Behaviour |
|--------|-----------|
| Staff mail | Template **`ContactReceiver`**, layout **`MpcoreFormEmail`** |
| Visitor confirmation | Template **`ContactSender`** (add finisher to contact forms) |
| Finisher order | **`EmailToReceiver` → `EmailToSender` → `Redirect`** (recommended) |
| From address | Site **`form.email.senderEmail`** / **`form.email.senderName`** — not the visitor (SPF/DMARC) |
| Reply-To (staff mail) | Visitor field in form YAML, e.g. `replyToRecipients: '{email-1}': '{text-1} {name}'` |
| Branding injection | **`BrandedEmailFinisher`** (extends core `EmailFinisher`) merges `variables.emailBrand` before send |
| Logo | Dedicated setting **`form.email.logo`** (`t3://file?uid=…`); **no** fallback to header logos |

Site setting keys and defaults: [Configuration.md](Configuration.md) (section **Form (`mpc/mp-core-form`)**).

---

## Runtime flow

1. Form prototype **`BaseSetup.yaml`** sets `implementationClassName: Mpc\MpCore\Domain\Finishers\BrandedEmailFinisher` on `EmailToReceiver` and `EmailToSender`.
2. **`BrandedEmailFinisher`** resolves the current site from the form request.
3. **`FormEmailBrandingBuilder`** builds the `emailBrand` array (logo URL, homepage, colours, footer HTML/plain).
4. Core **`EmailFinisher`** sends **FluidEmail** using your form’s `templateName` and the bundled layout/templates.

### PHP classes

| Class | Role |
|--------|------|
| `Mpc\MpCore\Domain\Finishers\BrandedEmailFinisher` | Injects `emailBrand` into finisher options |
| `Mpc\MpCore\Service\FormEmailBrandingBuilder` | Builds branding from site settings |
| `Mpc\MpCore\Service\SiteLogoResolver` | Resolves `t3://file?uid=…` to a public URL |

Finisher DI is registered in `Configuration/Services.php` when EXT:form is loaded.

---

## Site settings (`form.email.*`)

Configure in **Site Management → MPCoreForm** or `config/sites/<site>/settings.yaml`:

```yaml
form.email.senderEmail: noreply@example.com
form.email.senderName: 'Website Contact example.com'
form.email.replyToEmail: mail@example.com
form.email.logo: 't3://file?uid=1234'
form.email.logoAlt: 'Company logo'
form.email.headerColor: ''   # empty = site color-primary
form.email.footerColor: ''   # empty = site color-secondary
form.email.footerText: ''    # empty = copyright + Imprint/Privacy from site / mpcConsent.*
```

Upload the mail logo to fileadmin and reference its FAL uid. Empty **`form.email.logo`** means no logo in the mail header.

Legal footer fallback uses `copyrightText`, and **`mpcConsent.imprintPage`** / **`mpcConsent.privacyPolicyPage`** when `form.email.footerText` is empty. Custom footer HTML is **sanitized** in the layout; plain text uses `footerTextPlain`.

---

## Form definitions (per form)

In the Form module or exported YAML (e.g. `fileadmin/form_definitions/`):

### `EmailToReceiver`

- `templateName: ContactReceiver`
- `senderAddress` / `senderName`: site addresses (match `form.email.*` or literals)
- `replyToRecipients`: visitor mapping (adjust field identifiers)
- `recipients`: staff inbox
- `addHtmlPart: true` (recommended)
- `message`: HTML intro; use `{formValues}` where needed

### `EmailToSender`

- `templateName: ContactSender`
- `recipients`: visitor mapping
- `senderAddress` / `senderName`: site (not visitor)
- `addHtmlPart: true`
- Localized subject and title

Example persistence ids on mpcore: `kontakt_1` (DE), `contact_1` (EN).

---

## Extension assets (do not copy to fileadmin)

| Path | Purpose |
|------|---------|
| `Resources/Extensions/form/Yaml/BaseSetup.yaml` | Prototype + `BrandedEmailFinisher` |
| `Resources/Extensions/form/Frontend/Layouts/MpcoreFormEmail.fluid.*` | HTML/plain shell |
| `Resources/Extensions/form/Frontend/Templates/Finishers/Email/ContactReceiver.fluid.*` | Staff body |
| `Resources/Extensions/form/Frontend/Templates/Finishers/Email/ContactSender.fluid.*` | Visitor confirmation |
| `Resources/Extensions/form/Frontend/Partials/Finishers/Email/ContactFormValues.fluid.*` | Value table (skips honeypot/spam noise) |
| `Configuration/Sets/mp-core-form/` | Site set defaults and editor fields |

Custom templates: set `templateName` on the finisher, add Fluid under the prototype `templateRootPaths`, use layout **`MpcoreFormEmail`**.

### `emailBrand` Fluid variables

| Variable | Source |
|----------|--------|
| `emailBrand.logoUrl` | `form.email.logo` |
| `emailBrand.logoAlt` | `form.email.logoAlt` |
| `emailBrand.homeUrl` | Language homepage |
| `emailBrand.headerBackgroundColor` | `form.email.headerColor` or `color-primary` |
| `emailBrand.footerBackgroundColor` | `form.email.footerColor` or `color-secondary` |
| `emailBrand.linkColor` | `color-tertiary` (fallback `#1f5aad`) |
| `emailBrand.footerText` | Custom or auto HTML footer |
| `emailBrand.footerTextPlain` | Plain footer for `.fluid.txt` |

---

## Verification

1. Submit contact forms on the public site (staff + visitor mails).
2. Staff mail: branding, value table, **Reply-To** = visitor.
3. Visitor mail: confirmation, **From** = site noreply.
4. Check HTML and plain parts in the mail client.
5. Optional: `composer test:unit` — `FormEmailBrandingBuilderTest`.

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| 500 on summary/submit | Upgrade mp-core ≥ 1.3.5, `typo3 cache:flush` |
| No logo | Empty or invalid `form.email.logo` |
| Core orange / `Default` template | Wrong `templateName` or stale cache |
| Reply goes to wrong address | Missing `replyToRecipients` on staff finisher |
| Raw `&#10;` in plain mail | Use current `ContactFormValues.fluid.txt` from the extension |

---

## Related (frontend, not mail transport)

Multi-step form summary UI and fieldset headings (page + mail) changed in 1.3.4+. See [CHANGELOG](../CHANGELOG.md) `[1.3.4]` / `[1.3.5]` and [Backend.md](Backend.md) (Form YAML / Fieldset inspector).