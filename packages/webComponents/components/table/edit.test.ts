import { afterEach, expect, it, vi } from 'vitest';
import './index';
import type {} from '../../types';
import type { TableCellEditor, TableCellEditRequest } from './index';

afterEach(() => document.body.replaceChildren());
async function mount(editor: TableCellEditor = { type: 'text' }) {
  const table = document.createElement('se-table');
  table.columns = [{ key: 'name', label: '姓名', editable: editor }];
  table.data = [{ id: 1, name: '原值' }];
  document.body.append(table);
  await table.updateComplete;
  const requests: TableCellEditRequest[] = [];
  table.addEventListener('cell-edit-request', (e) =>
    requests.push((e as CustomEvent<TableCellEditRequest>).detail)
  );
  const root = table.shadowRoot!;
  const open = async () => {
    root.querySelector<HTMLButtonElement>('.edit-cell')!.click();
    await table.updateComplete;
    return root.querySelector<HTMLInputElement>('.cell-editor input')!;
  };
  const edit = async (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await table.updateComplete;
  };
  const key = async (input: HTMLInputElement, key: string) => {
    input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    await table.updateComplete;
  };
  return { table, root, requests, open, edit, key };
}
it('keeps the row immutable, rejects duplicate saves and retries with a new request', async () => {
  const { table, requests, open, edit, key, root } = await mount();
  const input = await open();
  await edit(input, '新值');
  await key(input, 'Enter');
  await key(input, 'Enter');
  expect(requests).toHaveLength(1);
  expect(requests[0].value).toBe('新值');
  expect(table.data[0].name).toBe('原值');
  requests[0].reject('请重试');
  await table.updateComplete;
  expect(root.querySelector('[role=alert]')?.textContent).toBe('请重试');
  await key(input, 'Enter');
  expect(requests).toHaveLength(2);
  requests[0].resolve();
  await table.updateComplete;
  expect(root.querySelector('.cell-editor')).not.toBeNull();
  requests[1].resolve();
  await table.updateComplete;
  expect(root.querySelector('.cell-editor')).toBeNull();
});
it('rejects blank numeric input and validation errors without a request', async () => {
  const validate = vi.fn(async () => '超出范围');
  const { open, edit, key, root, requests } = await mount({ type: 'number', validate });
  const input = await open();
  await edit(input, '');
  await key(input, 'Enter');
  expect(validate).not.toHaveBeenCalled();
  await edit(input, '12.5');
  await key(input, 'Enter');
  await vi.waitFor(() => expect(root.querySelector('[role=alert]')?.textContent).toBe('超出范围'));
  expect(validate).toHaveBeenCalledWith(12.5);
  expect(requests).toHaveLength(0);
});
it('cancels on Escape and ignores a late response after replacing a row', async () => {
  const { table, root, open, edit, key, requests } = await mount();
  let input = await open();
  await edit(input, 'a');
  await key(input, 'Enter');
  await key(input, 'Escape');
  expect(root.querySelector('.cell-editor')).toBeNull();
  input = await open();
  await edit(input, 'b');
  await key(input, 'Enter');
  table.data = [{ id: 1, name: '服务器数据' }];
  await table.updateComplete;
  requests.forEach((r) => r.reject('过期'));
  await table.updateComplete;
  expect(root.querySelector('.cell-editor')).toBeNull();
  expect(table.data[0].name).toBe('服务器数据');
});
it('disallows duplicate keys, disabled editors and closes when column is hidden', async () => {
  const { table, root, open } = await mount();
  await open();
  table.columnState = [{ key: 'name', hidden: true }];
  await table.updateComplete;
  await table.updateComplete;
  expect(root.querySelector('.cell-editor')).toBeNull();
  table.columnState = [];
  table.data = [
    { id: 1, name: 'a' },
    { id: 1, name: 'b' },
  ];
  await table.updateComplete;
  expect(root.querySelector('.edit-cell')).toBeNull();
  table.data = [{ id: 1, name: 'a' }];
  table.columns = [{ key: 'name', label: '姓名', editable: { type: 'text', disabled: true } }];
  await table.updateComplete;
  expect(root.querySelector('.edit-cell')).toBeNull();
});
