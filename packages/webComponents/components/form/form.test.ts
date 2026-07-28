import { afterEach, describe, expect, it, vi } from 'vitest';
import { FormValueController } from '../_shared/form';
import '../input';
import './checkbox';
import './select';
import './switch';

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
      { label: '北京', value: 'bj' }
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
});
