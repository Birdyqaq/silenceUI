import { afterEach, expect, it, vi } from 'vitest';
import './index';
import type { ImportAdapter, ImportSheet } from './index';
afterEach(() => document.body.replaceChildren());
const sheet = { columns: ['name'], rows: [['张三']] };
async function mount(overrides: Partial<ImportAdapter> = {}) {
  const wizard = document.createElement('su-import-wizard');
  const adapter: ImportAdapter = {
    parse: vi.fn(async () => sheet),
    validate: vi.fn(async () => []),
    submit: vi.fn(async () => ({ message: '已导入' })),
    ...overrides,
  };
  wizard.fields = [{ key: 'name', label: '姓名', required: true }];
  wizard.adapter = adapter;
  document.body.append(wizard);
  await wizard.updateComplete;
  const flush = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await wizard.updateComplete;
  };
  const choose = async () => {
    const input = wizard.shadowRoot!.querySelector('input')!;
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [new File(['name\n张三'], 'users.csv')],
    });
    input.dispatchEvent(new Event('change'));
    await flush();
  };
  const click = async (label: string) => {
    [...wizard.shadowRoot!.querySelectorAll('button')]
      .find((b) => b.textContent?.trim() === label)!
      .click();
    await flush();
  };
  return { wizard, adapter, flush, choose, click };
}
it('maps, validates, retries a failed submission and completes without mutating parsed data', async () => {
  const submit = vi
    .fn()
    .mockRejectedValueOnce(new Error('网络失败'))
    .mockResolvedValueOnce({ message: '成功' });
  const { wizard, choose, click, adapter } = await mount({ submit });
  const complete = vi.fn();
  wizard.addEventListener('import-complete', complete);
  await choose();
  await click('校验数据');
  expect(adapter.validate).toHaveBeenCalledWith(sheet, { name: 'name' }, expect.any(AbortSignal));
  await click('确认导入');
  expect(wizard.shadowRoot!.textContent).toContain('网络失败');
  await click('确认导入');
  expect(complete).toHaveBeenCalledOnce();
  expect(complete.mock.calls[0][0].detail).toEqual({ message: '成功' });
  expect(sheet.rows).toEqual([['张三']]);
});
it('blocks submission on validation errors and requires validation again after mapping changes', async () => {
  const { wizard, adapter, choose, click } = await mount({
    validate: vi.fn(async () => [{ row: 1, message: '无效姓名' }]),
  });
  await choose();
  await click('校验数据');
  await click('确认导入');
  expect(adapter.submit).not.toHaveBeenCalled();
  await click('返回映射');
  expect(wizard.shadowRoot!.querySelector('select')).not.toBeNull();
});
it('aborts pending parse and ignores a late response after reset', async () => {
  let resolve!: (sheet: ImportSheet) => void;
  let signal!: AbortSignal;
  const { wizard, choose, flush } = await mount({
    parse: vi.fn((_file, value) => {
      signal = value;
      return new Promise((done) => {
        resolve = done;
      });
    }),
  });
  await choose();
  wizard.reset();
  resolve(sheet);
  await flush();
  expect(signal.aborted).toBe(true);
  expect(wizard.shadowRoot!.querySelector('select')).toBeNull();
  expect(wizard.shadowRoot!.querySelector('input')).not.toBeNull();
});
