import { test, expect } from '@playwright/test';
import type {} from '../types';
test.beforeEach(async ({ page }) => {
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(async () => {
    document.querySelector('main')!.innerHTML = '<se-table></se-table>';
    const t = document.querySelector('se-table')!;
    t.columns = [
      { key: 'name', label: '姓名', fixed: 'left', width: '100px' },
      { key: 'age', label: '年龄', resizable: true, filterable: true, filterType: 'number' },
      {
        key: 'city',
        label: '城市',
        filterable: true,
        filterType: 'enum',
        filterOptions: [
          { value: 'sh', label: '上海' },
          { value: 'bj', label: '北京' },
        ],
      },
    ];
    t.data = [
      { id: 1, name: 'Alice', age: 20, city: 'sh' },
      { id: 2, name: 'Bob', age: 30, city: 'bj' },
    ];
    t.columnSettings = true;
    t.pagination = false;
    await t.updateComplete;
  });
});
test('column keyboard visibility, order and width restore', async ({ page }) => {
  await page.locator('summary').press('Enter');
  await page.getByRole('button', { name: '前移city', exact: true }).press('Enter');
  await expect(page.locator('th.column-header')).toHaveText(['姓名', '城市', '年龄']);
  await page.locator('details label').filter({ hasText: '年龄' }).getByRole('checkbox').uncheck();
  await expect(page.locator('th.column-header')).toHaveText(['姓名', '城市']);
  await page.evaluate(async () => {
    const t = document.querySelector('se-table')!;
    t.importColumnState({ version: 1, columns: [{ key: 'age', width: 180 }] });
    await t.updateComplete;
  });
  await page.getByRole('separator', { name: '调整年龄列宽' }).press('ArrowRight');
  expect(
    await page.evaluate(
      () =>
        document
          .querySelector('se-table')!
          .exportColumnState()
          .columns.find((c) => c.key === 'age')!.width
    )
  ).toBe(190);
});
test('typed filters combine locally and remain remote conditions', async ({ page }) => {
  await page.getByLabel('数值下限年龄').fill('25');
  await page.getByLabel('数值上限年龄').focus();
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody')).toContainText('Bob');
  await page.getByLabel('枚举筛选城市').selectOption('sh');
  await expect(page.locator('tbody')).toContainText('暂无数据');
  await page.evaluate(async () => {
    const t = document.querySelector('se-table')!;
    t.remote = true;
    await t.updateComplete;
  });
  await expect(page.locator('tbody tr')).toHaveCount(2);
});
for (const mode of ['light', 'dark', 'brand'])
  for (const width of [1440, 390])
    test(`table ${mode} ${width}`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 950 });
      await page.evaluate((mode) => {
        document.documentElement.setAttribute('data-su-theme', mode === 'dark' ? 'dark' : 'light');
        document.documentElement.classList.toggle('su-theme-dark', mode === 'dark');
        if (mode === 'brand')
          document.documentElement.style.setProperty('--su-color-primary', '#7c3aed');
      }, mode);
      await page.locator('summary').press('Enter');
      await page.getByRole('button', { name: '前移city', exact: true }).focus();
      await expect(page.getByRole('button', { name: '前移city', exact: true })).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true
      );
      await info.attach('table', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
