import { afterEach, describe, expect, it, vi } from 'vitest';
import './index';

afterEach(() => document.body.replaceChildren());

describe('table ranges and row identity', () => {
  it('does not share fallback selection keys between local pages', async () => {
    const table = document.createElement('se-table');
    table.columns = [{ key: 'name', label: '姓名', sortable: true }];
    table.data = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Cindy' }];
    table.pageSize = 1;
    table.selectable = true;
    const change = vi.fn();
    table.addEventListener('selection-change', change);
    document.body.append(table);
    await table.updateComplete;
    table.shadowRoot!.querySelector<HTMLInputElement>('tbody input')!.click();
    await table.updateComplete;
    const firstKey = table.selectedKeys[0];
    table.currentPage = 2;
    await table.updateComplete;
    const second = table.shadowRoot!.querySelector<HTMLInputElement>('tbody input')!;
    expect(second.checked).toBe(false);
    second.click();
    await table.updateComplete;
    expect(table.selectedKeys).toHaveLength(2);
    expect(new Set(table.selectedKeys).size).toBe(2);
    expect(
      change.mock.calls.at(-1)![0].detail.rows.map((row: { name: string }) => row.name)
    ).toEqual(['Alice', 'Bob']);
    table.shadowRoot!.querySelector<HTMLButtonElement>('.sort-button')!.click();
    table.shadowRoot!.querySelector<HTMLButtonElement>('.sort-button')!.click();
    await table.updateComplete;
    expect(table.selectedKeys).toContain(firstKey);
    table.currentPage = 3;
    await table.updateComplete;
    expect(table.shadowRoot!.querySelector('tbody')!.textContent).toContain('Alice');
    expect(table.shadowRoot!.querySelector<HTMLInputElement>('tbody input')!.checked).toBe(true);
  });

  it('normalizes invalid paging and virtualization values to finite ranges', async () => {
    const table = document.createElement('se-table');
    table.columns = [{ key: 'name', label: '姓名' }];
    table.data = [{ name: 'Alice' }];
    Object.assign(table, {
      pageSize: NaN,
      currentPage: Infinity,
      virtualScroll: true,
      virtualRowHeight: 0,
      virtualBuffer: NaN,
      virtualThreshold: -1,
    });
    document.body.append(table);
    await table.updateComplete;
    expect(table.pageSize).toBe(10);
    expect(table.currentPage).toBe(1);
    expect(table.virtualRowHeight).toBe(44);
    expect(table.virtualBuffer).toBe(8);
    expect(table.virtualThreshold).toBe(1000);
    expect(table.shadowRoot!.querySelector('tbody')!.textContent).toContain('Alice');
    expect(table.shadowRoot!.innerHTML).not.toMatch(/NaN|Infinity/);
  });

  it('renders a bounded virtual window and stays populated when data shrinks', async () => {
    const table = document.createElement('se-table');
    table.columns = [{ key: 'name', label: '姓名' }];
    table.data = Array.from({ length: 1000 }, (_, id) => ({ id, name: `Person-${id}` }));
    Object.assign(table, {
      pagination: false,
      virtualScroll: true,
      virtualRowHeight: 20,
      virtualBuffer: 2,
    });
    document.body.append(table);
    await table.updateComplete;
    const viewport = table.shadowRoot!.querySelector<HTMLDivElement>('.table-viewport')!;
    Object.defineProperty(viewport, 'clientHeight', { value: 100 });
    viewport.scrollTop = 800;
    viewport.dispatchEvent(new Event('scroll'));
    await table.updateComplete;
    expect(
      table.shadowRoot!.querySelectorAll('tbody tr:not(.virtual-spacer)').length
    ).toBeLessThanOrEqual(9);
    expect(table.shadowRoot!.querySelector('tbody')!.textContent).toContain('Person-38');
    table.data = [{ id: 1, name: 'Only one' }];
    await table.updateComplete;
    expect(table.shadowRoot!.querySelector('tbody')!.textContent).toContain('Only one');
    expect(table.shadowRoot!.querySelectorAll('.virtual-spacer')).toHaveLength(0);
  });

  it('disables virtualization when spanning cells to preserve covered rows', async () => {
    const table = document.createElement('se-table');
    table.columns = [{ key: 'name', label: '姓名' }];
    table.data = [
      { id: 1, name: 'Merged' },
      { id: 2, name: 'Covered' },
    ];
    table.pagination = false;
    table.virtualScroll = true;
    table.spanMethod = ({ rowIndex }) => (rowIndex === 0 ? [2, 1] : [0, 0]);
    document.body.append(table);
    await table.updateComplete;
    expect(table.shadowRoot!.querySelector('tbody td')!.getAttribute('rowspan')).toBe('2');
    expect(table.shadowRoot!.querySelectorAll('tbody td')).toHaveLength(1);
    expect(table.shadowRoot!.querySelectorAll('.virtual-spacer')).toHaveLength(0);
  });
});
