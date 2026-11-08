import { test, expect } from '@playwright/test';
import type {} from '../types';
import type { TableCellEditRequest } from '../components/table';
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

test('local refresh retains sorting and page, with named row selection controls', async ({
  page,
}) => {
  await page.evaluate(async () => {
    const table = document.querySelector('se-table')!;
    table.pagination = table.selectable = true;
    table.pageSize = 2;
    table.columns = [{ key: 'name', label: '姓名', sortable: true }];
    table.data = ['D', 'C', 'B', 'A'].map((name) => ({ id: name, name }));
    await table.updateComplete;
    table.sortColumn(0);
    await table.updateComplete;
    table.currentPage = 2;
    await table.updateComplete;
    table.data = table.data.map((row) => ({ ...row }));
    await table.updateComplete;
  });
  const table = page.locator('se-table');
  await expect(table).toHaveJSProperty('currentPage', 2);
  await expect(table.locator('th[aria-sort]')).toHaveAttribute('aria-sort', 'ascending');
  await expect(table.locator('tbody tr')).toHaveText(['C', 'D']);
  const row = table.getByRole('checkbox', { name: '选择第 3 行', exact: true });
  await row.focus();
  await page.keyboard.press('Space');
  await expect(table).toHaveJSProperty('selectedKeys', ['C']);
});

test('bulk selection covers loaded virtual rows and clears them', async ({ page }) => {
  await page.evaluate(async () => {
    const table = document.querySelector('se-table')!;
    table.columns = [{ key: 'name', label: '姓名' }];
    table.selectable = table.virtualScroll = true;
    table.data = Array.from({ length: 20000 }, (_, id) => ({ id, name: String(id) }));
    await table.updateComplete;
  });
  const table = page.locator('se-table');
  const all = table.getByRole('checkbox', { name: '全选', exact: true });
  await all.check();
  await expect
    .poll(() =>
      table.evaluate((node) => (node as HTMLElementTagNameMap['se-table']).selectedKeys.length)
    )
    .toBe(20000);
  expect(await table.locator('tbody tr').count()).toBeLessThan(60);
  await all.uncheck();
  await expect(table).toHaveJSProperty('selectedKeys', []);
});

test('edits a fixed cell without selecting its row; remote retry and focus recovery', async ({
  page,
}) => {
  await page.evaluate(async () => {
    const table = document.querySelector('se-table')!;
    table.remote = true;
    table.selectable = true;
    table.columns = table.columns.map((col) =>
      col.key === 'name' ? { ...col, editable: { type: 'text' } } : col
    );
    let attempts = 0;
    table.addEventListener('cell-edit-request', (event) => {
      const request = (event as CustomEvent<TableCellEditRequest>).detail;
      if (++attempts === 1) request.reject('模拟失败');
      else {
        request.resolve();
        table.data = table.data.map((row) =>
          String(row.id) === request.rowKey ? { ...row, name: request.value } : row
        );
      }
    });
    await table.updateComplete;
  });
  const button = page.getByRole('button', { name: '编辑姓名（1）', exact: true });
  await button.press('Enter');
  const input = page.getByRole('textbox', { name: '编辑姓名', exact: true });
  await expect(input).toBeFocused();
  await input.fill('Alicia');
  await input.press('Enter');
  await expect(page.getByRole('alert')).toHaveText('模拟失败');
  await expect(input).toHaveValue('Alicia');
  await input.press('Enter');
  await expect(button).toHaveText('Alicia');
  await expect(button).toBeFocused();
  expect(await page.evaluate(() => document.querySelector('se-table')!.selectedKeys)).toEqual([]);
});

test('virtual window, filter, pagination and column visibility invalidate active drafts', async ({
  page,
}) => {
  const start = async () =>
    page.getByRole('button', { name: '编辑姓名（1）', exact: true }).press('Enter');
  const editor = page.getByRole('textbox', { name: '编辑姓名', exact: true });
  await page.evaluate(async () => {
    const t = document.querySelector('se-table')!;
    t.columns = t.columns.map((c) =>
      c.key === 'name' ? { ...c, editable: { type: 'text' }, filterable: true } : c
    );
    t.data = Array.from({ length: 2000 }, (_, i) => ({
      id: i + 1,
      name: 'Row ' + (i + 1),
      age: i,
    }));
    t.virtualScroll = true;
    t.height = '240px';
    await t.updateComplete;
  });
  await start();
  await expect(editor).toBeFocused();
  await page.locator('.table-viewport').evaluate((el) => (el.scrollTop = 4000));
  await expect(editor).toHaveCount(0);
  expect(await page.locator('tbody tr').count()).toBeLessThan(60);
  await page.locator('.table-viewport').evaluate((el) => (el.scrollTop = 0));
  await start();
  await page.evaluate(async () => {
    const t = document.querySelector('se-table')!;
    t.filters = { name: 'Row 2000' };
    await t.updateComplete;
  });
  await expect(editor).toHaveCount(0);
  await page.evaluate(async () => {
    const t = document.querySelector('se-table')!;
    t.filters = {};
    t.pagination = true;
    t.pageSize = 10;
    await t.updateComplete;
  });
  await start();
  await page.evaluate(async () => {
    const t = document.querySelector('se-table')!;
    t.currentPage = 2;
    await t.updateComplete;
  });
  await expect(editor).toHaveCount(0);
  await page.evaluate(async () => {
    const t = document.querySelector('se-table')!;
    t.currentPage = 1;
    await t.updateComplete;
  });
  await start();
  await page.evaluate(async () => {
    const t = document.querySelector('se-table')!;
    t.columnState = [{ key: 'name', hidden: true }];
    await t.updateComplete;
  });
  await expect(editor).toHaveCount(0);
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

test('local pagination restores a suspended draft when its cell is reopened', async ({ page }) => {
  await page.evaluate(() => {
    const table = document.querySelector('se-table')!;
    table.pagination = true;
    table.pageSize = 1;
    table.preservePageDrafts = true;
    table.columns = table.columns.map((column) =>
      column.key === 'name' ? { ...column, editable: { type: 'text' } } : column
    );
  });
  const table = page.locator('se-table');
  const first = table.getByRole('button', { name: '编辑姓名（1）', exact: true });
  const editor = table.getByRole('textbox', { name: '编辑姓名', exact: true });
  await first.click();
  await editor.fill('跨页草稿');
  await table.getByRole('button', { name: '下一页' }).click();
  await expect(table.getByRole('button', { name: '编辑姓名（2）', exact: true })).toBeVisible();
  await table.getByRole('button', { name: '上一页' }).click();
  await first.click();
  await expect(editor).toHaveValue('跨页草稿');
  await expect(editor).toBeFocused();
});
