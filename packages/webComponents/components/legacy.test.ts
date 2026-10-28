import { afterEach, describe, expect, it, vi } from 'vitest';
import './asset-viewer';
import './line';
import './pagination';
import './image/preview';

afterEach(() => {
  document.body.replaceChildren();
  document.body.style.overflow = '';
});

describe('compatibility and utility components', () => {
  it('renders a line with the configured direction and color', async () => {
    const line = document.createElement('line-component') as HTMLElement & {
      direction: string;
      color: string;
      updateComplete: Promise<unknown>;
    };
    line.direction = 'vertical';
    line.color = '#7c3aed';
    document.body.append(line);
    await line.updateComplete;

    expect(line.shadowRoot?.querySelector('.line.vertical')).toBeTruthy();
    expect(line.shadowRoot?.querySelector('.line')?.getAttribute('style')).toContain('#7c3aed');
  });

  it('opens an asset preview and emits detected type', async () => {
    const viewer = document.createElement('se-asset-viewer') as HTMLElement & {
      src: string;
      title: string;
      downloadable: boolean;
      updateComplete: Promise<unknown>;
    };
    viewer.src = '/reports/monthly.pdf';
    viewer.title = '月报';
    viewer.downloadable = false;
    const onOpen = vi.fn();
    viewer.addEventListener('asset-open', onOpen);
    document.body.append(viewer);
    await viewer.updateComplete;

    viewer.shadowRoot?.querySelector<HTMLButtonElement>('.actions button')?.click();
    await viewer.updateComplete;

    expect(onOpen.mock.calls[0][0].detail).toEqual({
      src: '/reports/monthly.pdf',
      type: 'pdf',
    });
    expect(viewer.shadowRoot?.querySelector('.overlay')).toBeTruthy();
    viewer.shadowRoot?.querySelector<HTMLButtonElement>('.overlay header button')?.click();
    await viewer.updateComplete;
    expect(viewer.shadowRoot?.querySelector('.overlay')).toBeNull();
  });

  it('emits bounded page changes from pagination controls', async () => {
    const pagination = document.createElement('se-pagination') as HTMLElement & {
      total: number;
      pageSize: number;
      currentPage: number;
      updateComplete: Promise<unknown>;
    };
    pagination.total = 25;
    pagination.pageSize = 10;
    const onChange = vi.fn();
    pagination.addEventListener('page-change', onChange);
    document.body.append(pagination);
    await pagination.updateComplete;

    pagination.shadowRoot?.querySelector<HTMLButtonElement>('button:last-of-type')?.click();
    await pagination.updateComplete;
    expect(pagination.currentPage).toBe(2);
    expect(onChange.mock.calls[0][0].detail).toEqual({ currentPage: 2 });
  });

  it('rotates image preview and closes on Escape', async () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    const preview = document.createElement('se-image-preview') as HTMLElement & {
      src: string;
      alt: string;
      updateComplete: Promise<unknown>;
    };
    preview.src = '/avatar.png';
    preview.alt = '头像';
    const onClose = vi.fn();
    preview.addEventListener('close', onClose);
    document.body.append(preview);
    await preview.updateComplete;

    preview.shadowRoot?.querySelector<HTMLButtonElement>('button[aria-label*="旋转"]')?.click();
    await preview.updateComplete;
    expect(preview.shadowRoot?.querySelector('img')?.getAttribute('style')).toContain(
      'rotate(90deg)'
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
