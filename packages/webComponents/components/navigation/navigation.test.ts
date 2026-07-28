import { afterEach, describe, expect, it, vi } from 'vitest';
import './dropdown';
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
});
