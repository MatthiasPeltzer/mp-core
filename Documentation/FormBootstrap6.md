# Bootstrap 6 form widgets (ext:form)

Optional **Bootstrap 6 Datepicker** and **Combobox** for the standard form prototype (`BaseSetup.yaml`). Both are **opt-in per field** in the Form Editor. Header search autosuggest remains the custom [`searchAutosuggest.ts`](../Build/Assets/Scripts/code/searchAutosuggest.ts) listbox, not Bootstrap Combobox.

## Date from–to (two native date fields)

Form Editor element **Date from–to** (`DateFromTo`): one field group with **two** `type="date"` inputs (`{identifier}.start`, `{identifier}.end`). Intended for **accessibility** (separate labels, no readonly trap). Works **without JavaScript** (server validation); `formDateFromTo.ts` ties `min`/`max` so the end cannot be before the start.

| Property | Default | Purpose |
|----------|---------|---------|
| `startLabel` / `endLabel` | From / To (XLF) | Sub-labels; empty uses `locallang_form_bs6.xlf` |
| `bootstrapDateMin` / `bootstrapDateMax` | empty | ISO bounds applied to both inputs |

Markup: [`DateFromTo.fluid.html`](../Resources/Extensions/form/Frontend/Partials/DateFromTo.fluid.html). Validator: `IsoDateFromTo`. Example: [`ExampleContactWithDateFromTo.form.yaml`](../Resources/Extensions/form/Forms/ExampleContactWithDateFromTo.form.yaml).

For a single calendar range field, use **Date range** (`DateRange`) below instead.

## Date range (BS6 ranged datepicker)

| Property | Default | Purpose |
|----------|---------|---------|
| `bootstrapDateMin` | empty | ISO lower bound (`data-bs-date-min`) |
| `bootstrapDateMax` | empty | ISO upper bound (`data-bs-date-max`) |
| `bootstrapDisplayMonthsCount` | `2` | `1` or `2` months in the popup; **two** is recommended for ranges (start + end click). With **one** month the popup stays open after the first date—use the month controls if the end is in another month. |

New Form Editor element **Date range** (`DateRange`): one readonly text field with `multiple-ranged` Bootstrap Datepicker. Submits **one** property as `YYYY-MM-DD,YYYY-MM-DD` (comma-separated ISO). Mails show `d.m.Y – d.m.Y` via `displayFormat`.

Markup: [`DateRange.fluid.html`](../Resources/Extensions/form/Frontend/Partials/DateRange.fluid.html) (readonly field + **×** clear control restores the placeholder). Empty `fluidAdditionalAttributes.placeholder` uses [`locallang_form_bs6.xlf`](../Resources/Private/Language/locallang_form_bs6.xlf) (`DD/MM/YYYY – DD/MM/YYYY` / `TT.MM.JJJJ – TT.MM.JJJJ`). Validator: `IsoDateRangeString`.

Example form (import via Form module, storage path `EXT:mp_core/Resources/Extensions/form/Forms/`): [`ExampleContactWithDateRange.form.yaml`](../Resources/Extensions/form/Forms/ExampleContactWithDateRange.form.yaml). On the dev site, `kontakt_1` includes a **Reisezeitraum** field for manual testing.

## Date (native + BS6 Datepicker)

| Property | Default | Purpose |
|----------|---------|---------|
| `enableBootstrapDatepicker` | `false` | Use BS6 popup calendar on an ISO text field (`YYYY-MM-DD`) |
| `bootstrapDateMin` | empty | ISO min date (`data-bs-date-min`) |
| `bootstrapDateMax` | empty | ISO max date (`data-bs-date-max`) |

When disabled, the frontend renders `type="date"` (TYPO3 14 recommendation).

When enabled, markup lives in [`Date.fluid.html`](../Resources/Extensions/form/Frontend/Partials/Date.fluid.html); [`formBootstrapEnhancements.ts`](../Build/Assets/Scripts/code/formBootstrapEnhancements.ts) sets `data-bs-locale` from `document.documentElement.lang` and initializes Datepicker.

**Dependency:** `vanilla-calendar-pro` (Bootstrap 6 peer) is required in `Build/package.json`.

## MultiSelect (BS6 Combobox)

| Property | Default | Purpose |
|----------|---------|---------|
| `useBootstrapCombobox` | `false` | Searchable chip-style multi select |

When enabled, a visible BS6 Combobox updates a **visually hidden** `<select multiple>` so ext:form and finishers keep working. See [`MultiSelect.fluid.html`](../Resources/Extensions/form/Frontend/Partials/MultiSelect.fluid.html).

## Build

From `Build/`: `npm run build` ships Datepicker and Combobox in `vendor-bootstrap-*.js` and loads enhancements from `screen.js` on every page with forms.

## Accessibility

- **Prefer `DateFromTo`** (two native `type="date"` fields) for contact/booking forms where screen reader users matter most. Native pickers expose OS-level date UX; no calendar grid in the page.
- **Bootstrap datepicker** (`Date` + BS flag, `DateRange`): Vanilla Calendar Pro renders a **`role="grid"`** day matrix. Many screen readers read that as a verbose table and jump per cell. Bootstrap 6 adds `role="dialog"` and keyboard arrows; it is still weaker than native dates.
- **`formDatepickerA11y.ts`** (shipped in `screen.js`): `aria-modal`, links the dialog to the field label, hides decorative weekday headers from AT, sets **`aria-label`** on each day (full date, not only the day number), and **`aria-live`** announcements on open/selection/range steps. Hard limits remain upstream (grid exploration, no full APG date-picker parity).
- Combobox: filter input is labelled via the field label; menu uses `role="listbox"`. Test keyboard flow and screen reader behaviour on a real form before release.
- Validate with NVDA/JAWS/VoiceOver on [the form demo](https://mpcore.ddev.docker/mp-core/formularelemente/formular) after asset/cache updates.

## Editors

Inspector labels: [`locallang_form_bs6.xlf`](../Resources/Private/Language/locallang_form_bs6.xlf) (register in Form prototype `translationFiles`).