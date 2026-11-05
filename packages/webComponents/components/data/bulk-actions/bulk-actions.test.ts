import { afterEach, expect, it, vi } from 'vitest';
import './index';

afterEach(() => document.body.replaceChildren());

it('passes a deduplicated selection snapshot to the host and blocks pending actions', async () => {
  const bar = document.createElement('su-bulk-actions');
  bar.actions = [{ key: 'archive', label: '归档' }];
  const action = vi.fn();
  const clear = vi.fn();
  bar.addEventListener('action-request', action);
  bar.addEventListener('clear-selection', clear);
  document.body.append(bar);
  await bar.updateComplete;

  const [archive, reset] = bar.shadowRoot!.querySelectorAll('button');
  expect(archive.disabled).toBe(true);
  bar.selectedKeys = ['a', 'a', 'b'];
  await bar.updateComplete;
  archive.click();
  reset.click();
  expect(action.mock.calls[0][0].detail).toEqual({ action: 'archive', keys: ['a', 'b'] });
  expect(clear.mock.calls[0][0].detail.keys).toEqual(['a', 'b']);
  expect(bar.selectedKeys).toEqual(['a', 'a', 'b']);

  bar.pending = true;
  await bar.updateComplete;
  archive.click();
  reset.click();
  expect(action).toHaveBeenCalledOnce();
  expect(clear).toHaveBeenCalledOnce();
});
