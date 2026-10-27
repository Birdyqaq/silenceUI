import { afterEach, expect, it, vi } from 'vitest';
import './index';

afterEach(() => document.body.replaceChildren());

async function setup() {
  const tabs = document.createElement('su-tabs');
  tabs.items = [
    { key: 'a', label: 'A' },
    { key: 'b', label: 'B', disabled: true },
    { key: 'c', label: 'C' },
  ];
  tabs.closable = true;
  document.body.append(tabs);
  await tabs.updateComplete;
  return tabs;
}

it('links distinct panels and hides all content when every tab is disabled', async () => {
  const tabs = await setup();
  for (const button of tabs.shadowRoot!.querySelectorAll('.tab')) {
    const panel = tabs.shadowRoot!.getElementById(button.getAttribute('aria-controls')!)!;
    expect(panel.getAttribute('aria-labelledby')).toBe(button.id);
  }
  expect(tabs.shadowRoot!.querySelectorAll('.panel:not([hidden])')).toHaveLength(1);
  tabs.items = tabs.items.map((item) => ({ ...item, disabled: true }));
  await tabs.updateComplete;
  expect(tabs.shadowRoot!.querySelectorAll('.panel:not([hidden])')).toHaveLength(0);
  expect(tabs.shadowRoot!.querySelectorAll('.tab[tabindex="0"]')).toHaveLength(0);
});

it('closes active tabs and focuses an enabled neighbor', async () => {
  const tabs = await setup();
  const change = vi.fn();
  tabs.addEventListener('change', change);
  tabs.shadowRoot!.querySelector<HTMLButtonElement>('.close')!.focus();
  tabs.shadowRoot!.querySelector<HTMLButtonElement>('.close')!.click();
  await tabs.updateComplete;
  expect(tabs.items.map((item) => item.key)).toEqual(['b', 'c']);
  expect(tabs.activeKey).toBe('c');
  expect(change.mock.calls[0][0].detail.key).toBe('c');
  expect((tabs.shadowRoot!.activeElement as HTMLElement).dataset.key).toBe('c');
});

it('keeps selection when closing an inactive tab and falls back left at the end', async () => {
  const tabs = await setup();
  tabs.items = [
    { key: 'a', label: 'A' },
    { key: 'c', label: 'C' },
    { key: 'd', label: 'D' },
  ];
  tabs.activeKey = 'c';
  await tabs.updateComplete;
  const change = vi.fn();
  tabs.addEventListener('change', change);
  tabs.shadowRoot!.querySelector<HTMLButtonElement>('.close')!.click();
  await tabs.updateComplete;
  expect(tabs.activeKey).toBe('c');
  expect(change).not.toHaveBeenCalled();
  tabs.activeKey = 'd';
  await tabs.updateComplete;
  tabs.shadowRoot!.querySelectorAll<HTMLButtonElement>('.close')[1].click();
  await tabs.updateComplete;
  expect(tabs.activeKey).toBe('c');
});

it('supports canceled close, pinned tabs and Delete', async () => {
  const tabs = await setup();
  const cancel = (event: Event) => event.preventDefault();
  tabs.addEventListener('close', cancel);
  const first = tabs.shadowRoot!.querySelector<HTMLButtonElement>('.tab')!;
  first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
  expect(tabs.items).toHaveLength(3);
  tabs.removeEventListener('close', cancel);
  first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
  await tabs.updateComplete;
  expect(tabs.items).toHaveLength(2);
  tabs.items = [{ key: 'pinned', label: '首页', closable: false }];
  await tabs.updateComplete;
  expect(tabs.shadowRoot!.querySelector('.close')).toBeNull();
  tabs
    .shadowRoot!.querySelector('.tab')!
    .dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
  expect(tabs.items).toHaveLength(1);
});

