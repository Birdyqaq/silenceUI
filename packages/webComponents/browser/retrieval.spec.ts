import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
});

test('segmented navigates enabled options and updates its tab stop after replacement', async ({
  page,
}) => {
  await page.evaluate(() => {
    const control = document.createElement('su-segmented');
    control.options = [
      { value: 'list', label: '列表' },
      { value: 'locked', label: '锁定', disabled: true },
      { value: 'grid', label: '网格' },
    ];
    control.value = 'list';
    document.body.append(control);
  });
  const group = page.getByRole('radiogroup', { name: '视图' });
  const list = group.getByRole('radio', { name: '列表' });
  const grid = group.getByRole('radio', { name: '网格' });
  await list.focus();
  await list.press('ArrowRight');
  await expect(grid).toBeFocused();
  await expect(grid).toBeChecked();
  await grid.press('Home');
  await expect(list).toBeChecked();
  await list.press('End');
  await expect(grid).toBeChecked();
  await group.evaluate((group) => {
    const control = group.getRootNode() as ShadowRoot;
    (control.host as HTMLElementTagNameMap['su-segmented']).options = [
      { value: 'list', label: '列表' },
    ];
  });
  await expect(list).toHaveAttribute('tabindex', '0');
});

test('result exposes its status icon and wraps long text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.evaluate(() => {
    document.querySelector('main')!.innerHTML =
      '<su-result status="forbidden"><button slot="actions">返回</button></su-result>';
    document.querySelector('su-result')!.description = 'LongMessage'.repeat(40);
  });
  const result = page.locator('su-result');
  await expect(result.getByRole('img', { name: '无权限' })).toBeVisible();
  await expect(result.getByRole('button', { name: '返回' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('autocomplete commits IME once, selects with keyboard and participates in forms', async ({
  page,
}) => {
  await page.evaluate(() => {
    document.querySelector('main')!.innerHTML =
      '<form id="search"><su-auto-complete name="search" required></su-auto-complete></form>';
    const control = document.querySelector('su-auto-complete')!;
    control.options = [{ value: 'sh', label: '上海' }];
    control.addEventListener('query', (event) => {
      control.dataset.query = (event as CustomEvent).detail.query;
      control.dataset.count = String(Number(control.dataset.count ?? 0) + 1);
    });
  });
  const control = page.locator('su-auto-complete');
  const input = control.getByRole('combobox');
  await input.focus();
  await input.dispatchEvent('compositionstart');
  await input.evaluate((input) => {
    (input as HTMLInputElement).value = '上';
    input.dispatchEvent(new InputEvent('input', { isComposing: true }));
  });
  await expect(control).not.toHaveAttribute('data-count', /.+/);
  await input.dispatchEvent('compositionend');
  await expect(control).toHaveAttribute('data-query', '上');
  await expect(control).toHaveAttribute('data-count', '1');
  await input.press('ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'option-0');
  await input.press('Enter');
  await expect(input).toHaveValue('sh');
  const form = page.locator('#search');
  expect(await form.evaluate((form) => new FormData(form as HTMLFormElement).get('search'))).toBe(
    'sh'
  );
  await form.evaluate((form) => (form as HTMLFormElement).reset());
  await expect(input).toHaveValue('');
  expect(await form.evaluate((form) => (form as HTMLFormElement).reportValidity())).toBe(false);
  await expect(input).toBeFocused();
});

test('autocomplete ignores detached candidates and does not reopen or focus on remote updates', async ({
  page,
}) => {
  await page.evaluate(() => {
    document.querySelector('main')!.innerHTML =
      '<su-auto-complete remote></su-auto-complete><button id="outside">其他操作</button>';
    document.querySelector('su-auto-complete')!.options = [{ value: 'old', label: '旧候选' }];
  });
  const control = page.locator('su-auto-complete');
  const input = control.getByRole('combobox');
  await input.fill('query');
  await expect(control.getByRole('option', { name: '旧候选' })).toBeVisible();
  await control.evaluate(async (element) => {
    const control = element as HTMLElementTagNameMap['su-auto-complete'];
    const old = control.shadowRoot!.querySelector<HTMLElement>('[role="option"]')!;
    control.options = [{ value: 'new', label: '新候选' }];
    await control.updateComplete;
    old.click();
  });
  await expect(input).toHaveValue('query');
  await input.press('Escape');
  const outside = page.locator('#outside');
  await outside.focus();
  await control.evaluate(async (element) => {
    const control = element as HTMLElementTagNameMap['su-auto-complete'];
    control.loading = true;
    await control.updateComplete;
    control.loading = false;
    control.options = [{ value: 'late', label: '晚到候选' }];
    await control.updateComplete;
    control.disabled = true;
    await control.updateComplete;
    control.remove();
    document.querySelector('main')!.append(control);
  });
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(outside).toBeFocused();
});

test('autocomplete escapes drawer clipping and Escape closes the suggestions first', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 550 });
  await page.evaluate(() => {
    document.querySelector('main')!.innerHTML = `
      <su-drawer open title="查询成员">
        <div style="height:48px;overflow:hidden;transform:translateZ(0)">
          <su-auto-complete label="成员"></su-auto-complete>
        </div>
      </su-drawer>`;
    document.querySelector('su-auto-complete')!.options = Array.from({ length: 30 }, (_, i) => ({
      value: String(i),
      label: `成员 ${i}`,
    }));
  });
  const drawer = page.getByRole('dialog', { name: '查询成员' });
  const control = page.locator('su-auto-complete');
  const input = control.getByRole('combobox');
  const option = control.getByRole('option', { name: '成员 29', exact: true });
  await input.press('ArrowUp');
  await expect(input).toHaveAttribute('aria-activedescendant', 'option-29');
  await expect(option).toBeInViewport();
  await option.click();
  await expect(input).toHaveValue('29');
  await expect(input).toBeFocused();
  await input.press('ArrowDown');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await input.press('Escape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(drawer).toBeVisible();
  await input.press('Escape');
  await expect(drawer).toHaveCount(0);
});
