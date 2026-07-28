export function parseJsonArray<T>(value: string, fallback: T[]): T[] {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function findClosestForm(element: HTMLElement): HTMLFormElement | null {
  let current: Element | null = element;

  while (current) {
    const form = current.closest('form');
    if (form) return form;

    const root = current.getRootNode();
    current = root instanceof ShadowRoot ? root.host : null;
  }

  return null;
}