it('closes the final JSON item without resurrecting it', async () => {
  const tabs = document.createElement('su-tabs');
  tabs.itemsJson = '[{"key":"a","label":"A","closable":true}]';
  document.body.append(tabs);
  await tabs.updateComplete;
  const change = vi.fn();
  tabs.addEventListener('change', change);
  tabs.shadowRoot!.querySelector<HTMLButtonElement>('.close')!.click();
  await tabs.updateComplete;
  expect(tabs.itemsJson).toBe('');
  expect(tabs.shadowRoot!.querySelector('.tab')).toBeNull();
  expect(change.mock.calls[0][0].detail).toEqual({ key: '', item: undefined });
});

it('normalizes malformed entries and falls back from missing keys', async () => {
  const tabs = await setup();
  tabs.items = [
    null,
    { key: 'a', label: 'A' },
    { key: 'a', label: 'Duplicate' },
    { key: '', label: 'Empty' },
  ] as typeof tabs.items;
  tabs.activeKey = 'removed';
  await tabs.updateComplete;
  expect(tabs.shadowRoot!.querySelectorAll('.tab')).toHaveLength(1);
  expect(tabs.shadowRoot!.querySelector('.tab')!.getAttribute('aria-selected')).toBe('true');
  tabs.items = null as unknown as typeof tabs.items;
  tabs.itemsJson = '[null, {"label":"Missing key"}]';
  await tabs.updateComplete;
  expect(tabs.shadowRoot!.querySelector('.tab')).toBeNull();
});

it('navigates relative to focus rather than selection', async () => {
  const tabs = await setup();
  const last = tabs.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tab')[2];
  last.focus();
  last.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  await tabs.updateComplete;
  expect((tabs.shadowRoot!.activeElement as HTMLElement).dataset.key).toBe('a');
});

it('does not emit close for a tab removed before the next render', async () => {
  const tabs = await setup();
  const button = tabs.shadowRoot!.querySelector<HTMLButtonElement>('.close')!;
  const close = vi.fn();
  tabs.addEventListener('close', close);
  tabs.items = tabs.items.slice(1);
  button.click();
  expect(close).not.toHaveBeenCalled();
  await tabs.updateComplete;
});

it('does not steal focus from a dialog opened by a change listener', async () => {
  const tabs = await setup();
  const external = document.createElement('button');
  document.body.append(external);
  tabs.addEventListener('change', () => external.focus());
  tabs.shadowRoot!.querySelector<HTMLButtonElement>('.close')!.focus();
  tabs.shadowRoot!.querySelector<HTMLButtonElement>('.close')!.click();
  await tabs.updateComplete;
  expect(document.activeElement).toBe(external);
});

it('preserves tab and panel identity when items reorder', async () => {
  const tabs = await setup();
  const tab = tabs.shadowRoot!.querySelector('.tab[data-key="a"]')!;
  const panel = tabs.shadowRoot!.getElementById(tab.getAttribute('aria-controls')!)!;
  tabs.items = [...tabs.items].reverse();
  await tabs.updateComplete;
  const reordered = tabs.shadowRoot!.querySelector('.tab[data-key="a"]')!;
  expect(reordered).toBe(tab);
  expect(tabs.shadowRoot!.getElementById(reordered.getAttribute('aria-controls')!)!).toBe(panel);
});

it('does not override focus moved by a keyboard change listener', async () => {
  const tabs = await setup();
  const external = document.createElement('button');
  document.body.append(external);
  tabs.addEventListener('change', () => external.focus());
  const first = tabs.shadowRoot!.querySelector<HTMLButtonElement>('.tab')!;
  first.focus();
  first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  await tabs.updateComplete;
  expect(tabs.activeKey).toBe('c');
  expect(document.activeElement).toBe(external);
});

it('restores focus after closing a tab inside another shadow host', async () => {
  const tabs = await setup();
  const wrapper = document.createElement('div');
  wrapper.attachShadow({ mode: 'open' }).append(tabs);
  document.body.append(wrapper);
  await tabs.updateComplete;
  const close = tabs.shadowRoot!.querySelector<HTMLButtonElement>('.close')!;
  close.focus();
  close.click();
  await tabs.updateComplete;
  expect((tabs.shadowRoot!.activeElement as HTMLElement)?.dataset.key).toBe('c');
});
