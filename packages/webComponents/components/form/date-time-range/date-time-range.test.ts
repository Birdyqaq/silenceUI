import { afterEach, expect, it, vi } from 'vitest';
import './index';
import { dateTimeError, isValidDateTime } from '../../_shared/date-time';
import { getFormController } from '../../_shared/form';

afterEach(() => document.body.replaceChildren());

it.each(['2024-02-29T23:59', '0001-01-01T00:00', '9999-12-31T23:59'])(
  'accepts calendar minute value %s',
  (value) => expect(isValidDateTime(value)).toBe(true)
);
it.each([
  '2023-02-29T12:00',
  '2026-11-04 12:00',
  '2026-11-04T24:00',
  '2026-11-04T12:00Z',
  '2026-11-04T12:00:00',
  '0000-01-01T00:00',
  null,
])('rejects unsupported value %s', (value) => expect(isValidDateTime(value)).toBe(false));
it('validates boundaries without timezone conversion', () => {
  expect(dateTimeError('2026-11-05T01:00', '2026-11-04T23:00', '2026-11-05T02:00')).toBe('');
  expect(dateTimeError('', 'bad', '')).toContain('边界');
  expect(dateTimeError('', '2026-11-05T01:00', '2026-11-04T23:00')).toContain('min');
  expect(dateTimeError('2026-11-04T22:00', '2026-11-04T23:00', '')).toContain('min');
  expect(dateTimeError('2026-11-05T03:00', '', '2026-11-05T02:00')).toContain('max');
});

async function mount() {
  const range = document.createElement('su-date-time-range');
  range.value = ['2026-11-04T23:00', '2026-11-05T07:00'];
  document.body.append(range);
  await range.updateComplete;
  return range;
}

it('keeps partial, reversed and malformed ranges invalid', async () => {
  const range = await mount();
  const form = getFormController(range)!;
  expect(form.checkValidity()).toBe(true);
  for (const value of [
    ['2026-11-04T23:00', ''],
    ['2026-11-05T07:00', '2026-11-04T23:00'],
    ['bad', '2026-11-05T07:00'],
    ['2026-11-04T23:00'],
    null,
    new Array(2),
  ]) {
    range.value = value as typeof range.value;
    await range.updateComplete;
    expect(form.checkValidity()).toBe(false);
  }
  range.value = ['', ''];
  await range.updateComplete;
  expect(form.checkValidity()).toBe(true);
});

it('emits isolated values only for current enabled user changes and resets silently', async () => {
  const range = await mount();
  const original = range.value;
  const changes = vi.fn((event: Event) => {
    (event as CustomEvent).detail.value[0] = 'modified-by-listener';
  });
  range.addEventListener('change', changes);
  const input = range.shadowRoot!.querySelector('input')!;
  input.value = '2026-11-04T22:00';
  input.dispatchEvent(new Event('change', { bubbles: true }));
  expect(range.value[0]).toBe('2026-11-04T22:00');
  expect(original[0]).toBe('2026-11-04T23:00');
  expect(changes).toHaveBeenCalledOnce();
  input.dispatchEvent(new Event('change'));
  expect(changes).toHaveBeenCalledOnce();
  range.readonly = true;
  input.value = '2026-11-04T21:00';
  input.dispatchEvent(new Event('change'));
  expect(range.value[0]).toBe('2026-11-04T22:00');
  range.formResetCallback();
  await range.updateComplete;
  expect(range.value).toEqual(original);
  expect(changes).toHaveBeenCalledOnce();
  range.readonly = false;
  range.remove();
  input.dispatchEvent(new Event('change'));
  expect(changes).toHaveBeenCalledOnce();
});
