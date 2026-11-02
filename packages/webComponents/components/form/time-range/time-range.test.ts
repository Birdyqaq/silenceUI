import { afterEach, expect, it, vi } from 'vitest';
import './index';
import { getFormController } from '../../_shared/form';
afterEach(() => document.body.replaceChildren());
async function mount() {
  const el = document.createElement('su-time-range');
  document.body.append(el);
  await el.updateComplete;
  return el;
}
it('validates optional/partial/equal/reversed ranges', async () => {
  const el = await mount();
  const c = getFormController(el)!;
  expect(c.checkValidity()).toBe(true);
  for (const value of [
    ['09:00', ''],
    ['', '10:00'],
    ['23:00', '01:00'],
    ['09:00:00', '10:00'],
  ] as [string, string][]) {
    el.value = value;
    await el.updateComplete;
    expect(c.checkValidity()).toBe(false);
  }
  el.value = ['09:00', '09:00'];
  await el.updateComplete;
  expect(c.checkValidity()).toBe(true);
});
it.each([null, '09:00', [], ['09:00'], [1, 2], ['09:00', '10:00', '11:00']])(
  'rejects illegal shape %j',
  async (value) => {
    const el = await mount();
    el.value = value as unknown as [string, string];
    await el.updateComplete;
    expect(getFormController(el)!.validationMessage).toContain('数组');
  }
);
it('does not mutate caller data; submits repeated keys and ignores stale/disabled events', async () => {
  const el = await mount();
  const original: [string, string] = ['09:00', '10:00'];
  el.value = original;
  el.name = 'shift';
  await el.updateComplete;
  const change = vi.fn();
  el.addEventListener('change', change);
  const inputs = el.shadowRoot!.querySelectorAll('input');
  inputs[1].value = '11:00';
  inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
  await el.updateComplete;
  expect(original).toEqual(['09:00', '10:00']);
  change.mock.calls[0][0].detail.value[0] = '00:00';
  expect(el.value[0]).toBe('09:00');
  expect((getFormController(el)!.value as FormData).getAll('shift')).toEqual(['09:00', '11:00']);
  el.disabled = true;
  await el.updateComplete;
  inputs[0].value = '12:00';
  inputs[0].dispatchEvent(new Event('change'));
  expect(el.value[0]).toBe('09:00');
  el.disabled = false;
  await el.updateComplete;
  el.remove();
  inputs[0].dispatchEvent(new Event('change'));
  expect(change).toHaveBeenCalledOnce();
});
it('restores, resets, validates required and focuses invalid end', async () => {
  const el = document.createElement('su-time-range');
  el.name = 'shift';
  el.value = ['08:00', '17:00'];
  document.body.append(el);
  await el.updateComplete;
  const data = new FormData();
  data.append('shift', '10:00');
  data.append('shift', '09:00');
  el.formStateRestoreCallback(data);
  await el.updateComplete;
  el.focus();
  expect(el.shadowRoot!.activeElement).toBe(el.shadowRoot!.querySelectorAll('input')[1]);
  el.formResetCallback();
  await el.updateComplete;
  expect(el.value).toEqual(['08:00', '17:00']);
  el.required = true;
  el.value = ['', ''];
  await el.updateComplete;
  expect(getFormController(el)!.checkValidity()).toBe(false);
});
