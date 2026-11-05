import { afterEach, expect, it, vi } from 'vitest';
import './index';

afterEach(() => document.body.replaceChildren());

it('starts on Monday across a year boundary and emits the next Monday', async () => {
  const schedule = document.createElement('su-week-schedule');
  schedule.date = '2027-01-01';
  schedule.items = [
    { id: 'shift', date: '2026-12-31', title: '跨年值班' },
    { id: 'later', date: '2027-01-04', title: '下一周值班' },
  ];
  const change = vi.fn();
  schedule.addEventListener('week-change', change);
  document.body.append(schedule);
  await schedule.updateComplete;
  const root = schedule.shadowRoot!;
  expect(root.querySelector('strong')?.textContent).toBe('2026-12-28 至 2027-01-03');
  expect(root.textContent).toContain('跨年值班');
  expect(root.textContent).not.toContain('下一周值班');
  root.querySelectorAll('header button')[1].dispatchEvent(new MouseEvent('click'));
  await schedule.updateComplete;
  expect(change.mock.calls[0][0].detail).toEqual({ start: '2027-01-04' });
  expect(root.textContent).toContain('下一周值班');
});

it('disables navigation beyond the four-digit year range', async () => {
  const schedule = document.createElement('su-week-schedule');
  schedule.date = '0001-01-01';
  document.body.append(schedule);
  await schedule.updateComplete;
  const controls = schedule.shadowRoot!.querySelectorAll<HTMLButtonElement>('header button');
  expect(controls[0].disabled).toBe(true);
  schedule.date = '9999-12-31';
  await schedule.updateComplete;
  expect(controls[1].disabled).toBe(true);
  expect(schedule.shadowRoot!.querySelector('strong')?.textContent).toBe(
    '9999-12-27 至 9999-12-31'
  );
});
