import { expect, test } from '@playwright/test';

test('stat card keeps metric slots and theme parts usable at narrow widths', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => {
    document.querySelector('main')!.innerHTML = `
      <su-stat-card title="月度营收" value="1,234,567,890.00" trend="较上月增长 12.5%" trendType="up">
        <span slot="prefix">¥</span><span slot="suffix">元</span>
      </su-stat-card>`;
  });
  const card = page.locator('su-stat-card');
  await expect
    .poll(() =>
      card.evaluate((element) => {
        const root = element.shadowRoot!;
        return {
          title: root.querySelector('[part="title"]')!.textContent,
          prefix: root.querySelector<HTMLSlotElement>('slot[name="prefix"]')!.assignedElements()[0]
            ?.textContent,
          suffix: root.querySelector<HTMLSlotElement>('slot[name="suffix"]')!.assignedElements()[0]
            ?.textContent,
          trend: root.querySelector('[part="trend"]')!.textContent!.replace(/\s+/g, ''),
        };
      })
    )
    .toEqual({ title: '月度营收', prefix: '¥', suffix: '元', trend: '↑较上月增长12.5%' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflow).toBe(false);
});
