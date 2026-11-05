import { afterEach, expect, it, vi } from 'vitest';
import './index';

afterEach(() => document.body.replaceChildren());

it('exposes advanced controls only when slotted and keeps their input on collapse', async () => {
  const panel = document.createElement('su-filter-panel');
  const changed = vi.fn();
  panel.addEventListener('expand-change', changed);
  document.body.append(panel);
  await panel.updateComplete;
  expect(panel.shadowRoot!.querySelector('[aria-expanded]')).toBeNull();

  const field = document.createElement('input');
  field.slot = 'advanced';
  field.value = '已完成';
  panel.append(field);
  await vi.waitFor(() => expect(panel.shadowRoot!.querySelector('[aria-expanded]')).not.toBeNull());
  const toggle = panel.shadowRoot!.querySelector<HTMLButtonElement>('[aria-expanded]')!;
  toggle.click();
  await panel.updateComplete;
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  expect(changed.mock.calls[0][0].detail).toEqual({ expanded: true });
  toggle.click();
  await panel.updateComplete;
  expect(field.value).toBe('已完成');
  expect(panel.shadowRoot!.querySelector('#advanced')?.hasAttribute('hidden')).toBe(true);
});

it('guards pending actions before the disabled buttons rerender', async () => {
  const panel = document.createElement('su-filter-panel');
  const apply = vi.fn();
  const reset = vi.fn();
  panel.addEventListener('apply', apply);
  panel.addEventListener('reset-filters', reset);
  document.body.append(panel);
  await panel.updateComplete;
  const [query, clear] = panel.shadowRoot!.querySelectorAll('button');
  query.click();
  clear.click();
  panel.pending = true;
  query.click();
  clear.click();
  expect(apply).toHaveBeenCalledOnce();
  expect(reset).toHaveBeenCalledOnce();
});
