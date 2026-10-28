import { afterEach, describe, expect, it, vi } from 'vitest';
import './index';

afterEach(() => {
  document.body.replaceChildren();
  document.body.style.overflow = '';
});

describe('asset viewer', () => {
  it.each([
    ['/manual.PDF?token=abc#page=2', 'pdf'],
    ['https://example.test/photo.png?download=1', 'image'],
    ['/clip.mp4#t=10', 'video'],
    ['/voice.ogg?signature=123', 'audio'],
    ['/download?filename=manual.pdf', 'unknown'],
  ])('detects the pathname type of %s', async (src, type) => {
    const viewer = document.createElement('se-asset-viewer');
    viewer.src = src;
    const open = vi.fn();
    viewer.addEventListener('asset-open', open);
    document.body.append(viewer);
    await viewer.updateComplete;
    viewer.shadowRoot!.querySelector<HTMLButtonElement>('.actions button')!.click();
    await viewer.updateComplete;
    expect(open.mock.calls[0][0].detail.type).toBe(type);
  });

  it('respects an explicit resource type', async () => {
    const viewer = document.createElement('se-asset-viewer');
    viewer.src = '/download?file=123';
    viewer.type = 'pdf';
    document.body.append(viewer);
    await viewer.updateComplete;
    viewer.shadowRoot!.querySelector<HTMLButtonElement>('.actions button')!.click();
    await viewer.updateComplete;
    expect(viewer.shadowRoot!.querySelector('iframe')?.getAttribute('src')).toBe(viewer.src);
  });

  it('uses a keyboard trigger and restores focus and scrolling on Escape', async () => {
    const viewer = document.createElement('se-asset-viewer');
    viewer.src = '/photo.png';
    document.body.append(viewer);
    await viewer.updateComplete;
    const trigger = viewer.shadowRoot!.querySelector<HTMLButtonElement>('.preview')!;
    expect(trigger.tagName).toBe('BUTTON');
    trigger.focus();
    trigger.click();
    await viewer.updateComplete;
    expect(viewer.shadowRoot!.querySelector('[role="dialog"]')).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');
    expect(viewer.shadowRoot!.activeElement).toBe(
      viewer.shadowRoot!.querySelector('.overlay button')
    );
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await viewer.updateComplete;
    expect(viewer.shadowRoot!.querySelector('.overlay')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(viewer.shadowRoot!.activeElement).toBe(trigger);
  });

  it('closes stale content when the source changes and cleans up on detach', async () => {
    const viewer = document.createElement('se-asset-viewer');
    viewer.src = '/first.png';
    document.body.append(viewer);
    await viewer.updateComplete;
    const open = () =>
      viewer.shadowRoot!.querySelector<HTMLButtonElement>('.actions button')!.click();
    open();
    await viewer.updateComplete;
    viewer.src = '/second.png';
    await viewer.updateComplete;
    expect(viewer.shadowRoot!.querySelector('.overlay')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    open();
    await viewer.updateComplete;
    viewer.remove();
    expect(document.body.style.overflow).toBe('');
    document.body.append(viewer);
    await viewer.updateComplete;
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('offers a retry after an image load error', async () => {
    const viewer = document.createElement('se-asset-viewer');
    viewer.src = '/photo.png';
    document.body.append(viewer);
    await viewer.updateComplete;
    viewer.shadowRoot!.querySelector<HTMLButtonElement>('.actions button')!.click();
    await viewer.updateComplete;
    viewer.shadowRoot!.querySelector('.overlay img')!.dispatchEvent(new Event('error'));
    await viewer.updateComplete;
    expect(viewer.shadowRoot!.querySelector('[role="alert"]')?.textContent).toContain('加载失败');
    viewer.shadowRoot!.querySelector<HTMLButtonElement>('.retry')!.click();
    await viewer.updateComplete;
    expect(viewer.shadowRoot!.querySelector('.overlay img')).toBeTruthy();
    expect(viewer.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
  });
});
