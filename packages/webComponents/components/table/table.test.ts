import { describe, it, expect, vi } from 'vitest';
import './index';

const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('SeTable', () => {
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
