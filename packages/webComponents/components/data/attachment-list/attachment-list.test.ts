import { afterEach, expect, it, vi } from 'vitest';
import './index';

afterEach(() => document.body.replaceChildren());

it('emits attachment requests without changing host items', async () => {
  const list = document.createElement('su-attachment-list');
  const item = { id: 'manual', name: '值班手册.pdf' };
  list.items = [item];
  list.removable = true;
  const open = vi.fn();
  const remove = vi.fn();
  list.addEventListener('attachment-open', open);
  list.addEventListener('attachment-remove', remove);
  document.body.append(list);
  await list.updateComplete;
  const [openButton, removeButton] = list.shadowRoot!.querySelectorAll('button');
  openButton.click();
  removeButton.click();
  expect(open.mock.calls[0][0].detail.item).toBe(item);
  expect(remove.mock.calls[0][0].detail.item).toBe(item);
  expect(list.items).toEqual([item]);

  list.disabled = true;
  await list.updateComplete;
  openButton.click();
  removeButton.click();
  expect(open).toHaveBeenCalledOnce();
  expect(remove).toHaveBeenCalledOnce();
});
