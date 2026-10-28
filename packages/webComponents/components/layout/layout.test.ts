import { afterEach, describe, expect, it, vi } from 'vitest';
import './container';
import './divider';
import './theme-toggle';
import { setThemeMode } from '../../utils/theme';

afterEach(() => {
  document.body.replaceChildren();
  setThemeMode('light');
});

describe('layout components', () => {
  it('maps container dimensions to CSS variables and named slots', async () => {
    const container = document.createElement('su-container') as HTMLElement & {
      siderWidth: string;
      headerHeight: string;
      updateComplete: Promise<unknown>;
    };
    container.siderWidth = '240px';
    container.headerHeight = '64px';
    const sider = document.createElement('aside');
    sider.slot = 'sider';
    const header = document.createElement('header');
    header.slot = 'header';
    container.append(sider, header, document.createElement('main'));
    document.body.append(container);
    await container.updateComplete;

    expect(container.style.getPropertyValue('--sider-width')).toBe('240px');
    expect(container.style.getPropertyValue('--header-height')).toBe('64px');
    expect(container.shadowRoot?.querySelector('slot[name="sider"]')).toBeTruthy();
    expect(container.shadowRoot?.querySelector('slot[name="header"]')).toBeTruthy();
  });

  it('reflects divider direction and dashed state', async () => {
    const divider = document.createElement('su-divider') as HTMLElement & {
      direction: string;
      dashed: boolean;
      updateComplete: Promise<unknown>;
    };
    divider.direction = 'horizontal';
    divider.dashed = true;
    divider.textContent = '分组';
    document.body.append(divider);
    await divider.updateComplete;

    expect(divider.getAttribute('direction')).toBe('horizontal');
    expect(divider.hasAttribute('dashed')).toBe(true);
    expect(divider.shadowRoot?.querySelector('.divider:not(.plain)')).toBeTruthy();

    divider.direction = 'vertical';
    await divider.updateComplete;
    expect(divider.shadowRoot?.querySelector('.divider')).toBeNull();
  });

  it('toggles theme and emits the new mode', async () => {
    setThemeMode('light');
    const toggle = document.createElement('su-theme-toggle');
    const onChange = vi.fn();
    toggle.addEventListener('change', onChange);
    document.body.append(toggle);
    await (toggle as typeof toggle & { updateComplete: Promise<unknown> }).updateComplete;

    toggle.shadowRoot?.querySelector<HTMLButtonElement>('button')?.click();
    await (toggle as typeof toggle & { updateComplete: Promise<unknown> }).updateComplete;

    expect(document.documentElement.getAttribute('data-su-theme')).toBe('dark');
    expect(onChange.mock.calls[0][0].detail).toEqual({ mode: 'dark' });
  });
});
