import { afterEach, describe, expect, it, vi } from 'vitest';
import './alert';
import './drawer';
import './message';
import { notification } from './notification';
import './popconfirm';
import './progress';
import './spin';
import './tooltip';

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  document.body.style.overflow = '';
});

describe('feedback components', () => {
  describe.each(['su-message', 'su-notification'] as const)('%s timer lifecycle', (tag) => {
    it('restarts the duration when updated and cancels it when set to zero', async () => {
      vi.useFakeTimers();
      const element = document.createElement(tag);
      element.duration = 100;
      const close = vi.fn();
      element.addEventListener('close', close);
      document.body.append(element);
      await element.updateComplete;
      vi.advanceTimersByTime(50);
      element.duration = 200;
      await element.updateComplete;
      vi.advanceTimersByTime(100);
      expect(element.isConnected).toBe(true);
      expect(close).not.toHaveBeenCalled();
      element.duration = 0;
      await element.updateComplete;
      vi.advanceTimersByTime(500);
      expect(close).not.toHaveBeenCalled();
      element.dismiss();
      element.dismiss();
      expect(close).toHaveBeenCalledOnce();
    });

    it('clears detached timers and restarts a full duration on reconnect', async () => {
      vi.useFakeTimers();
      const element = document.createElement(tag);
      element.duration = 100;
      const close = vi.fn();
      element.addEventListener('close', close);
      document.body.append(element);
      await element.updateComplete;
      vi.advanceTimersByTime(50);
      element.remove();
      vi.advanceTimersByTime(200);
      expect(close).not.toHaveBeenCalled();
      document.body.append(element);
      await element.updateComplete;
      vi.advanceTimersByTime(99);
      expect(element.isConnected).toBe(true);
      vi.advanceTimersByTime(1);
      expect(close).toHaveBeenCalledOnce();
      expect(element.isConnected).toBe(false);
    });

    it('does not start a pending timer after removal or manual dismissal', async () => {
      vi.useFakeTimers();
      const element = document.createElement(tag);
      element.duration = 100;
      const close = vi.fn();
      element.addEventListener('close', close);
      document.body.append(element);
      element.remove();
      await element.updateComplete;
      vi.advanceTimersByTime(200);
      expect(close).not.toHaveBeenCalled();
      document.body.append(element);
      element.dismiss();
      await element.updateComplete;
      vi.advanceTimersByTime(200);
      expect(close).toHaveBeenCalledOnce();
    });
  });
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

  it('creates and manually closes a stacked notification', async () => {
    const element = notification.success('保存成功', '新配置已经生效', 0);
    const onClose = vi.fn();
    element.addEventListener('close', onClose);
    await element.updateComplete;

    expect(element.parentElement?.getAttribute('aria-label')).toBe('通知');
    expect(element.shadowRoot?.querySelector('[role="status"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('.title')?.textContent).toBe('保存成功');
    expect(element.textContent).toBe('新配置已经生效');

    element.shadowRoot?.querySelector<HTMLButtonElement>('.close')?.click();
    expect(onClose.mock.calls[0][0].detail).toEqual({ source: 'manual' });
    expect(element.isConnected).toBe(false);
  });

  it('automatically closes a notification after its duration', async () => {
    vi.useFakeTimers();
    const element = notification({ title: '同步完成', duration: 100 });
    const onClose = vi.fn();
    element.addEventListener('close', onClose);
    await element.updateComplete;

    vi.advanceTimersByTime(100);

    expect(onClose.mock.calls[0][0].detail).toEqual({ source: 'timeout' });
    expect(element.isConnected).toBe(false);
  });

  it('clears a notification timer when it is disconnected', async () => {
    vi.useFakeTimers();
    const element = notification({ title: '后台同步', duration: 100 });
    const onClose = vi.fn();
    element.addEventListener('close', onClose);
    await element.updateComplete;

    element.remove();
    vi.advanceTimersByTime(100);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('confirms a popconfirm and restores focus to its trigger', async () => {
    const popconfirm = document.createElement('su-popconfirm');
    popconfirm.title = '确定删除这条记录吗？';
    const trigger = document.createElement('button');
    trigger.textContent = '删除';
    popconfirm.append(trigger);
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    popconfirm.addEventListener('confirm', onConfirm);
    popconfirm.addEventListener('close', onClose);
    document.body.append(popconfirm);
    await popconfirm.updateComplete;

    trigger.focus();
    trigger.click();
    await popconfirm.updateComplete;

    expect(popconfirm.open).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(popconfirm.shadowRoot?.querySelector('[role="dialog"]')).toBeTruthy();
    expect(popconfirm.shadowRoot?.activeElement?.classList.contains('confirm')).toBe(true);

    popconfirm.shadowRoot?.querySelector<HTMLButtonElement>('.confirm')?.click();
    await popconfirm.updateComplete;

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onClose.mock.calls[0][0].detail).toEqual({ source: 'confirm' });
    expect(popconfirm.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('keeps a popconfirm open when confirmation is prevented', async () => {
    const popconfirm = document.createElement('su-popconfirm');
    popconfirm.textContent = '危险操作';
    popconfirm.addEventListener('confirm', (event) => event.preventDefault());
    document.body.append(popconfirm);
    await popconfirm.updateComplete;

    popconfirm.shadowRoot?.querySelector<HTMLElement>('.trigger')?.click();
    await popconfirm.updateComplete;
    popconfirm.shadowRoot?.querySelector<HTMLButtonElement>('.confirm')?.click();
    await popconfirm.updateComplete;

    expect(popconfirm.open).toBe(true);
  });

  it('emits cancel before closing a popconfirm', async () => {
    const popconfirm = document.createElement('su-popconfirm');
    popconfirm.textContent = '危险操作';
    const onCancel = vi.fn();
    const onClose = vi.fn();
    popconfirm.addEventListener('cancel', onCancel);
    popconfirm.addEventListener('close', onClose);
    document.body.append(popconfirm);
    await popconfirm.updateComplete;

    popconfirm.shadowRoot?.querySelector<HTMLElement>('.trigger')?.click();
    await popconfirm.updateComplete;
    popconfirm.shadowRoot?.querySelector<HTMLButtonElement>('.actions button')?.click();
    await popconfirm.updateComplete;

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onClose.mock.calls[0][0].detail).toEqual({ source: 'cancel' });
  });

  it('closes a popconfirm with Escape and reports the source', async () => {
    const popconfirm = document.createElement('su-popconfirm');
    popconfirm.textContent = '危险操作';
    const onClose = vi.fn();
    popconfirm.addEventListener('close', onClose);
    document.body.append(popconfirm);
    await popconfirm.updateComplete;

    popconfirm.shadowRoot?.querySelector<HTMLElement>('.trigger')?.click();
    await popconfirm.updateComplete;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await popconfirm.updateComplete;

    expect(popconfirm.open).toBe(false);
    expect(onClose.mock.calls[0][0].detail).toEqual({ source: 'escape' });
  });

  it('closes a popconfirm on outside click without stealing focus', async () => {
    const popconfirm = document.createElement('su-popconfirm');
    popconfirm.textContent = '危险操作';
    const outside = document.createElement('button');
    outside.textContent = '其他操作';
    const onClose = vi.fn();
    popconfirm.addEventListener('close', onClose);
    document.body.append(popconfirm, outside);
    await popconfirm.updateComplete;

    popconfirm.shadowRoot?.querySelector<HTMLElement>('.trigger')?.click();
    await popconfirm.updateComplete;
    outside.focus();
    outside.click();
    await popconfirm.updateComplete;

    expect(popconfirm.open).toBe(false);
    expect(onClose.mock.calls[0][0].detail).toEqual({ source: 'outside' });
    expect(document.activeElement).toBe(outside);
  });
});
