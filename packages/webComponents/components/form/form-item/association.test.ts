import { afterEach, describe, expect, it } from 'vitest';
import './index';
import '../../input';
import '../select';

afterEach(() => document.body.replaceChildren());

describe('dynamic FormItem association', () => {
  it('updates unnamed control labels and restores them when the item label is cleared', async () => {
    const item = document.createElement('su-form-item');
    const input = document.createElement('su-input');
    item.label = 'First';
    item.append(input);
    document.body.append(item);
    await input.updateComplete;
    await item.updateComplete;
    const native = input.shadowRoot!.querySelector('input')!;
    expect(native.getAttribute('aria-label')).toBe('First');
    item.label = 'Second';
    await item.updateComplete;
    expect(native.getAttribute('aria-label')).toBe('Second');
    item.label = '';
    await item.updateComplete;
    expect(native.hasAttribute('aria-label')).toBe(false);
  });

  it('restores the select placeholder name after removing an inherited label', async () => {
    const item = document.createElement('su-form-item');
    const select = document.createElement('su-select');
    select.placeholder = 'Select role';
    item.label = 'Role';
    item.append(select);
    document.body.append(item);
    await select.updateComplete;
    await item.updateComplete;
    const native = select.shadowRoot!.querySelector('select')!;
    expect(native.getAttribute('aria-label')).toBe('Role');
    item.label = '';
    await item.updateComplete;
    expect(native.getAttribute('aria-label')).toBe('Select role');
  });

  it('clears stale labels and descriptions when a rendered control is moved outside FormItem', async () => {
    const item = document.createElement('su-form-item');
    const input = document.createElement('su-input');
    input.helperText = 'Own helper';
    item.label = 'Parent';
    item.message = 'Parent helper';
    item.append(input);
    document.body.append(item);
    await input.updateComplete;
    await item.updateComplete;
    const native = input.shadowRoot!.querySelector('input')!;
    expect(native.getAttribute('aria-describedby')).toContain('su-form-description');
    document.body.append(input);
    await input.updateComplete;
    expect(native.hasAttribute('aria-label')).toBe(false);
    expect(native.getAttribute('aria-describedby')).toBe('helper-text');
    expect(input.shadowRoot!.querySelector('#su-form-description')!.textContent).toBe('');
  });

  it('keeps an explicit control label and author override when FormItem changes', async () => {
    const item = document.createElement('su-form-item');
    const input = document.createElement('su-input');
    input.label = 'Own label';
    item.label = 'Parent';
    item.append(input);
    document.body.append(item);
    await input.updateComplete;
    await item.updateComplete;
    const native = input.shadowRoot!.querySelector('input')!;
    expect(native.hasAttribute('aria-label')).toBe(false);
    input.label = '';
    await input.updateComplete;
    expect(native.getAttribute('aria-label')).toBe('Parent');
    native.setAttribute('aria-label', 'Business label');
    item.label = '';
    await item.updateComplete;
    expect(native.getAttribute('aria-label')).toBe('Business label');
  });
});
