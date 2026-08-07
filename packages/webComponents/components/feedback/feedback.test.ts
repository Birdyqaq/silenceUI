import { afterEach, describe, expect, it, vi } from 'vitest';
import './alert';
import './drawer';
import './message';
import './progress';
import './spin';
import './tooltip';

afterEach(() => {
  document.body.replaceChildren();
  document.body.style.overflow = '';
});

describe('feedback components', () => {
  it('closes a closable alert and emits a composed close event', async () => {
    const alert = document.createElement('su-alert') as HTMLElement & {
      closable: boolean;
      updateComplete: Promise<unknown>;
    };
    alert.closable = true;
    alert.textContent = '保存成功';
    const onClose = vi.fn();
    alert.addEventListener('close', onClose);
    document.body.append(alert);
    await alert.updateComplete;

    alert.shadowRoot?.querySelector<HTMLButtonElement>('.close')?.click();
    await alert.updateComplete;

    expect(alert.shadowRoot?.querySelector('.alert')).toBeNull();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('clamps progress values and exposes progressbar semantics', async () => {
    const progress = document.createElement('su-progress') as HTMLElement & {
      percent: number;
      updateComplete: Promise<unknown>;
    };
    progress.percent = 140;
    document.body.append(progress);
    await progress.updateComplete;

    const bar = progress.shadowRoot?.querySelector<HTMLElement>('[role="progressbar"]');
    expect(bar?.getAttribute('aria-valuenow')).toBe('100');
    expect(progress.shadowRoot?.querySelector('.text')?.textContent).toBe('100%');
    expect(progress.shadowRoot?.querySelector('.bar')?.getAttribute('style')).toContain('100%');
  });

  it('shows and hides spin overlay with slotted content', async () => {
    const spin = document.createElement('su-spin') as HTMLElement & {
      spinning: boolean;
      tip: string;
      updateComplete: Promise<unknown>;
    };
    spin.spinning = true;
    spin.tip = '加载中';
    spin.textContent = '列表内容';
    document.body.append(spin);
    await spin.updateComplete;

    expect(spin.shadowRoot?.querySelector('.overlay')).toBeTruthy();
    expect(spin.shadowRoot?.querySelector('.tip')?.textContent).toBe('加载中');

    spin.spinning = false;
    await spin.updateComplete;
    expect(spin.shadowRoot?.querySelector('.overlay')).toBeNull();
  });

  it('closes a drawer from Escape and restores body scrolling', async () => {
    const drawer = document.createElement('su-drawer') as HTMLElement & {
      open: boolean;
      updateComplete: Promise<unknown>;
    };
    const onClose = vi.fn();
    drawer.open = true;
    drawer.addEventListener('close', onClose);
    document.body.append(drawer);
    await drawer.updateComplete;

    expect(document.body.style.overflow).toBe('hidden');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await drawer.updateComplete;

    expect(drawer.open).toBe(false);
    expect(document.body.style.overflow).toBe('');
    expect(onClose.mock.calls[0][0].detail).toEqual({ source: 'escape' });
  });

  it('renders a success message and dismisses it', async () => {
    const element = document.createElement('su-message') as HTMLElement & {
      type: string;
      duration: number;
      dismiss(): void;
      updateComplete: Promise<unknown>;
    };
    element.type = 'success';
    element.duration = 0;
    element.textContent = '保存成功';
    document.body.append(element);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('.message')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('.icon.success')).toBeTruthy();
    expect(element.textContent).toContain('保存成功');
    const onClose = vi.fn();
    element.addEventListener('close', onClose);
    element.dismiss();

    expect(onClose).toHaveBeenCalledOnce();
    expect(element.isConnected).toBe(false);
  });

  it('exposes tooltip semantics and placement as an attribute', async () => {
    const tooltip = document.createElement('su-tooltip') as HTMLElement & {
      content: string;
      placement: string;
      updateComplete: Promise<unknown>;
    };
    tooltip.content = '更多信息';
    tooltip.placement = 'right';
    tooltip.textContent = '悬浮查看';
    document.body.append(tooltip);
    await tooltip.updateComplete;

    expect(tooltip.getAttribute('placement')).toBe('right');
    expect(tooltip.shadowRoot?.querySelector('[role="tooltip"]')?.textContent).toBe('更多信息');
  });
});
