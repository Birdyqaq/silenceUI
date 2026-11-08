import { afterEach, expect, it, vi } from 'vitest';
import './index';
import type { ImportAdapter, ImportSheet, ImportWizardState } from './index';
afterEach(() => document.body.replaceChildren());
it('ignores mapping events from a previous import session', async () => {
  const { wizard, choose, click, adapter } = await mount();
  await choose();
  const oldSelect = wizard.shadowRoot!.querySelector('select')!;
  wizard.reset();
  await wizard.updateComplete;
  await choose();
  oldSelect.value = '';
  oldSelect.dispatchEvent(new Event('change'));
  await wizard.updateComplete;
  await click('校验数据');
  expect(adapter.validate).toHaveBeenCalledWith(sheet, { name: 'name' }, expect.any(AbortSignal));
});

it('ignores mapping events after configuration replacement before render', async () => {
  const { wizard, choose } = await mount();
  await choose();
  const select = wizard.shadowRoot!.querySelector('select')!;
  wizard.fields = [{ key: 'other', label: '其他' }];
  select.value = '';
  select.dispatchEvent(new Event('change'));
  await wizard.updateComplete;
  expect(wizard.getState().step).toBe('file');
  expect(wizard.shadowRoot!.querySelector('select')).toBeNull();
});
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

it('shares file rules with host callers and reports state when loaded before the first render', async () => {
  const wizard = document.createElement('su-import-wizard');
  const states: ImportWizardState[] = [];
  wizard.addEventListener('import-state-change', (event) => {
    states.push((event as CustomEvent<ImportWizardState>).detail);
  });
  const parse = vi.fn(async () => sheet);
  wizard.fields = [{ key: 'name', label: '姓名', required: true }];
  wizard.adapter = { parse, validate: async () => [], submit: async () => ({ message: '完成' }) };
  document.body.append(wizard);

  const rejected = wizard.loadFile(new File(['name'], 'users.txt'));
  expect(wizard.getState()).toMatchObject({ step: 'file', error: '文件类型不符合要求' });
  wizard.maxSize = 1;
  const oversized = wizard.loadFile(new File(['name'], 'users.csv'));
  expect(wizard.getState().error).toContain('文件超过大小限制');
  expect(parse).not.toHaveBeenCalled();
  wizard.maxSize = 100;

  const loaded = wizard.loadFile(new File(['name'], 'users.csv'));
  expect(wizard.getState()).toMatchObject({ step: 'file', operation: 'parse' });
  const duplicate = wizard.loadFile(new File(['name'], 'other.csv'));
  expect(await Promise.all([rejected, oversized, duplicate])).toEqual([false, false, false]);
  expect(await loaded).toBe(true);
  await wizard.updateComplete;
  expect(states.at(-1)).toMatchObject({
    step: 'mapping',
    operation: null,
    fileName: 'users.csv',
    rowCount: 1,
    issueCount: 0,
    error: '',
  });
  expect(states.at(-1)).not.toBe(wizard.getState());
  expect(await wizard.loadFile(new File(['name'], 'other.csv'))).toBe(false);
  expect(parse).toHaveBeenCalledOnce();
});

it('settles cancelled host loads and ignores a late failure during a new load', async () => {
  let rejectOld!: (reason: Error) => void;
  let oldSignal!: AbortSignal;
  const parse = vi
    .fn<Parameters<ImportAdapter['parse']>, ReturnType<ImportAdapter['parse']>>()
    .mockImplementationOnce((_file, signal) => {
      oldSignal = signal;
      return new Promise((_resolve, reject) => {
        rejectOld = reject;
      });
    })
    .mockResolvedValueOnce(sheet);
  const { wizard, flush } = await mount({ parse });
  const first = wizard.loadFile(new File(['name'], 'first.csv'));
  expect(wizard.cancel()).toBe(true);
  expect(oldSignal.aborted).toBe(true);
  expect(await first).toBe(false);
  expect(wizard.cancel()).toBe(false);

  const second = wizard.loadFile(new File(['name'], 'second.csv'));
  rejectOld(new Error('旧任务失败'));
  expect(await second).toBe(true);
  await flush();
  expect(wizard.getState()).toMatchObject({ step: 'mapping', fileName: 'second.csv', error: '' });
});

it('keeps mapping on validation cancel and reports the next validation result', async () => {
  let signal!: AbortSignal;
  const validate = vi
    .fn<Parameters<ImportAdapter['validate']>, ReturnType<ImportAdapter['validate']>>()
    .mockImplementationOnce((_sheet, _mapping, activeSignal) => {
      signal = activeSignal;
      return new Promise(() => {});
    })
    .mockResolvedValueOnce([{ row: 1, message: '姓名已存在' }]);
  const { wizard, choose, click } = await mount({ validate });
  await choose();
  await click('校验数据');
  expect(wizard.getState()).toMatchObject({ step: 'mapping', operation: 'validate' });
  expect(wizard.cancel()).toBe(true);
  expect(signal.aborted).toBe(true);
  await wizard.updateComplete;
  expect(wizard.shadowRoot!.querySelector('select')?.value).toBe('name');
  await click('校验数据');
  expect(wizard.getState()).toMatchObject({ step: 'preview', operation: null, issueCount: 1 });
});
