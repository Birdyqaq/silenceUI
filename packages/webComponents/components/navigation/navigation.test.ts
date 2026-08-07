import { afterEach, describe, expect, it, vi } from 'vitest';
import './breadcrumb';
import './dropdown';
import './menu';
import './steps';
import './tabs';

afterEach(() => {
  document.body.replaceChildren();
});

describe('navigation keyboard interactions', () => {
  it('moves tabs with arrow keys and skips disabled items', async () => {
    const tabs = document.createElement('su-tabs');
    tabs.items = [
      { key: 'first', label: 'First' },
      { key: 'disabled', label: 'Disabled', disabled: true },
      { key: 'last', label: 'Last' },
    ];
    const onChange = vi.fn();
    tabs.addEventListener('change', onChange);
    document.body.append(tabs);
    await tabs.updateComplete;

    const first = tabs.shadowRoot?.querySelector<HTMLButtonElement>('.tab');
    first?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await tabs.updateComplete;

    expect(tabs.activeKey).toBe('last');
    expect(tabs.shadowRoot?.activeElement?.getAttribute('data-key')).toBe('last');
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('opens a dropdown with ArrowDown and restores focus on Escape', async () => {
    const dropdown = document.createElement('su-dropdown');
    dropdown.textContent = 'Actions';
    dropdown.items = [
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete' },
    ];
    document.body.append(dropdown);
    await dropdown.updateComplete;

    const trigger = dropdown.shadowRoot?.querySelector<HTMLElement>('.trigger');
    trigger?.focus();
    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await dropdown.updateComplete;

    expect(dropdown.open).toBe(true);
    expect(dropdown.shadowRoot?.activeElement?.textContent?.trim()).toBe('Edit');

    dropdown.shadowRoot?.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await dropdown.updateComplete;

    expect(dropdown.open).toBe(false);
    expect(dropdown.shadowRoot?.activeElement).toBe(trigger);
  });

  it('selects a menu item from itemsJson and updates the active key', async () => {
    const menu = document.createElement('su-menu') as HTMLElement & {
      itemsJson: string;
      activeKey: string;
      updateComplete: Promise<unknown>;
    };
    menu.itemsJson = JSON.stringify([
      { key: 'overview', label: '概览' },
      { key: 'settings', label: '设置' },
    ]);
    const onSelect = vi.fn();
    menu.addEventListener('select', onSelect);
    document.body.append(menu);
    await menu.updateComplete;

    menu.shadowRoot?.querySelectorAll<HTMLButtonElement>('.item')[1]?.click();
    await menu.updateComplete;

    expect(menu.activeKey).toBe('settings');
    expect(onSelect.mock.calls[0][0].detail).toEqual({ key: 'settings', label: '设置' });
  });

  it('renders breadcrumb separators and emits navigation details', async () => {
    const breadcrumb = document.createElement('su-breadcrumb') as HTMLElement & {
      itemsJson: string;
      separator: string;
      updateComplete: Promise<unknown>;
    };
    breadcrumb.itemsJson = JSON.stringify([
      { label: '首页', key: 'home' },
      { label: '用户', key: 'users' },
    ]);
    breadcrumb.separator = '>';
    const onNavigate = vi.fn();
    breadcrumb.addEventListener('navigate', onNavigate);
    document.body.append(breadcrumb);
    await breadcrumb.updateComplete;

    expect(breadcrumb.shadowRoot?.querySelector('.sep')?.textContent).toBe('>');
    breadcrumb.shadowRoot?.querySelectorAll<HTMLButtonElement>('button')[0]?.click();

    expect(onNavigate.mock.calls[0][0].detail).toEqual({
      item: { label: '首页', key: 'home' },
      index: 0,
    });
  });

  it('marks completed and active steps from itemsJson', async () => {
    const steps = document.createElement('su-steps') as HTMLElement & {
      itemsJson: string;
      current: number;
      updateComplete: Promise<unknown>;
    };
    steps.itemsJson = JSON.stringify([
      { title: '提交申请', description: '填写信息' },
      { title: '审核中' },
      { title: '已完成' },
    ]);
    steps.current = 1;
    document.body.append(steps);
    await steps.updateComplete;

    expect(steps.shadowRoot?.querySelectorAll('.step')).toHaveLength(3);
    expect(steps.shadowRoot?.querySelectorAll('.step.finished')).toHaveLength(1);
    expect(steps.shadowRoot?.querySelectorAll('.step.active')).toHaveLength(1);
    expect(steps.shadowRoot?.querySelector('.description')?.textContent).toBe('填写信息');
  });
});
