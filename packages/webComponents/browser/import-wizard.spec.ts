import { expect, test } from '@playwright/test';
import type { SuImportWizard } from '../components/form/import-wizard';

test('imports after mapping and validation at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => {
    const wizard = document.createElement('su-import-wizard') as SuImportWizard;
    wizard.fields = [{ key: 'name', label: '姓名', required: true }];
    wizard.adapter = {
      async parse() { return { columns: ['姓名'], rows: [['张三']] }; },
      async validate() { return []; },
      async submit() { return { message: '成功导入 1 行' }; },
    };
    document.querySelector('main')!.replaceChildren(wizard);
  });
  const wizard = page.locator('su-import-wizard');
  await wizard.locator('input').setInputFiles({ name: 'users.csv', mimeType: 'text/csv', buffer: Buffer.from('姓名\n张三') });
  await expect(wizard.getByRole('button', { name: '校验数据' })).toBeDisabled();
  await wizard.getByRole('combobox').selectOption('姓名');
  await wizard.getByRole('button', { name: '校验数据' }).click();
  await expect(wizard.getByRole('table')).toContainText('张三');
  await wizard.getByRole('button', { name: '确认导入' }).click();
  await expect(wizard.getByRole('status')).toHaveText('成功导入 1 行');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await wizard.getByRole('button', { name: '重新开始' }).click();
  await expect(wizard.locator('input')).toBeVisible();
});
