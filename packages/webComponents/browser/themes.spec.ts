import { expect, test, type Locator } from '@playwright/test';

const coloredButtonTypes = ['primary', 'success', 'warning', 'danger', 'info'] as const;

function textContrast(button: Locator) {
  return button.evaluate((element) => {
    const luminance = (color: string) => {
      const [r, g, b] = color.match(/[\d.]+/g)!.map((value) => {
        const srgb = Number(value) / 255;
        return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const { color, backgroundColor } = getComputedStyle(element);
    const foreground = luminance(color);
    const background = luminance(backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
}

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

  test(`${theme} colored buttons meet normal text contrast before and during hover`, async ({ page }) => {
    await page.goto(`/browser/fixture.html?theme=${theme === 'dark' ? 'dark' : 'light'}${theme === 'brand' ? '&brand=1' : ''}`);
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
    await page.evaluate((types) => {
      const row = document.createElement('div');
      for (const type of types) {
        const button = document.createElement('su-button');
        button.type = type;
        button.textContent = type;
        row.append(button);
      }
      document.querySelector('main')!.prepend(row);
    }, coloredButtonTypes);

    for (const type of coloredButtonTypes) {
      const button = page.getByRole('button', { name: type, exact: true });
      expect(await textContrast(button), `${type} before hover`).toBeGreaterThanOrEqual(4.5);
      await button.hover();
      expect(await textContrast(button), `${type} on hover`).toBeGreaterThanOrEqual(4.5);
    }
  });
}
