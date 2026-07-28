const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let activeLocks = 0;
let previousOverflow = '';
const overlayStack: HTMLElement[] = [];

function isFocusable(element: HTMLElement) {
  return !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true';
}

function collectFocusable(root: ParentNode): HTMLElement[] {
  const elements = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

  root.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
    slot.assignedElements({ flatten: true }).forEach((element) => {
      if (element instanceof HTMLElement && element.matches(FOCUSABLE_SELECTOR)) {
        elements.push(element);
      }
      elements.push(...Array.from(element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)));
    });
  });

  return [...new Set(elements)].filter(isFocusable);
}

export function lockBodyScroll() {
  if (activeLocks === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  activeLocks += 1;
}

export function unlockBodyScroll() {
  activeLocks = Math.max(0, activeLocks - 1);
  if (activeLocks === 0) {
    document.body.style.overflow = previousOverflow;
  }
}

export function registerOverlay(element: HTMLElement) {
  const existingIndex = overlayStack.indexOf(element);
  if (existingIndex >= 0) overlayStack.splice(existingIndex, 1);
  overlayStack.push(element);
}

export function unregisterOverlay(element: HTMLElement) {
  const index = overlayStack.indexOf(element);
  if (index >= 0) overlayStack.splice(index, 1);
}

export function isTopOverlay(element: HTMLElement) {
  return overlayStack.at(-1) === element;
}

export function getDeepActiveElement(): HTMLElement | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active instanceof HTMLElement ? active : null;
}

export function focusFirstElement(container: HTMLElement) {
  const autofocus = container.querySelector<HTMLElement>('[autofocus]');
  const target = autofocus ?? collectFocusable(container)[0] ?? container;
  target.focus();
}

export function trapFocus(event: KeyboardEvent, container: HTMLElement) {
  if (event.key !== 'Tab') return;

  const focusable = collectFocusable(container);
  if (focusable.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }

  const active = getDeepActiveElement();
  const activeIndex = active ? focusable.indexOf(active) : -1;
  let nextIndex = activeIndex + (event.shiftKey ? -1 : 1);

  if (activeIndex === -1) {
    nextIndex = event.shiftKey ? focusable.length - 1 : 0;
  } else if (nextIndex < 0) {
    nextIndex = focusable.length - 1;
  } else if (nextIndex >= focusable.length) {
    nextIndex = 0;
  } else {
    return;
  }

  event.preventDefault();
  focusable[nextIndex].focus();
}
