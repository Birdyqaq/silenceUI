import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
});

test('week schedule shows a cross-year week and selects an entry on a narrow screen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 760 });
  await page.evaluate(() => {
    const schedule = document.createElement('su-week-schedule');
    schedule.date = '2027-01-01';
    schedule.items = [{ id: 'handover', date: '2026-12-31', title: '夜班交接' }];
    schedule.addEventListener('item-select', (event) => {
      schedule.dataset.selected = (event as CustomEvent).detail.item.id;
    });
    document.querySelector('main')!.replaceChildren(schedule);
  });
  const schedule = page.locator('su-week-schedule');
  await expect(schedule.getByText('2026-12-28 至 2027-01-03')).toBeVisible();
  await schedule.getByRole('button', { name: '夜班交接' }).press('Enter');
  await expect(schedule).toHaveAttribute('data-selected', 'handover');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await schedule.getByRole('button', { name: '下一周' }).click();
  await expect(schedule.getByText('2027-01-04 至 2027-01-10')).toBeVisible();
});

test('sortable list supports keyboard movement, focus recovery and dragging', async ({ page }) => {
  await page.evaluate(() => {
    const list = document.createElement('su-sortable-list');
    list.items = [
      { key: 'a', label: '工作台' },
      { key: 'b', label: '成员管理' },
    ];
    document.querySelector('main')!.replaceChildren(list);
  });
  const list = page.locator('su-sortable-list');
  await list.getByRole('button', { name: '下移 工作台' }).press('Enter');
  await expect(list.getByRole('listitem').first()).toContainText('成员管理');
  await expect(list.getByRole('button', { name: '上移 工作台' })).toBeFocused();
  await list.locator('[data-key="a"] [draggable="true"]').dragTo(list.locator('[data-key="b"]'));
  await expect(list.getByRole('listitem').first()).toContainText('工作台');
});
