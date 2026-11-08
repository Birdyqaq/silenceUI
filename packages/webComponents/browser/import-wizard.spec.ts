import { expect, test } from '@playwright/test';
import type { SuImportWizard } from '../components/form/import-wizard';

test('does not let detached mapping controls modify a new import', async ({ page }) => {
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(async () => {
    const wizard = document.createElement('su-import-wizard');
    wizard.fields = [{ key: 'name', label: '姓名', required: true }];
    wizard.adapter = {
      parse: async () => ({ columns: ['name'], rows: [['张三']] }),
      validate: async () => [],
      submit: async () => ({ message: '完成' }),
    };
    document.querySelector('main')!.replaceChildren(wizard);
    await wizard.loadFile(new File(['name'], 'first.csv'));
    await wizard.updateComplete;
    const oldSelect = wizard.shadowRoot!.querySelector('select')!;
    wizard.reset();
    await wizard.updateComplete;
    await wizard.loadFile(new File(['name'], 'second.csv'));
    await wizard.updateComplete;
    oldSelect.value = '';
    oldSelect.dispatchEvent(new Event('change'));
    await wizard.updateComplete;
  });
  const wizard = page.locator('su-import-wizard');
  await expect(wizard.getByRole('combobox')).toHaveValue('name');
  await wizard.getByRole('button', { name: '校验数据' }).click();
  await expect(wizard.getByRole('table')).toContainText('张三');
});

test('imports after mapping and validation at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => {
    const wizard = document.createElement('su-import-wizard') as SuImportWizard;
    wizard.fields = [{ key: 'name', label: '姓名', required: true }];
    wizard.adapter = {
      async parse() {
        return { columns: ['姓名'], rows: [['张三']] };
      },
      async validate() {
        return [];
      },
      async submit() {
        return { message: '成功导入 1 行' };
      },
    };
    document.querySelector('main')!.replaceChildren(wizard);
  });
  const wizard = page.locator('su-import-wizard');
  await wizard
    .locator('input')
    .setInputFiles({ name: 'users.csv', mimeType: 'text/csv', buffer: Buffer.from('姓名\n张三') });
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

test('previews mapped fields and finds errors beyond the initial rows', async ({ page }) => {
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => {
    const wizard = document.createElement('su-import-wizard');
    wizard.fields = [
      { key: 'team', label: '部门', required: true },
      { key: 'name', label: '姓名', required: true },
    ];
    wizard.adapter = {
      async parse() {
        return {
          columns: ['name', 'team', 'note'],
          rows: Array.from({ length: 12 }, (_, i) => ['成员 ' + (i + 1), '研发', '内部备注']),
        };
      },
      async validate() {
        return [
          { row: 12, message: '成员已存在' },
          { row: 12, message: '请核对部门' },
        ];
      },
      async submit() {
        throw new Error('校验未通过时不应提交');
      },
    };
    document.querySelector('main')!.replaceChildren(wizard);
  });
  const wizard = page.locator('su-import-wizard');
  await wizard.locator('input').setInputFiles({
    name: 'users.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('name,team,note'),
  });
  await expect(wizard.getByRole('combobox', { name: '部门（必填）' })).toHaveValue('team');
  await expect(wizard.getByRole('combobox', { name: '姓名（必填）' })).toHaveValue('name');
  await wizard.getByRole('button', { name: '校验数据' }).click();
  const table = wizard.getByRole('table');
  await expect(table.getByRole('columnheader')).toHaveText([
    '源数据行号',
    '部门',
    '姓名',
    '校验状态',
  ]);
  await expect(table.locator('tbody tr')).toHaveCount(10);
  await expect(wizard.getByText('共 12 行，1 行有错误（2 项）。')).toBeVisible();
  await wizard.getByRole('checkbox', { name: '只看错误行' }).check();
  await expect(table.locator('tbody tr')).toHaveCount(1);
  await expect(table.getByRole('rowheader')).toHaveText('12');
  await expect(table.getByRole('cell', { name: '成员 12' })).toBeVisible();
  await expect(wizard.getByRole('button', { name: '确认导入' })).toBeDisabled();
  await wizard.getByRole('button', { name: '返回映射' }).click();
  await expect(wizard.getByRole('combobox', { name: '部门（必填）' })).toHaveValue('team');
});
