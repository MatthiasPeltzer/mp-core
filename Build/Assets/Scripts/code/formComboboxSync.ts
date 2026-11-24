/**
 * Keeps a native multi-select in sync with Bootstrap 6 Combobox selections.
 * TYPO3 ext:form reads the backing &lt;select multiple&gt; on submit.
 */

export function readSelectedValues(select: HTMLSelectElement): string[] {
  return Array.from(select.selectedOptions).map((option) => option.value)
}

export function syncSelectMultipleFromValues(
  select: HTMLSelectElement,
  values: string[],
): void {
  const wanted = new Set(values)
  for (const option of select.options) {
    option.selected = wanted.has(option.value)
  }
}

export function markMenuItemsForBackingSelect(
  root: HTMLElement,
  backing: HTMLSelectElement,
): void {
  const selected = new Set(readSelectedValues(backing))
  for (const item of root.querySelectorAll<HTMLElement>('.menu-item[data-bs-value]')) {
    const value = item.getAttribute('data-bs-value') ?? ''
    item.classList.toggle('selected', selected.has(value))
  }
}