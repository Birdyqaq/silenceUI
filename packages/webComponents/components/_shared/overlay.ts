const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let activeLocks = 0;
let previousOverflow = '';
const overlayStack: HTMLElement[] = [];

function collectFocusable(root: ParentNode, pendingUpdates?: Promise<unknown>[]): HTMLElement[] {
  const elements: HTMLElement[] = [];
  const visited = new Set<Element>();
  // 按实际渲染顺序穿过 slot 和开放 ShadowRoot，不能先遍历弹层再追加插槽内容。
  const visit = (element: Element) => {
    if (visited.has(element)) return;
    visited.add(element);
    if (
      element.hasAttribute('hidden') ||
      element.hasAttribute('inert') ||
      element.getAttribute('aria-hidden') === 'true'
    )
      return;
    const style = getComputedStyle(element);
    if (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.visibility === 'collapse'
    )
      return;

    const updatable = element as Element & {
      isUpdatePending?: boolean;
      updateComplete?: Promise<unknown>;
    };
    if (updatable.isUpdatePending && updatable.updateComplete) {
      pendingUpdates?.push(updatable.updateComplete);
    }

    if (
      element instanceof HTMLElement &&
      element.matches(FOCUSABLE_SELECTOR) &&
      element.tabIndex >= 0 &&
      !element.matches(':disabled') &&
      !element.shadowRoot?.delegatesFocus
    )
      elements.push(element);

    if (element instanceof HTMLSlotElement) {
      const assigned = element.assignedElements({ flatten: true });
      Array.from(assigned.length ? assigned : element.children).forEach(visit);
    } else {
      Array.from((element.shadowRoot ?? element).children).forEach(visit);
    }
  };
  Array.from(root.children).forEach(visit);
  return elements;
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
  const pendingUpdates: Promise<unknown>[] = [];
  const focusable = collectFocusable(container, pendingUpdates);
  const target =
    focusable.find((element) => element.hasAttribute('autofocus')) ?? focusable[0] ?? container;
  target.focus();
  // 多层 Lit 包装器可能逐轮生成子控件；等待尚未完成的更新后再校正首次焦点。
  // 用户已移动焦点、弹层已关闭或失去顶层位置时，不再自动抢回。
  if (pendingUpdates.length) {
    const active = getDeepActiveElement();
    const owner = overlayStack.find((element) => element.shadowRoot === container.getRootNode());
    void Promise.allSettled(pendingUpdates).then(() => {
      if (
        container.isConnected &&
        getDeepActiveElement() === active &&
        (!owner || isTopOverlay(owner))
      ) {
        focusFirstElement(container);
      }
    });
  }
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
