type Side = 'top' | 'bottom' | 'left' | 'right';

const opposite: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

export function positionFloating(
  anchor: HTMLElement,
  popup: HTMLElement,
  preferred: Side,
  alignStart = false
) {
  const view = anchor.ownerDocument.defaultView!;
  const viewport = view.visualViewport;
  const left = viewport?.offsetLeft ?? 0;
  const top = viewport?.offsetTop ?? 0;
  const width =
    viewport?.width ?? (anchor.ownerDocument.documentElement.clientWidth || view.innerWidth);
  const height =
    viewport?.height ?? (anchor.ownerDocument.documentElement.clientHeight || view.innerHeight);
  const right = left + width;
  const bottom = top + height;
  const gap = 8;
  const target = anchor.getBoundingClientRect();

  popup.style.setProperty('--su-floating-max-width', `${Math.max(0, width - gap * 2)}px`);
  popup.style.setProperty('--su-floating-max-height', `${Math.max(0, height - gap * 2)}px`);
  const rect = popup.getBoundingClientRect();
  const spaces = {
    top: target.top - top,
    bottom: bottom - target.bottom,
    left: target.left - left,
    right: right - target.right,
  };
  let side = Object.hasOwn(opposite, preferred) ? preferred : 'top';
  const size = side === 'top' || side === 'bottom' ? rect.height : rect.width;
  if (spaces[side] < size + gap * 2 && spaces[opposite[side]] > spaces[side]) side = opposite[side];

  let x = alignStart ? target.left : target.left + (target.width - rect.width) / 2;
  let y = target.top + (target.height - rect.height) / 2;
  if (side === 'top') y = target.top - rect.height - gap;
  if (side === 'bottom') y = target.bottom + gap;
  if (side === 'left') x = target.left - rect.width - gap;
  if (side === 'right') x = target.right + gap;
  popup.style.left = `${Math.max(left + gap, Math.min(x, right - rect.width - gap))}px`;
  popup.style.top = `${Math.max(top + gap, Math.min(y, bottom - rect.height - gap))}px`;
  popup.dataset.placement = side;
}

export function trackFloating(anchor: HTMLElement, popup: HTMLElement, update: () => void) {
  const view = anchor.ownerDocument.defaultView!;
  const listeners = new AbortController();
  const capture = { signal: listeners.signal, capture: true };
  const options = { signal: listeners.signal };
  view.addEventListener('scroll', update, capture);
  view.addEventListener('resize', update, options);
  view.visualViewport?.addEventListener('resize', update, options);
  view.visualViewport?.addEventListener('scroll', update, options);

  // Scroll events inside shadow trees do not cross the root boundary.
  const roots = new Set<ShadowRoot>();
  let node: Element | null = anchor;
  while (node) {
    const root = node.getRootNode();
    if (root instanceof ShadowRoot) roots.add(root);
    node =
      node.assignedSlot ?? node.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
  }
  for (const root of roots) root.addEventListener('scroll', update, capture);

  const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
  observer?.observe(anchor);
  observer?.observe(popup);
  return () => {
    listeners.abort();
    observer?.disconnect();
  };
}
