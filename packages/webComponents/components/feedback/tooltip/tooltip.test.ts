import { afterEach, describe, expect, it, vi } from 'vitest';
import './index';

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

async function mount() {
  const tooltip = document.createElement('su-tooltip');
  tooltip.content = '说明';
  const button = document.createElement('button');
  button.textContent = '帮助';
  button.setAttribute('aria-describedby', 'existing');
  tooltip.append(button);
  document.body.append(tooltip);
  await tooltip.updateComplete;
  return { tooltip, button, bubble: tooltip.shadowRoot!.querySelector<HTMLElement>('.bubble')! };
}

describe('tooltip interactions', () => {
  it('adds same-tree descriptions, updates text and preserves existing IDs on detach', async () => {
    const { tooltip, button } = await mount();
    const ids = button.getAttribute('aria-describedby')!.split(' ');
    expect(ids).toContain('existing');
    expect(document.getElementById(ids[1])!.textContent).toBe('说明');
    tooltip.content = '更新后的说明';
    await tooltip.updateComplete;
    const nextId = button.getAttribute('aria-describedby')!.split(' ')[1];
    expect(document.getElementById(nextId)!.textContent).toBe('更新后的说明');
    tooltip.remove();
    expect(button.getAttribute('aria-describedby')).toBe('existing');
    expect(document.getElementById(nextId)).toBeNull();
  });

  it('dismisses with Escape until focus leaves, then reopens on a new focus', async () => {
    const { tooltip, button, bubble } = await mount();
    button.focus();
    await tooltip.updateComplete;
    expect(bubble.getAttribute('aria-hidden')).toBe('false');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await tooltip.updateComplete;
    expect(bubble.getAttribute('aria-hidden')).toBe('true');
    tooltip.content = '新内容';
    await tooltip.updateComplete;
    expect(bubble.getAttribute('aria-hidden')).toBe('true');
    button.blur();
    button.focus();
    await tooltip.updateComplete;
    expect(bubble.getAttribute('aria-hidden')).toBe('false');
    tooltip.content = '';
    await tooltip.updateComplete;
    await tooltip.updateComplete;
    expect(bubble.getAttribute('aria-hidden')).toBe('true');
    expect(button.getAttribute('aria-describedby')).toBe('existing');
  });

  it('allows crossing the hover gap and clears pending timers on detach', async () => {
    vi.useFakeTimers();
    const { tooltip, bubble } = await mount();
    tooltip.dispatchEvent(new Event('pointerenter'));
    await tooltip.updateComplete;
    tooltip.dispatchEvent(new Event('pointerleave'));
    await vi.advanceTimersByTimeAsync(100);
    bubble.dispatchEvent(new Event('pointerenter'));
    await vi.advanceTimersByTimeAsync(200);
    expect(bubble.getAttribute('aria-hidden')).toBe('false');
    bubble.dispatchEvent(new Event('pointerleave'));
    await vi.advanceTimersByTimeAsync(150);
    expect(bubble.getAttribute('aria-hidden')).toBe('true');
    tooltip.dispatchEvent(new Event('pointerleave'));
    tooltip.remove();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('flips a top-edge tooltip and clamps horizontal position', async () => {
    const { tooltip, button, bubble } = await mount();
    vi.spyOn(tooltip, 'getBoundingClientRect').mockReturnValue({
      top: 2,
      bottom: 22,
      left: 0,
      right: 20,
      width: 20,
      height: 20,
    } as DOMRect);
    vi.spyOn(bubble, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 40,
    } as DOMRect);
    button.focus();
    await tooltip.updateComplete;
    expect(bubble.dataset.placement).toBe('bottom');
    expect(bubble.style.left).toBe('8px');
    expect(bubble.style.top).toBe('30px');
    tooltip.placement = 'left';
    await tooltip.updateComplete;
    expect(bubble.dataset.placement).toBe('right');
  });

  it('associates a focused shadow button with a description in its own root', async () => {
    const { tooltip, button } = await mount();
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });
    const inner = document.createElement('button');
    root.append(inner);
    button.replaceWith(host);
    await Promise.resolve();
    inner.focus();
    await tooltip.updateComplete;
    const id = inner.getAttribute('aria-describedby')!;
    expect(root.getElementById(id)!.textContent).toBe('说明');
    expect(document.getElementById(id)).toBeNull();
    tooltip.remove();
    expect(inner.hasAttribute('aria-describedby')).toBe(false);
  });
});
