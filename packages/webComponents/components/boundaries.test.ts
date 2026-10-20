import { afterEach, describe, expect, it, vi } from 'vitest';
import './form/input-number';
import './pagination';
import './navigation/menu';
import './feedback/progress';
import './data/avatar';

afterEach(() => document.body.replaceChildren());

describe('component boundary regressions', () => {
  it.each([
    [0.2, 0.1, 0.3],
    [0.0000002, 0.0000001, 0.0000003],
    [-0.2, 0.1, -0.1],
  ])('steps %s by %s without a floating point tail', async (value, step, expected) => {
    const input = document.createElement('su-input-number');
    Object.assign(input, { value, step });
    document.body.append(input);
    await input.updateComplete;
    const change = vi.fn();
    input.addEventListener('change', change);
    input.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="增加"]')!.click();
    await input.updateComplete;
    expect(input.value).toBe(expected);
    expect(change).toHaveBeenCalledOnce();
    expect(change.mock.calls[0][0].detail.value).toBe(expected);
    input.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="减少"]')!.click();
    await input.updateComplete;
    expect(input.value).toBe(value);
  });

  it('normalizes external number bounds without emitting a change', async () => {
    const input = document.createElement('su-input-number');
    Object.assign(input, { min: 0, max: 10, value: 8 });
    const change = vi.fn();
    input.addEventListener('change', change);
    document.body.append(input);
    await input.updateComplete;
    input.max = 5;
    await input.updateComplete;
    expect(input.value).toBe(5);
    input.value = NaN;
    await input.updateComplete;
    expect(input.value).toBe(0);
    input.min = 7;
    await input.updateComplete;
    expect(input.max).toBe(7);
    expect(input.value).toBe(7);
    expect(change).not.toHaveBeenCalled();
  });

  it('keeps pagination finite, integral and in range when data changes', async () => {
    const pager = document.createElement('se-pagination');
    Object.assign(pager, { total: 100, pageSize: 0, currentPage: 99 });
    const change = vi.fn();
    pager.addEventListener('page-change', change);
    document.body.append(pager);
    await pager.updateComplete;
    expect(pager.pageSize).toBe(10);
    expect(pager.currentPage).toBe(10);
    pager.total = 15;
    await pager.updateComplete;
    expect(pager.currentPage).toBe(2);
    expect(change).not.toHaveBeenCalled();
    const field = pager.shadowRoot!.querySelector('input')!;
    field.value = '1.7';
    field.dispatchEvent(new Event('input'));
    await pager.updateComplete;
    expect(pager.currentPage).toBe(1);
    expect(field.value).toBe('1');
    expect(change).toHaveBeenCalledOnce();
    field.value = '-5';
    field.dispatchEvent(new Event('input'));
    expect(field.value).toBe('1');
    expect(change).toHaveBeenCalledOnce();
    pager.total = NaN;
    await pager.updateComplete;
    expect(pager.total).toBe(0);
    expect(pager.shadowRoot!.textContent).not.toContain('NaN');
  });

  it('preserves collapsed menu names and consistent fallback selection', async () => {
    const menu = document.createElement('su-menu');
    menu.items = [{ key: 'home', label: '首页', icon: 'H' }];
    menu.collapsed = true;
    document.body.append(menu);
    await menu.updateComplete;
    const item = menu.shadowRoot!.querySelector('button')!;
    expect(item.getAttribute('aria-label')).toBe('首页');
    expect(item.title).toBe('首页');
    expect(item.getAttribute('aria-current')).toBe('page');
    expect(item.classList.contains('active')).toBe(true);
    menu.activeKey = 'missing';
    await menu.updateComplete;
    expect(item.classList.contains('active')).toBe(true);
  });

  it.each([NaN, Infinity, -Infinity])('renders invalid progress %s as zero', async (percent) => {
    const progress = document.createElement('su-progress');
    progress.percent = percent;
    document.body.append(progress);
    await progress.updateComplete;
    expect(
      progress.shadowRoot!.querySelector('[role="progressbar"]')!.getAttribute('aria-valuenow')
    ).toBe('0');
    expect(progress.shadowRoot!.querySelector('.text')!.textContent).toBe('0%');
  });

  it('preserves avatar graphemes and retries an updated image after failure', async () => {
    const avatar = document.createElement('su-avatar');
    avatar.name = '👩‍💻 开发者';
    avatar.src = '/missing.png';
    document.body.append(avatar);
    await avatar.updateComplete;
    avatar.shadowRoot!.querySelector('img')!.dispatchEvent(new Event('error'));
    await avatar.updateComplete;
    expect(avatar.shadowRoot!.querySelector('span')!.textContent!.trim()).toBe('👩‍💻');
    avatar.src = '/replacement.png';
    await avatar.updateComplete;
    expect(avatar.shadowRoot!.querySelector('img')!.getAttribute('src')).toBe('/replacement.png');
    avatar.src = '';
    avatar.name = 'e\u0301lodie';
    await avatar.updateComplete;
    expect(avatar.shadowRoot!.querySelector('span')!.textContent!.trim()).toBe('E\u0301');
  });
});
