import { afterEach, expect, it, vi } from 'vitest';
import './index';
import { getFormController } from '../../_shared/form';
import { timeError, timeMinutes } from '../../_shared/time';
afterEach(() => document.body.replaceChildren());
async function mount() {
  const el = document.createElement('su-time-picker');
  document.body.append(el);
  await el.updateComplete;
  return el;
}
it.each(['00:00', '09:05', '23:59'])('parses %s', (value) =>
  expect(timeMinutes(value)).not.toBeNull()
);
it.each(['9:00', '24:00', '12:60', '12:00:00', ' 09:00', null, 900])('rejects %s', (value) =>
  expect(timeMinutes(value)).toBeNull()
);
it('validates boundaries and step without UTC or clamping', () => {
  expect(timeError('09:15', '09:00', '18:00', 900)).toBe('');
  expect(timeError('09:05', '09:00', '18:00', 900)).toContain('step');
  expect(timeError('08:00', '09:00', '', 60)).toContain('min');
  expect(timeError('19:00', '', '18:00', 60)).toContain('max');
  expect(timeError('', '23:00', '01:00', 60)).toContain('跨日');
  expect(timeError('', 'bad', '', 60)).toContain('边界');
  for (const step of [0, -60, 1, 90, Infinity, NaN])
    expect(timeError('', '', '', step)).toContain('step');
});
it('only emits actual enabled, connected user edits', async () => {
  const el = await mount();
  const change = vi.fn();
  el.addEventListener('change', change);
  el.value = '09:00';
  await el.updateComplete;
  expect(change).not.toHaveBeenCalled();
  const input = el.shadowRoot!.querySelector('input')!;
  input.value = '10:00';
  input.dispatchEvent(new Event('change', { bubbles: true }));
  expect(el.value).toBe('10:00');
  expect(change).toHaveBeenCalledOnce();
  input.dispatchEvent(new Event('change'));
  expect(change).toHaveBeenCalledOnce();
  el.readonly = true;
  await el.updateComplete;
  input.value = '11:00';
  input.dispatchEvent(new Event('change'));
  expect(el.value).toBe('10:00');
  el.readonly = false;
  el.formDisabledCallback(true);
  await el.updateComplete;
  expect(input.disabled).toBe(true);
  input.dispatchEvent(new Event('change'));
  expect(el.value).toBe('10:00');
  el.formDisabledCallback(false);
  el.remove();
  input.dispatchEvent(new Event('change'));
  expect(change).toHaveBeenCalledOnce();
});
it('reports invalid program data and dynamic constraints', async () => {
  const el = await mount();
  el.value = '09:05';
  el.step = 900;
  await el.updateComplete;
  expect(getFormController(el)!.checkValidity()).toBe(false);
  el.step = 60;
  await el.updateComplete;
  expect(getFormController(el)!.checkValidity()).toBe(true);
  el.value = '09:05:00';
  await el.updateComplete;
  expect(el.value).toBe('09:05:00');
  expect(el.shadowRoot!.querySelector('input')!.value).toBe('');
  expect(getFormController(el)!.validationMessage).toContain('HH:mm');
});
it('restores and resets without events; reflects and removes name', async () => {
  const el = document.createElement('su-time-picker');
  el.value = '08:30';
  document.body.append(el);
  await el.updateComplete;
  const change = vi.fn();
  el.addEventListener('change', change);
  el.formStateRestoreCallback('12:45');
  await el.updateComplete;
  expect(el.value).toBe('12:45');
  el.formResetCallback();
  await el.updateComplete;
  expect(el.value).toBe('08:30');
  expect(change).not.toHaveBeenCalled();
  el.name = 'time';
  await el.updateComplete;
  expect(el.getAttribute('name')).toBe('time');
  el.removeAttribute('name');
  await el.updateComplete;
  expect(el.name).toBe('');
});
