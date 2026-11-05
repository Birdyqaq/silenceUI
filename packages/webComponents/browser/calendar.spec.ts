import { expect, test } from '@playwright/test';

test('calendar moves across leap day and selects without losing the date slot', async ({
  page,
}) => {
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => {
    document.querySelector('main')!.innerHTML =
      '<su-calendar month="2024-02" value="2024-02-28"><span slot="day-2024-03-01">排班</span></su-calendar>';
  });
  const calendar = page.locator('su-calendar');
  await calendar.getByRole('button', { name: '2024-02-28' }).press('ArrowRight');
  const leapDay = calendar.getByRole('button', { name: '2024-02-29' });
  await expect(leapDay).toBeFocused();
  await leapDay.press('ArrowRight');
  const next = calendar.getByRole('button', { name: '2024-03-01' });
  await expect(next).toBeFocused();
  await expect(calendar).toHaveJSProperty('value', '2024-02-28');
  await next.press('Enter');
  await expect(next).toHaveAttribute('aria-pressed', 'true');
  await expect(calendar.getByText('排班')).toBeVisible();
  await calendar.getByRole('button', { name: '下个月' }).click();
  await expect(calendar.getByRole('table')).toHaveAccessibleName('2024 年 4 月');
});
