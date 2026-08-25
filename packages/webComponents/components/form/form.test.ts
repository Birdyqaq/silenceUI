import { afterEach, describe, expect, it, vi } from 'vitest';
import { FormValueController } from '../_shared/form';
import '../input';
import './checkbox';
import './date-picker';
import './form-item';
import './input-number';
import './radio-group';
import './select';
import './switch';
import './textarea';

afterEach(() => {
  document.body.replaceChildren();
});

describe('form controls', () => {
  it('syncs values through ElementInternals when supported', () => {
    const setFormValue = vi.fn();
    const host = {
      addController: vi.fn(),
      attachInternals: () => ({ setFormValue }),
    } as unknown as HTMLElement & { addController(controller: unknown): void };

    const controller = new FormValueController(host as never, () => 'hello');
    controller.hostUpdated();

    expect(setFormValue).toHaveBeenCalledWith('hello');
  });

  it('restores the initial input value on form reset', async () => {
    const input = document.createElement('su-input');
    input.setAttribute('value', 'initial');
    document.body.append(input);
    await input.updateComplete;

    input.value = 'changed';
    input.formResetCallback();

    expect(input.value).toBe('initial');
  });

  it('applies an initial select value after rendering its options', async () => {
    const select = document.createElement('su-select');
    select.value = 'sh';
    select.options = [
      { label: '上海', value: 'sh' },
      { label: '北京', value: 'bj' },
    ];
    document.body.append(select);
    await select.updateComplete;

    expect(select.shadowRoot?.querySelector('select')?.value).toBe('sh');
  });

  it('exposes switch state to assistive technology', async () => {
    const element = document.createElement('su-switch');
    document.body.append(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.getAttribute('role')).toBe('switch');
    expect(button?.getAttribute('aria-checked')).toBe('false');

    button?.click();
    await element.updateComplete;
    expect(button?.getAttribute('aria-checked')).toBe('true');
  });

  it('emits checkbox changes and restores its initial state on reset', async () => {
    const checkbox = document.createElement('su-checkbox') as HTMLElement & {
      checked: boolean;
      formResetCallback(): void;
    };
    checkbox.checked = false;
    const onChange = vi.fn();
    checkbox.addEventListener('change', onChange);
    document.body.append(checkbox);
    await (checkbox as typeof checkbox & { updateComplete: Promise<unknown> }).updateComplete;

    const input = checkbox.shadowRoot?.querySelector<HTMLInputElement>('input');
    input!.checked = true;
    input!.dispatchEvent(new Event('change', { bubbles: true }));
    await (checkbox as typeof checkbox & { updateComplete: Promise<unknown> }).updateComplete;

    expect(checkbox.checked).toBe(true);
    expect(onChange.mock.calls[0][0].detail).toEqual({ checked: true });
    checkbox.formResetCallback();
    expect(checkbox.checked).toBe(false);
  });

  it('clamps input-number changes and emits the next value', async () => {
    const inputNumber = document.createElement('su-input-number') as HTMLElement & {
      value: number;
      min: number;
      max: number;
      updateComplete: Promise<unknown>;
    };
    inputNumber.value = 2;
    inputNumber.min = 0;
    inputNumber.max = 3;
    const onChange = vi.fn();
    inputNumber.addEventListener('change', onChange);
    document.body.append(inputNumber);
    await inputNumber.updateComplete;

    inputNumber.shadowRoot?.querySelector<HTMLButtonElement>('button:last-of-type')?.click();
    await inputNumber.updateComplete;
    expect(inputNumber.value).toBe(3);
    expect(onChange.mock.calls[0][0].detail).toEqual({ value: 3 });

    const input = inputNumber.shadowRoot?.querySelector<HTMLInputElement>('input');
    input!.value = '-10';
    input!.dispatchEvent(new Event('change', { bubbles: true }));
    await inputNumber.updateComplete;
    expect(inputNumber.value).toBe(0);
  });

  it('emits textarea input changes and resets the initial value', async () => {
    const textarea = document.createElement('su-textarea') as HTMLElement & {
      value: string;
      formResetCallback(): void;
      updateComplete: Promise<unknown>;
    };
    textarea.value = '初始内容';
    const onChange = vi.fn();
    textarea.addEventListener('input-change', onChange);
    document.body.append(textarea);
    await textarea.updateComplete;

    const input = textarea.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea');
    input!.value = '修改后的内容';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    await textarea.updateComplete;

    expect(textarea.value).toBe('修改后的内容');
    expect(onChange.mock.calls[0][0].detail).toEqual({ value: '修改后的内容' });
    textarea.formResetCallback();
    expect(textarea.value).toBe('初始内容');
  });

  it('renders radio options from JSON and reports the selected value', async () => {
    const radio = document.createElement('su-radio-group') as HTMLElement & {
      optionsJson: string;
      value: string;
      updateComplete: Promise<unknown>;
    };
    radio.optionsJson = JSON.stringify([
      { label: '上海', value: 'sh' },
      { label: '北京', value: 'bj' },
    ]);
    const onChange = vi.fn();
    radio.addEventListener('change', onChange);
    document.body.append(radio);
    await radio.updateComplete;

    const input = radio.shadowRoot?.querySelector<HTMLInputElement>('input[value="bj"]');
    input!.checked = true;
    input!.dispatchEvent(new Event('change', { bubbles: true }));
    await radio.updateComplete;

    expect(radio.value).toBe('bj');
    expect(onChange.mock.calls[0][0].detail).toEqual({ value: 'bj' });
  });

  it('renders form-item validation state and slotted control', async () => {
    const formItem = document.createElement('su-form-item') as HTMLElement & {
      label: string;
      message: string;
      status: string;
      required: boolean;
      updateComplete: Promise<unknown>;
    };
    formItem.label = '用户名';
    formItem.message = '请输入用户名';
    formItem.status = 'error';
    formItem.required = true;
    formItem.append(document.createElement('su-input'));
    document.body.append(formItem);
    await formItem.updateComplete;

    expect(formItem.shadowRoot?.querySelector('.label')?.textContent).toContain('用户名');
    expect(formItem.shadowRoot?.querySelector('.required')?.textContent).toBe('*');
    expect(formItem.shadowRoot?.querySelector('.message.error')?.textContent).toBe('请输入用户名');
    expect(formItem.shadowRoot?.querySelector('slot:not([name])')).toBeTruthy();
  });

  it('emits bounded date-picker changes and exposes its label', async () => {
    const picker = document.createElement('su-date-picker');
    picker.label = '开始日期';
    picker.min = '2026-08-01';
    picker.max = '2026-08-31';
    const onChange = vi.fn();
    picker.addEventListener('change', onChange);
    document.body.append(picker);
    await picker.updateComplete;

    const input = picker.shadowRoot?.querySelector<HTMLInputElement>('input');
    input!.value = '2026-09-10';
    input!.dispatchEvent(new Event('change', { bubbles: true }));
    await picker.updateComplete;

    expect(picker.value).toBe('2026-08-31');
    expect(input?.value).toBe('2026-08-31');
    expect(input?.getAttribute('aria-label')).toBe('开始日期');
    expect(onChange.mock.calls[0][0].detail).toEqual({ value: '2026-08-31' });
  });

  it('restores the initial date-picker value on reset and state restore', async () => {
    const picker = document.createElement('su-date-picker');
    picker.value = '2026-08-12';
    picker.min = '2026-08-01';
    picker.max = '2026-08-31';
    document.body.append(picker);
    await picker.updateComplete;

    picker.value = '2026-08-20';
    picker.formResetCallback();
    expect(picker.value).toBe('2026-08-12');

    picker.formStateRestoreCallback('2026-07-01');
    expect(picker.value).toBe('2026-08-01');
  });
});
