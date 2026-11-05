import { expect, test } from '@playwright/test';

test('page header wraps at 390px and preserves keyboard access', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => {
    document.querySelector('main')!.innerHTML =
      '<su-page-header show-back level="2"><button slot="actions">保存</button></su-page-header>';
    document.querySelector('su-page-header')!.heading = 'LongTitle'.repeat(20);
  });
  const header = page.locator('su-page-header');
  await expect(header.getByRole('heading', { level: 2 })).toBeVisible();
  const back = header.getByRole('button', { name: '返回' });
  await back.focus();
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(header.getByRole('button', { name: '保存' })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
