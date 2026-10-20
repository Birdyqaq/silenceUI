import { describe, it, expect, vi } from 'vitest';
import './index';

const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('SeTable', () => {
  it('exposes a focusable sort button and announces each sort direction', async () => {
    const element = document.createElement('se-table');
    element.columns = [
      { key: 'name', label: '姓名', sortable: true, resizable: true },
      { key: 'id', label: '编号' },
    ];
    element.data = [
      { id: 1, name: 'Bob' },
      { id: 2, name: 'Alice' },
    ];
    const sort = vi.fn();
    element.addEventListener('sort-change', sort);
    document.body.append(element);
    await element.updateComplete;
    const header = element.shadowRoot!.querySelector('th')!;
    const button = header.querySelector<HTMLButtonElement>('.sort-button')!;
    button.focus();
    expect(element.shadowRoot!.activeElement).toBe(button);
    expect(header.getAttribute('aria-sort')).toBe('none');
    button.click();
    await element.updateComplete;
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    expect(element.sortedData[0].name).toBe('Alice');
    header.querySelector<HTMLElement>('.resize-handle')!.click();
    expect(sort).toHaveBeenCalledOnce();
    button.click();
    await element.updateComplete;
    expect(header.getAttribute('aria-sort')).toBe('descending');
    button.click();
    await element.updateComplete;
    expect(header.getAttribute('aria-sort')).toBe('none');
    expect(element.sortedData[0].name).toBe('Bob');
    expect(element.shadowRoot!.querySelectorAll('th')[1].hasAttribute('aria-sort')).toBe(false);
    element.remove();
  });

  it('preserves the initial remote page and forwards one page event to the host', async () => {
    const element = document.createElement('se-table');
    element.remote = true;
    element.total = 100;
    element.currentPage = 3;
    element.columns = [{ key: 'name', label: '姓名' }];
    element.data = [{ id: 21, name: 'Alice' }];
    const page = vi.fn();
    const host = document.createElement('section');
    host.addEventListener('page-change', page);
    host.append(element);
    document.body.append(host);
    await element.updateComplete;
    expect(element.currentPage).toBe(3);
    const pagination = element.shadowRoot!.querySelector('se-pagination')!;
    await pagination.updateComplete;
    pagination.shadowRoot!.querySelectorAll<HTMLButtonElement>('button')[1].click();
    await element.updateComplete;
    expect(element.currentPage).toBe(4);
    expect(page).toHaveBeenCalledOnce();
    expect(page.mock.calls[0][0].detail).toEqual({ currentPage: 4 });
    element.pageSize = 20;
    element.currentPage = 2;
    await element.updateComplete;
    expect(element.currentPage).toBe(2);
    host.remove();
  });
  it('cleans resize listeners when detached', async () => {
    const element = document.createElement('se-table');
    element.columns = [{ key: 'name', label: '姓名', width: '100px', resizable: true }];
    document.body.append(element);
    await element.updateComplete;
    const listener = vi.fn();
    element.addEventListener('column-resize', listener);
    element
      .shadowRoot!.querySelector('.resize-handle')!
      .dispatchEvent(new MouseEvent('pointerdown', { clientX: 10, bubbles: true }));
    element.remove();
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 50 }));
    window.dispatchEvent(new Event('pointerup'));
    expect(listener).not.toHaveBeenCalled();
  });
  it('keeps server rows and page when remote data changes', async () => {
    const element = document.createElement('se-table');
    element.remote = true;
    element.total = 100;
    element.columns = [{ key: 'name', label: '姓名', sortable: true }];
    element.data = [
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice' },
    ];
    document.body.append(element);
    await element.updateComplete;
    element.currentPage = 3;
    await element.updateComplete;
    expect(element.shadowRoot!.querySelectorAll('tbody tr')).toHaveLength(2);
    element.sortColumn(0);
    await element.updateComplete;
    expect(element.sortedData[0].name).toBe('Bob');
    element.currentPage = 3;
    element.data = [{ id: 3, name: 'Cindy' }];
    await element.updateComplete;
    expect(element.currentPage).toBe(3);
    expect(element.sortedColumns[0].sortDirection).toBe('asc');
    element.remove();
  });
  it('expands and collapses rows without emitting row-click and accepts external keys', async () => {
    const element = document.createElement('se-table');
    element.columns = [{ key: 'name', label: '姓名' }];
    element.data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    element.expandable = true;
    element.virtualScroll = true;
    element.expandedRowRender = (row) => `详情：${row.name}`;
    const expand = vi.fn();
    const click = vi.fn();
    element.addEventListener('expand-change', expand);
    element.addEventListener('row-click', click);
    document.body.append(element);
    await element.updateComplete;
    const button = element.shadowRoot!.querySelector<HTMLButtonElement>('.expansion-cell button')!;
    button.click();
    await element.updateComplete;
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(element.shadowRoot!.querySelector('.expanded-row')!.textContent).toContain(
      '详情：Alice'
    );
    expect(expand.mock.calls[0][0].detail).toMatchObject({ key: '1', expanded: true, keys: ['1'] });
    expect(click).not.toHaveBeenCalled();
    button.click();
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('.expanded-row')).toBeNull();
    element.expandedKeys = ['2'];
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('.expanded-row')!.textContent).toContain('详情：Bob');
    element.rowExpandable = (row) => row.id !== 2;
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('.expanded-row')).toBeNull();
    expect(
      element.shadowRoot!.querySelectorAll<HTMLButtonElement>('.expansion-cell button')[1].disabled
    ).toBe(true);
    element.remove();
  });
  it('registers the custom element', () => {
    expect(customElements.get('se-table')).toBeDefined();
  });

  it('renders fixed columns with calculated offsets', async () => {
    const element = document.createElement('se-table');
    element.pagination = false;
    element.columns = [
      { key: 'name', label: '姓名', width: '120px', fixed: 'left' },
      { key: 'age', label: '年龄', width: '80px' },
      { key: 'action', label: '操作', width: '100px', fixed: 'right' },
    ];
    element.data = [{ name: 'Alice', age: 24, action: '查看' }];
    document.body.append(element);
    await element.updateComplete;

    const headers = element.shadowRoot!.querySelectorAll('th');
    expect(headers[0].classList.contains('fixed-column')).toBe(true);
    expect(headers[0].getAttribute('style')).toContain('left: 0px');
    expect(headers[2].getAttribute('style')).toContain('right: 0px');
    expect(element.shadowRoot!.querySelectorAll('td.fixed-column')).toHaveLength(2);
    element.remove();
  });

  it('resizes a column by keyboard and emits its final width', async () => {
    const element = document.createElement('se-table');
    const listener = vi.fn();
    element.columns = [{ key: 'name', label: '姓名', width: '100px', resizable: true }];
    element.data = [{ name: 'Alice' }];
    element.addEventListener('column-resize', listener);
    document.body.append(element);
    await element.updateComplete;

    const handle = element.shadowRoot!.querySelector<HTMLElement>('.resize-handle')!;
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await element.updateComplete;

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].detail).toEqual({ column: 'name', width: 110 });
    expect(element.shadowRoot!.querySelector('th')!.getAttribute('style')).toContain('110px');
    element.remove();
    await nextFrame();
  });
});
