import { afterEach, describe, expect, it } from 'vitest';
import './index';
import '../form';
import { getFormController } from '../../_shared/form';

afterEach(() => document.body.replaceChildren());

async function createRange(value: [string, string]) {
  const range = document.createElement('su-date-range');
  range.value = value;
  range.name = 'period';
  document.body.append(range);
  await range.updateComplete;
  return range;
}

describe('date range validation', () => {
  it.each(['2026-02-29', '2026-04-31', '0000-01-01', '2026-1-01', 'not-a-date'])(
    'rejects programmatic calendar value %s even when the native input sanitizes it',
    async (date) => {
      const range = await createRange([date, '2026-12-31']);
      const controller = getFormController(range)!;
      expect(range.shadowRoot!.querySelector<HTMLInputElement>('#start')!.value).toBe('');
      expect(controller.checkValidity()).toBe(false);
      expect(controller.validationMessage).toContain('开始日期格式无效');
      // Preserve the source value so callers can fix it rather than silently losing submitted data.
      expect(range.value[0]).toBe(date);
    }
  );

  it('accepts a real leap day and optional empty values, and recovers after correction', async () => {
    const range = await createRange(['2024-02-29', '2024-03-01']);
    expect(getFormController(range)!.checkValidity()).toBe(true);
    range.value = ['2025-02-29', '2025-03-01'];
    await range.updateComplete;
    expect(getFormController(range)!.checkValidity()).toBe(false);
    range.value = ['', ''];
    await range.updateComplete;
    expect(getFormController(range)!.checkValidity()).toBe(true);
    range.required = true;
    await range.updateComplete;
    expect(getFormController(range)!.checkValidity()).toBe(false);
  });

  it.each([null, ['2026-01-01'], ['2026-01-01', 5], ['2026-01-01', '', 'extra']])(
    'reports malformed range shape without breaking rendering: %j',
    async (value) => {
      const range = await createRange(value as never);
      expect(range.shadowRoot!.querySelectorAll('input')).toHaveLength(2);
      expect(getFormController(range)!.validationMessage).toContain('两个日期字符串');
      range.value = ['2026-01-01', '2026-01-02'];
      await range.updateComplete;
      expect(getFormController(range)!.checkValidity()).toBe(true);
    }
  );

  it('focuses an invalid end date during form validation and clears errors after fixing it', async () => {
    const form = document.createElement('su-form');
    const range = document.createElement('su-date-range');
    range.name = 'period';
    range.value = ['2026-02-01', '2026-01-01'];
    form.append(range);
    document.body.append(form);
    await range.updateComplete;
    expect(await form.validate()).toBe(false);
    expect(range.shadowRoot!.activeElement?.id).toBe('end');
    range.value = ['2026-02-01', '2026-02-02'];
    await range.updateComplete;
    expect(await form.validate()).toBe(true);
    expect(range.shadowRoot!.querySelector('#end')!.getAttribute('aria-invalid')).toBe('false');
  });

  it('does not steal focus or block validation while disabled', async () => {
    const range = await createRange(['invalid', '2026-01-01']);
    range.disabled = true;
    await range.updateComplete;
    const before = document.activeElement;
    range.focus();
    expect(document.activeElement).toBe(before);
    expect(getFormController(range)!.checkValidity()).toBe(true);
    range.disabled = false;
    await range.updateComplete;
    expect(getFormController(range)!.checkValidity()).toBe(false);
  });
});
