import { afterEach, expect, it, vi } from 'vitest';
import './index';
import type {} from '../../types';
import { normalizeColumnState, normalizeFilters, matchesModel } from './state';
afterEach(() => document.body.replaceChildren());
it('normalizes special keys without treating prototypes as entries', () => {
  const states = normalizeColumnState(
    [{ key: '__proto__' }, { key: 'constructor' }],
    [{ key: 'constructor', width: 100 }]
  );
  expect(states).toEqual([{ key: 'constructor', width: 100 }, { key: '__proto__' }]);
});
it('keeps selection and expansion cells aligned after hiding a fixed column', async () => {
  const el = await mount();
  el.selectable = true;
  el.expandable = true;
  el.columnState = [{ key: 'name', hidden: true }];
  await el.updateComplete;
  expect(el.shadowRoot!.querySelectorAll('thead th')).toHaveLength(4);
  expect(el.shadowRoot!.querySelector('tbody tr')!.querySelectorAll('td')).toHaveLength(4);
  expect(el.exportColumnState().columns.find((c) => c.key === 'name')!.hidden).toBe(true);
});
it('sorts filtered rows and keeps the typed condition out of old event shapes when empty', async () => {
  const el = await mount();
  el.filterModels = { age: { type: 'number', min: 25 } };
  await el.updateComplete;
  el.sortColumn(1);
  el.sortColumn(1);
  await el.updateComplete;
  expect(el.sortedData.map((r) => r.id)).toEqual([3, 2]);
});
const columns = [
  { key: 'name', label: '姓名', fixed: 'left' as const, width: '100px' },
  {
    key: 'age',
    label: '年龄',
    sortable: true,
    filterable: true,
    filterType: 'number' as const,
    resizable: true,
  },
  {
    key: 'city',
    label: '城市',
    filterable: true,
    filterType: 'enum' as const,
    filterOptions: [
      { value: 'sh', label: '上海' },
      { value: 'bj', label: '北京' },
    ],
  },
];
async function mount() {
  const el = document.createElement('se-table');
  el.columns = columns;
  el.data = [
    { id: 1, name: 'Alice', age: 20, city: 'sh' },
    { id: 2, name: 'Bob', age: 30, city: 'bj' },
    { id: 3, name: 'Cindy', age: 40, city: 'sh' },
  ];
  el.pagination = false;
  el.columnSettings = true;
  document.body.append(el);
  await el.updateComplete;
  return el;
}
it('normalizes keys, groups, duplicates and constrained widths without mutation', () => {
  const input = [
    { key: 'city', hidden: true },
    { key: 'name', width: 1 },
    { key: 'age', width: NaN },
    { key: 'unknown' },
  ];
  const copy = JSON.stringify(input);
  expect(normalizeColumnState(columns, input)).toEqual([
    { key: 'name', width: 64 },
    { key: 'city', hidden: true },
    { key: 'age' },
  ]);
  expect(JSON.stringify(input)).toBe(copy);
  expect(
    normalizeColumnState(columns, [
      { key: 'age', hidden: true },
      { key: 'age', width: 100 },
    ]).find((s) => s.key === 'age')
  ).toEqual({ key: 'age' });
  expect(normalizeColumnState([{ key: 'a' }, { key: 'a' }], [])).toEqual([]);
});
it('hides and reorders actual columns, including all-hidden settings recovery', async () => {
  const el = await mount();
  const change = vi.fn();
  el.addEventListener('column-state-change', change);
  el.columnState = [{ key: 'city' }, { key: 'age' }, { key: 'name' }];
  await el.updateComplete;
  expect(el.sortedColumns.map((c) => c.key)).toEqual(['name', 'city', 'age']);
  expect(change).not.toHaveBeenCalled();
  el.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="前移age"]')!.click();
  await el.updateComplete;
  expect(el.sortedColumns.map((c) => c.key)).toEqual(['name', 'age', 'city']);
  expect(change).toHaveBeenCalledOnce();
  el.columnState = columns.map((c) => ({ key: c.key, hidden: true }));
  await el.updateComplete;
  expect(el.sortedColumns).toHaveLength(0);
  expect(el.shadowRoot!.querySelector('summary')!.textContent).toBe('列设置');
  const checkbox = el.shadowRoot!.querySelector<HTMLInputElement>('details input')!;
  checkbox.click();
  await el.updateComplete;
  expect(el.sortedColumns).toHaveLength(1);
});
it('exports independent snapshots; rejects bad versions and duplicate columns', async () => {
  const el = await mount();
  expect(el.importColumnState({ version: 2, columns: [] })).toBe(false);
  expect(
    el.importColumnState({ version: 1, columns: [{ key: 'age', width: 180, hidden: true }] })
  ).toBe(true);
  await el.updateComplete;
  const snapshot = el.exportColumnState();
  snapshot.columns[0].hidden = true;
  expect(el.exportColumnState().columns[0].hidden).not.toBe(true);
  expect(el.exportColumnState().columns.find((c) => c.key === 'age')).toEqual({
    key: 'age',
    width: 180,
    hidden: true,
  });
  el.columns = [columns[0], columns[0]];
  await el.updateComplete;
  expect(el.importColumnState({ version: 1, columns: [] })).toBe(false);
});
it('prunes removed columns and appends new keys with immutable input', async () => {
  const el = await mount();
  el.columnState = [
    { key: 'city', hidden: true },
    { key: 'age', width: 180 },
  ];
  await el.updateComplete;
  el.columns = [columns[0], columns[1], { key: 'new', label: '新列' }];
  await el.updateComplete;
  expect(el.exportColumnState().columns).toEqual([
    { key: 'name' },
    { key: 'age', width: 180 },
    { key: 'new' },
  ]);
  expect(columns[1].width).toBeUndefined();
});
it('keyboard resizing is exported and program restore stays silent', async () => {
  const el = await mount();
  const event = vi.fn();
  el.addEventListener('column-state-change', event);
  el.shadowRoot!.querySelector('[aria-label="调整年龄列宽"]')!.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'ArrowRight' })
  );
  await el.updateComplete;
  const width = el.exportColumnState().columns.find((c) => c.key === 'age')!.width;
  expect(width).toBe(130);
  expect(event).toHaveBeenCalledOnce();
  const copy = el.exportColumnState();
  el.importColumnState(copy);
  await el.updateComplete;
  expect(event).toHaveBeenCalledOnce();
});
it('combines typed models, enum OR and text fallback; excludes nonnumeric values', async () => {
  const el = await mount();
  el.filterModels = {
    city: { type: 'enum', values: ['sh'] },
    age: { type: 'number', min: 25, max: 45 },
  };
  await el.updateComplete;
  expect(el.sortedData.map((r) => r.id)).toEqual([3]);
  el.filters = { city: 'bj' };
  el.filterModels = { city: { type: 'enum', values: [] } };
  await el.updateComplete;
  expect(el.sortedData).toHaveLength(3);
  expect(matchesModel('', { type: 'number', min: 0 })).toBe(false);
  expect(matchesModel('20', { type: 'number', min: 0 })).toBe(false);
  expect(
    normalizeFilters({ a: { type: 'number', min: 30, max: 20 }, b: { type: 'enum', values: [1] } })
      .invalid
  ).toEqual(['a', 'b']);
});
it('invalid program models report errors and do not filter data', async () => {
  const el = await mount();
  const invalid = vi.fn();
  el.addEventListener('filter-invalid', invalid);
  el.filterModels = { age: { type: 'number', min: 40, max: 20 } };
  await el.updateComplete;
  expect(invalid).toHaveBeenCalledOnce();
  expect(el.sortedData).toHaveLength(3);
});
it('remote emits independent conditions, resets user page, but never filters rows', async () => {
  const el = await mount();
  el.remote = true;
  el.currentPage = 3;
  await el.updateComplete;
  const change = vi.fn();
  el.addEventListener('filter-model-change', change);
  const input = el.shadowRoot!.querySelector<HTMLInputElement>('[aria-label="数值下限年龄"]')!;
  input.value = '25';
  input.dispatchEvent(new Event('change'));
  await el.updateComplete;
  expect(el.currentPage).toBe(1);
  expect(el.sortedData).toHaveLength(3);
  expect(change).toHaveBeenCalledOnce();
  expect(change.mock.calls[0][0].detail.filterModels.age).toEqual({ type: 'number', min: 25 });
  change.mock.calls[0][0].detail.filterModels.age.min = 100;
  expect(el.filterModels.age).toEqual({ type: 'number', min: 25 });
});
