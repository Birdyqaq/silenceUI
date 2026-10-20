import { afterEach, describe, expect, it, vi } from 'vitest';
import '../input';
import './select';
import './date-picker';
import './input-number';
import './textarea';
import './checkbox';
import './switch';
import './radio-group';
import './cascader';
import './upload';

const tags = [
  'su-input',
  'su-select',
  'su-date-picker',
  'su-input-number',
  'su-textarea',
  'su-checkbox',
  'su-switch',
  'su-radio-group',
  'su-cascader',
  'su-upload',
] as const;
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('native form integration', () => {
  it('keeps subnormal-sized steps and clamps overflowing additions to the intended bound', async () => {
    const control = document.createElement('su-input-number');
    control.step = 1e-120;
    document.body.append(control);
    await control.updateComplete;
    control.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="增加"]')!.click();
    await control.updateComplete;
    expect(control.value).toBe(1e-120);
    Object.assign(control, {
      value: 1e308,
      step: 1e308,
      min: -Number.MAX_VALUE,
      max: Number.MAX_VALUE,
    });
    await control.updateComplete;
    control.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="增加"]')!.click();
    await control.updateComplete;
    expect(control.value).toBe(Number.MAX_VALUE);
    control.value = -1e308;
    await control.updateComplete;
    control.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="减少"]')!.click();
    await control.updateComplete;
    expect(control.value).toBe(-Number.MAX_VALUE);
  });
  it.each(tags)('%s reflects a property-assigned field name and supports removal', async (tag) => {
    const control = document.createElement(tag);
    control.name = 'profile';
    document.body.append(control);
    await control.updateComplete;
    expect(control.getAttribute('name')).toBe('profile');
    control.name = 'renamed';
    await control.updateComplete;
    expect(control.getAttribute('name')).toBe('renamed');
    control.removeAttribute('name');
    await control.updateComplete;
    expect(control.name).toBe('');
  });

  it.each(tags)(
    '%s disables its native control without overwriting explicit disabled',
    async (tag) => {
      const control = document.createElement(tag);
      if (tag === 'su-radio-group')
        (control as HTMLElementTagNameMap['su-radio-group']).options = [{ value: 'a', label: 'A' }];
      document.body.append(control);
      await control.updateComplete;
      control.formDisabledCallback(true);
      await control.updateComplete;
      const fields = Array.from(
        control.shadowRoot!.querySelectorAll<HTMLInputElement | HTMLButtonElement>(
          'input, select, textarea, button'
        )
      );
      expect(fields.length).toBeGreaterThan(0);
      expect(fields.every((field) => field.disabled)).toBe(true);
      expect(control.disabled).toBe(false);
      expect(control.hasAttribute('disabled')).toBe(false);
      control.disabled = true;
      control.formDisabledCallback(false);
      await control.updateComplete;
      expect(fields.every((field) => field.disabled)).toBe(true);
      control.disabled = false;
      await control.updateComplete;
      expect(fields.some((field) => !field.disabled)).toBe(true);
    }
  );

  it('excludes inherited-disabled values and restores the current value on enable', async () => {
    const setFormValue = vi.fn();
    vi.spyOn(HTMLElement.prototype, 'attachInternals').mockReturnValue({
      setFormValue,
    } as unknown as ElementInternals);
    const input = document.createElement('su-input');
    input.value = 'saved';
    document.body.append(input);
    await input.updateComplete;
    expect(setFormValue).toHaveBeenLastCalledWith('saved');
    input.formDisabledCallback(true);
    expect(setFormValue).toHaveBeenLastCalledWith(null);
    input.value = 'updated';
    await input.updateComplete;
    expect(setFormValue).toHaveBeenLastCalledWith(null);
    input.formDisabledCallback(false);
    await input.updateComplete;
    expect(setFormValue).toHaveBeenLastCalledWith('updated');
  });

  it('closes an open cascader when inherited-disabled and prevents selection', async () => {
    const control = document.createElement('su-cascader');
    control.options = [{ value: 'sh', label: '上海' }];
    control.open = true;
    document.body.append(control);
    await control.updateComplete;
    const option = control.shadowRoot!.querySelector<HTMLButtonElement>('.option')!;
    const change = vi.fn();
    control.addEventListener('change', change);
    control.formDisabledCallback(true);
    option.click();
    await control.updateComplete;
    expect(control.open).toBe(false);
    expect(change).not.toHaveBeenCalled();
  });

  it('does not create a submitted random name for unnamed radio groups', async () => {
    const control = document.createElement('su-radio-group');
    control.options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ];
    document.body.append(control);
    await control.updateComplete;
    expect(control.name).toBe('');
    const inputs = Array.from(control.shadowRoot!.querySelectorAll('input'));
    expect(inputs[0].name).toBeTruthy();
    expect(inputs[0].name).toBe(inputs[1].name);
  });
});
