# Bootstrap 6 form widgets (ext:form)

Optional **Bootstrap 6 Datepicker** and **Combobox** for the standard form prototype (`BaseSetup.yaml`). Both are **opt-in per field** in the Form Editor. Header search autosuggest remains the custom [`searchAutosuggest.ts`](../Build/Assets/Scripts/code/searchAutosuggest.ts) listbox, not Bootstrap Combobox.

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

- Datepicker: use field labels from the standard Field partial; invalid state uses `aria` from form validation.
- Combobox: filter input is labelled via the field label; menu uses `role="listbox"`. Test keyboard flow and screen reader behaviour on a real form before release.

## Editors

Inspector labels: [`locallang_form_bs6.xlf`](../Resources/Private/Language/locallang_form_bs6.xlf) (register in Form prototype `translationFiles`).