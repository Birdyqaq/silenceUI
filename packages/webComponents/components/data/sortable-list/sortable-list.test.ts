import { afterEach, expect, it, vi } from 'vitest';
import './index';

afterEach(() => document.body.replaceChildren());

it('emits the new order and leaves the source array intact', async () => {
  const list = document.createElement('su-sortable-list');
  const source = [
    { key: 'a', label: '甲' },
    { key: 'b', label: '乙' },
  ];
  list.items = source;
  const change = vi.fn();
  list.addEventListener('change', change);
  document.body.append(list);
  await list.updateComplete;
  list.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="下移 甲"]')!.click();
  await list.updateComplete;
  expect(source.map((item) => item.key)).toEqual(['a', 'b']);
  expect(list.items.map((item) => item.key)).toEqual(['b', 'a']);
  expect(change.mock.calls[0][0].detail).toEqual({
    key: 'a',
    fromIndex: 0,
    toIndex: 1,
    items: [source[1], source[0]],
  });
});

it('disables sorting when item keys are ambiguous', async () => {
  const list = document.createElement('su-sortable-list');
  list.items = [
    { key: 'duplicate', label: '甲' },
    { key: 'duplicate', label: '乙' },
  ];
  document.body.append(list);
  await list.updateComplete;
  expect([...list.shadowRoot!.querySelectorAll('button')].every((button) => button.disabled)).toBe(
    true
  );
  expect(list.shadowRoot!.querySelector('[draggable="true"]')).toBeNull();
});
