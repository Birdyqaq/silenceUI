import { afterEach, expect, it, vi } from 'vitest';
import './index';

afterEach(() => document.body.replaceChildren());

it('requests page and read changes and leaves the displayed state to the host', async () => {
  const center = document.createElement('su-notification-center');
  center.items = [{ id: 'shift', title: '排班提醒' }];
  center.totalPages = 2;
  const onPage = vi.fn();
  const onRead = vi.fn();
  center.addEventListener('page-change', onPage);
  center.addEventListener('read-request', onRead);
  document.body.append(center);
  await center.updateComplete;
  const [read, previous, next] = center.shadowRoot!.querySelectorAll('button');
  expect(previous.disabled).toBe(true);
  next.click();
  read.click();
  expect(onPage.mock.calls[0][0].detail).toEqual({ page: 2 });
  expect(onRead.mock.calls[0][0].detail).toEqual({ id: 'shift' });
  expect(center.page).toBe(1);
  expect(center.items[0].read).toBeUndefined();
  center.loading = true;
  await center.updateComplete;
  next.click();
  read.click();
  expect(onPage).toHaveBeenCalledOnce();
  expect(onRead).toHaveBeenCalledOnce();
});
