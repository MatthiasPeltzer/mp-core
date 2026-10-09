export function asHTMLElement(element: Element | null | undefined): HTMLElement | null {
  return element instanceof HTMLElement ? element : null
}

export function eventTargetElement(event: Event): Element | null {
  const target = event.target
  return target instanceof Element ? target : null
}

export function collapseEventTarget(event: Event): Element | null {
  return eventTargetElement(event)
}
