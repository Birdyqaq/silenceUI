import { expect, test, type Page } from '@playwright/test';
import type {} from '../types';

async function entries(page: Page) {
  return page.evaluate(async () => {
    await Promise.all(Array.from(document.querySelectorAll('su-input, su-tree-select, su-transfer'),
      (el) => (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete));
    return Array.from(new FormData(document.querySelector<HTMLFormElement>('#native')!).entries());
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
});

test('native ElementInternals submits values and su-form emits valid-submit', async ({ page }) => {
  await page.locator('#username input').fill('Alice');
  await page.evaluate(async () => {
    const department = document.querySelector('su-tree-select')!;
    department.value = 'engineering';
    await department.updateComplete;
  });
  expect(await entries(page)).toEqual([['username', 'Alice'], ['department', 'engineering'], ['role', 'read']]);
  await page.getByRole('button', { name: '校验提交', exact: true }).click();
  await expect(page.locator('#submitted')).toContainText('"username":"Alice"');
});

test('required rules focus the real shadow input and link its error', async ({ page }) => {
  await page.locator('#username input').fill('');
  expect(await page.evaluate(() => document.querySelector('su-form')!.validate())).toBe(false);
  const input = page.locator('#username input');
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAttribute('aria-describedby', /su-form-description/);
  await expect(page.locator('#username #su-form-description')).toHaveText('请输入用户名');
  expect(await page.evaluate(() => document.querySelector<HTMLFormElement>('#native')!.checkValidity())).toBe(false);
});

test('native reset restores original values and clears rule errors', async ({ page }) => {
  await page.locator('#username input').fill('');
  await page.evaluate(async () => {
    document.querySelector('su-tree-select')!.value = 'engineering';
    document.querySelector('su-transfer')!.targetKeys = ['write'];
    await document.querySelector('su-form')!.validate();
  });
  await page.getByRole('button', { name: '重置表单', exact: true }).click();
  await expect(page.locator('#username input')).toHaveValue('initial');
  expect(await entries(page)).toEqual([['username', 'initial'], ['department', ''], ['role', 'read']]);
  expect(await page.evaluate(() => document.querySelector('su-form')!.errors)).toEqual({});
});

test('fieldset disabled excludes controls and preserves explicitly disabled siblings', async ({ page }) => {
  await page.evaluate(() => { document.querySelector<HTMLFieldSetElement>('#fields')!.disabled = true; });
  await expect(page.locator('#username input')).toBeDisabled();
  await expect(page.locator('#department .trigger')).toBeDisabled();
  await expect(page.locator('#roles .left .row input').first()).toBeDisabled();
  expect(await entries(page)).toEqual([]);
  await page.evaluate(() => { document.querySelector<HTMLFieldSetElement>('#fields')!.disabled = false; });
  await expect(page.locator('#username input')).toBeEnabled();
  await expect(page.locator('#locked input')).toBeDisabled();
  expect(await entries(page)).toEqual([['username', 'initial'], ['department', ''], ['role', 'read']]);
});

test('same-name FormData repeats keys and dynamic names do not leave stale fields', async ({ page }) => {
  await page.evaluate(async () => {
    const roles = document.querySelector('su-transfer')!;
    roles.targetKeys = ['read', 'write'];
    const hidden = document.createElement('input');
    hidden.type = 'hidden'; hidden.name = 'role'; hidden.value = 'native';
    document.querySelector('form')!.append(hidden);
    await roles.updateComplete;
  });
  expect((await entries(page)).filter(([key]) => key === 'role')).toEqual([['role', 'read'], ['role', 'write'], ['role', 'native']]);
  await page.evaluate(() => { document.querySelector('su-transfer')!.name = 'permission'; });
  const renamed = await entries(page);
  expect(renamed.filter(([key]) => key === 'role')).toEqual([['role', 'native']]);
  expect(renamed.filter(([key]) => key === 'permission')).toEqual([['permission', 'read'], ['permission', 'write']]);
});

test('TreeSelect supports a real keyboard path and returns focus on selection', async ({ page }) => {
  const trigger = page.locator('#department .trigger');
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const root = page.locator('#department su-tree .label[data-key="root"]');
  await expect(root).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(trigger).toContainText('研发');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('search Escape restores focus; closed and detached trees cannot select', async ({ page }) => {
  await page.evaluate(async () => { const el = document.querySelector('su-tree-select')!; el.searchable = true; await el.updateComplete; });
  const trigger = page.locator('#department .trigger');
  await trigger.click();
  await page.getByRole('searchbox', { name: '搜索树选项' }).fill('研发');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.evaluate(async () => {
    const el = document.querySelector('su-tree-select')!;
    const oldTree = el.shadowRoot!.querySelector('su-tree')!;
    el.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!.click();
    await el.updateComplete;
    oldTree.dispatchEvent(new CustomEvent('select', { detail: { key: 'engineering' } }));
  });
  expect(await page.locator('#department').evaluate((el) => (el as HTMLElementTagNameMap['su-tree-select']).value)).toBe('');
});

test('nested Shadow DOM selection restores trigger focus without stealing external focus', async ({ page }) => {
  await page.evaluate(async () => {
    const shadow = document.querySelector('#nested')!.attachShadow({ mode: 'open' });
    const department = document.querySelector('su-tree-select')!;
    shadow.append(department);
    await department.updateComplete;
  });
  const trigger = page.locator('#nested su-tree-select .trigger');
  await trigger.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(trigger).toBeFocused();
  await page.evaluate(() => {
    const el = document.querySelector('#nested')!.shadowRoot!.querySelector('su-tree-select')!;
    el.shadowRoot!.querySelector<HTMLButtonElement>('.trigger')!.click();
    document.querySelector<HTMLButtonElement>('#outside')!.focus();
  });
  await expect(page.locator('#outside')).toBeFocused();
});

test('Transfer temporary checkboxes preserve errors; keyboard move clears them', async ({ page }) => {
  await page.evaluate(async () => {
    const wrapper = document.querySelector('su-form')!;
    const roles = document.querySelector('su-transfer')!;
    roles.required = false; roles.targetKeys = [];
    wrapper.rules = { role: [{ required: true, message: '请选择角色' }] };
    await roles.updateComplete;
    await wrapper.validate();
  });
  const checkbox = page.locator('#roles .left .row input[data-key="write"]');
  await checkbox.focus();
  await page.keyboard.press('Space');
  expect(await page.evaluate(() => document.querySelector('su-form')!.errors.role)).toBe('请选择角色');
  await page.getByRole('button', { name: '移入已选项', exact: true }).press('Enter');
  expect(await page.evaluate(() => document.querySelector('su-form')!.errors.role)).toBeUndefined();
  expect((await entries(page)).filter(([key]) => key === 'role')).toEqual([['role', 'write']]);
});

for (const boundary of ['edit', 'unmount'] as const) {
  test(`async validation cannot publish stale errors after ${boundary}`, async ({ page }) => {
    const pending = page.evaluate(async () => {
      const wrapper = document.querySelector('su-form')!;
      wrapper.rules = { username: [{ validator: async () => {
        document.documentElement.dataset.validating = 'true';
        return new Promise<string>((resolve) => document.addEventListener('release-validator', () => resolve('旧错误'), { once: true }));
      } }] };
      return wrapper.validate();
    });
    await expect(page.locator('html')).toHaveAttribute('data-validating', 'true');
    if (boundary === 'edit') await page.locator('#username input').fill('new value');
    else await page.locator('su-form').evaluate((el) => el.remove());
    await page.evaluate(() => document.dispatchEvent(new Event('release-validator')));
    expect(await pending).toBe(false);
    await expect(page.locator('#outside')).toBeEnabled();
    if (boundary === 'edit') {
      expect(await page.evaluate(() => document.querySelector('su-form')!.errors)).toEqual({});
      await expect(page.locator('#username input')).toBeFocused();
    }
  });
}

test('unmounting an open popup removes outside-click handling and does not steal focus', async ({ page }) => {
  await page.locator('#department .trigger').click();
  await page.locator('#department').evaluate((el) => el.remove());
  await page.locator('#outside').click();
  await expect(page.locator('#outside')).toBeFocused();
  await expect(page.locator('su-tree')).toHaveCount(0);
});
