import { afterEach, describe, expect, it, vi } from 'vitest';
import './data/tree';
import './navigation/dropdown';
import './form/upload';

afterEach(() => document.body.replaceChildren());

describe('dynamic interaction state', () => {
  it('keeps the tree tab stop on keyboard focus without changing selection', async () => {
    const tree = document.createElement('su-tree');
    tree.nodes = [
      { key: 'first', label: 'First' },
      { key: 'disabled', label: 'Disabled', disabled: true },
      { key: 'last', label: 'Last' },
    ];
    tree.selectedKey = 'first';
    const select = vi.fn();
    tree.addEventListener('select', select);
    document.body.append(tree);
    await tree.updateComplete;
    const first = tree.shadowRoot!.querySelector<HTMLButtonElement>('.label')!;
    first.focus();
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await tree.updateComplete;

    expect(tree.shadowRoot!.activeElement?.getAttribute('data-key')).toBe('last');
    expect(tree.shadowRoot!.querySelector('.label[tabindex="0"]')?.getAttribute('data-key')).toBe(
      'last'
    );
    expect(tree.selectedKey).toBe('first');
    expect(select).not.toHaveBeenCalled();
  });

  it('tracks pointer focus and falls back when the focused tree node is removed', async () => {
    const tree = document.createElement('su-tree');
    tree.nodes = [
      { key: 'first', label: 'First' },
      { key: 'last', label: 'Last' },
    ];
    document.body.append(tree);
    await tree.updateComplete;
    tree.shadowRoot!.querySelector<HTMLButtonElement>('[data-key="last"]')!.focus();
    await tree.updateComplete;
    expect(tree.shadowRoot!.querySelector('.label[tabindex="0"]')?.getAttribute('data-key')).toBe(
      'last'
    );
    tree.nodes = [tree.nodes[0]];
    await tree.updateComplete;
    expect(tree.shadowRoot!.querySelector('.label[tabindex="0"]')?.getAttribute('data-key')).toBe(
      'first'
    );
  });

  it('closes a disabled dropdown and ignores a click before its next render', async () => {
    const dropdown = document.createElement('su-dropdown');
    dropdown.items = [{ key: 'edit', label: 'Edit' }];
    dropdown.open = true;
    const select = vi.fn();
    dropdown.addEventListener('select', select);
    document.body.append(dropdown);
    await dropdown.updateComplete;
    dropdown.disabled = true;
    dropdown.shadowRoot!.querySelector<HTMLButtonElement>('.item')!.click();
    await dropdown.updateComplete;
    expect(select).not.toHaveBeenCalled();
    expect(dropdown.open).toBe(false);
    expect(dropdown.shadowRoot!.querySelector('.menu')).toBeNull();
    expect(dropdown.shadowRoot!.querySelector('.trigger')?.getAttribute('aria-disabled')).toBe(
      'true'
    );
    dropdown.disabled = false;
    await dropdown.updateComplete;
    expect(dropdown.open).toBe(false);
  });

  it('does not allow a disabled dropdown to be opened through its property', async () => {
    const dropdown = document.createElement('su-dropdown');
    dropdown.disabled = true;
    document.body.append(dropdown);
    await dropdown.updateComplete;
    dropdown.open = true;
    await dropdown.updateComplete;
    expect(dropdown.open).toBe(false);
    expect(dropdown.hasAttribute('open')).toBe(false);
    expect(dropdown.shadowRoot!.querySelector('.menu')).toBeNull();
  });

  it.each(['property', 'fieldset'])('cancels file drops while disabled via %s', async (source) => {
    const upload = document.createElement('su-upload');
    const initial = new File(['initial'], 'initial.txt');
    upload.files = [initial];
    const change = vi.fn();
    const reject = vi.fn();
    upload.addEventListener('change', change);
    upload.addEventListener('reject', reject);
    document.body.append(upload);
    await upload.updateComplete;
    const picker = upload.shadowRoot!.querySelector('.picker')!;
    picker.dispatchEvent(new Event('dragover', { cancelable: true }));
    await upload.updateComplete;
    expect(picker.classList.contains('dragging')).toBe(true);
    if (source === 'property') upload.disabled = true;
    else upload.formDisabledCallback(true);
    await upload.updateComplete;
    expect(picker.classList.contains('dragging')).toBe(false);
    const over = new Event('dragover', { cancelable: true });
    picker.dispatchEvent(over);
    const drop = new Event('drop', { cancelable: true });
    Object.defineProperty(drop, 'dataTransfer', {
      value: { files: [new File(['new'], 'new.txt')] },
    });
    picker.dispatchEvent(drop);
    await upload.updateComplete;
    expect(over.defaultPrevented).toBe(true);
    expect(drop.defaultPrevented).toBe(true);
    expect(upload.files).toEqual([initial]);
    expect(change).not.toHaveBeenCalled();
    expect(reject).not.toHaveBeenCalled();
    expect(picker.classList.contains('dragging')).toBe(false);
  });
});
