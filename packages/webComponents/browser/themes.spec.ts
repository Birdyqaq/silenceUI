import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark', 'brand']) {
  for (const width of [1440, 390]) {
    test(`${theme} theme at ${width}px keeps form controls usable`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/browser/fixture.html?theme=${theme === 'dark' ? 'dark' : 'light'}${theme === 'brand' ? '&brand=1' : ''}`);
      await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
      await expect(page.locator('#department .trigger')).toBeVisible();
      await expect(page.locator('#username input')).toHaveCSS('background-color', theme === 'dark' ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)');
      if (theme === 'brand') {
        await expect(page.locator('html')).toHaveCSS('--su-color-primary', '#7c3aed');
        await page.locator('#username input').focus();
        await expect(page.locator('#username input')).toHaveCSS('border-top-color', 'rgb(124, 58, 237)');
      }
      const geometry = await page.locator('#roles').evaluate((el) => {
        const left = el.shadowRoot!.querySelector('.left')!.getBoundingClientRect();
        const right = el.shadowRoot!.querySelector('.right')!.getBoundingClientRect();
        return { stacked: right.top > left.bottom, scroll: document.documentElement.scrollWidth, viewport: innerWidth };
      });
      expect(geometry.scroll).toBeLessThanOrEqual(geometry.viewport);
      expect(geometry.stacked).toBe(width === 390);
      await page.locator('#department .trigger').focus();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Escape');
      await expect(page.locator('#department .trigger')).toBeFocused();
      await testInfo.attach(`${theme}-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
    });
  }
}
