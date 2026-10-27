import { afterEach, describe, expect, it, vi } from 'vitest';
import './collapse';
import './timeline';

afterEach(() => document.body.replaceChildren());

async function collapse() {
  const element = document.createElement('su-collapse');
  element.items = [
    { key: 'account', label: '账号信息', content: '内容' },
    { key: 'locked', label: '禁用', disabled: true },
    { key: 'log', label: '操作日志' },
  ];
  document.body.append(element);
  await element.updateComplete;
  return element;
}

describe('Collapse', () => {
  it('toggles panels and emits an isolated event value', async () => {
    const element = await collapse();
    const listener = vi.fn((event: Event) =>
      (event as CustomEvent).detail.activeKeys.push('external')
    );
    element.addEventListener('change', listener);
    const button = element.shadowRoot!.querySelector('button')!;
    button.click();
    await element.updateComplete;
    expect(element.activeKeys).toEqual(['account']);
    expect(listener).toHaveBeenCalledOnce();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    const panel = element.shadowRoot!.getElementById(button.getAttribute('aria-controls')!)!;
    expect(panel.hidden).toBe(false);
    expect(panel.getAttribute('aria-labelledby')).toBe(button.id);
    button.click();
    await element.updateComplete;
    expect(panel.hidden).toBe(true);
  });

  it('supports multiple panels, accordion and closing the last panel', async () => {
    const element = await collapse();
    const buttons = element.shadowRoot!.querySelectorAll('button');
    buttons[0].click();
    await element.updateComplete;
    buttons[2].click();
    await element.updateComplete;
    expect(element.activeKeys).toEqual(['account', 'log']);
    element.accordion = true;
    await element.updateComplete;
    expect(element.shadowRoot!.querySelectorAll('.panel:not([hidden])')).toHaveLength(1);
    buttons[2].click();
    await element.updateComplete;
    expect(element.activeKeys).toEqual(['log']);
    buttons[2].click();
    await element.updateComplete;
    expect(element.activeKeys).toEqual([]);
  });

  it('ignores disabled clicks and moves keyboard focus around disabled headings', async () => {
    const element = await collapse();
    const buttons = element.shadowRoot!.querySelectorAll('button');
    const change = vi.fn();
    element.addEventListener('change', change);
    buttons[1].click();
    expect(change).not.toHaveBeenCalled();
    for (const [key, expected] of [
      ['ArrowDown', 2],
      ['End', 2],
      ['ArrowUp', 2],
      ['Home', 0],
    ] as const) {
      buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      expect(element.shadowRoot!.activeElement).toBe(buttons[expected]);
    }
    buttons[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(element.shadowRoot!.activeElement).toBe(buttons[0]);
  });

  it('normalizes malformed/duplicate items and stale keys without mutating callers', async () => {
    const element = await collapse();
    const items = [
      { key: 'a', label: 'A' },
      null,
      { key: 'a', label: 'Duplicate' },
      { key: '', label: 'Empty' },
    ];
    element.items = items as typeof element.items;
    element.activeKeys = ['missing', 'a', 'a'];
    await element.updateComplete;
    expect(element.shadowRoot!.querySelectorAll('button')).toHaveLength(1);
    expect(element.shadowRoot!.querySelectorAll('.panel:not([hidden])')).toHaveLength(1);
    expect(items).toHaveLength(4);
    element.items = null as unknown as typeof element.items;
    element.activeKeys = null as unknown as string[];
    await element.updateComplete;
    expect(element.shadowRoot!.querySelectorAll('button')).toHaveLength(0);
  });

  it('exposes named rich-content slots and renders fallback content as text', async () => {
    const element = await collapse();
    element.items = [{ key: 'account', label: '账号', content: '<script>unsafe</script>' }];
    const link = document.createElement('a');
    link.slot = 'account';
    link.textContent = '详情';
    element.append(link);
    await element.updateComplete;
    const slot = element.shadowRoot!.querySelector('slot')!;
    expect(slot.assignedElements()).toEqual([link]);
    expect(slot.textContent).toContain('<script>unsafe</script>');
    expect(element.shadowRoot!.querySelector('script')).toBeNull();
  });
});

describe('Collapse dynamic state', () => {
  it('ignores stale clicks after removal or disabling before rendering', async () => {
    const element = await collapse();
    const button = element.shadowRoot!.querySelector<HTMLButtonElement>('button')!;
    const change = vi.fn();
    element.addEventListener('change', change);
    element.items = element.items.map((item) => ({ ...item, disabled: true }));
    button.click();
    expect(change).not.toHaveBeenCalled();
    element.items = [];
    button.click();
    expect(change).not.toHaveBeenCalled();
    await element.updateComplete;
  });

  it('keeps heading and panel nodes associated with their key on reorder', async () => {
    const element = await collapse();
    const button = element.shadowRoot!.querySelector<HTMLButtonElement>('button')!;
    const panel = element.shadowRoot!.getElementById(button.getAttribute('aria-controls')!)!;
    element.items = [...element.items].reverse();
    await element.updateComplete;
    const moved = [...element.shadowRoot!.querySelectorAll('button')].find((entry) =>
      entry.textContent!.includes('账号信息')
    )!;
    expect(moved).toBe(button);
    expect(element.shadowRoot!.getElementById(moved.getAttribute('aria-controls')!)!).toBe(panel);
  });
});

describe('Timeline', () => {
  it('renders an accessible ordered log with optional details and statuses', async () => {
    const element = document.createElement('su-timeline');
    element.label = '审批记录';
    element.items = [
      {
        label: '已批准',
        description: '审核人：张三',
        timestamp: '2026-10-27 10:00',
        status: 'success',
      },
      { label: '已创建' },
    ];
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('ol')!.getAttribute('aria-label')).toBe('审批记录');
    expect(element.shadowRoot!.querySelectorAll('li')).toHaveLength(2);
    expect(element.shadowRoot!.querySelector('.dot.success')!.getAttribute('aria-hidden')).toBe(
      'true'
    );
    expect(element.shadowRoot!.querySelectorAll('.timestamp')).toHaveLength(1);
    expect(element.shadowRoot!.querySelector('.description')!.textContent).toBe('审核人：张三');
    element.reverse = true;
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('li')!.textContent).toContain('已创建');
    expect(element.items[0].label).toBe('已批准');
  });

  it('tolerates invalid data and never interprets descriptions as HTML', async () => {
    const element = document.createElement('su-timeline');
    element.items = [
      null,
      { label: '<img>', description: '<script>x</script>', status: 'unknown' },
    ] as unknown as typeof element.items;
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot!.querySelectorAll('li')).toHaveLength(1);
    expect(element.shadowRoot!.querySelector('script, img')).toBeNull();
    element.items = null as unknown as typeof element.items;
    await element.updateComplete;
    expect(element.shadowRoot!.querySelectorAll('li')).toHaveLength(0);
  });
});
