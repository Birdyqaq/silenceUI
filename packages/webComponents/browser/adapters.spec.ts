import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
});

test('restricted autocomplete keeps query text out of FormData', async ({ page }) => {
  await page.evaluate(() => {
    document.querySelector('main')!.innerHTML =
      '<form id="lookup"><su-auto-complete remote selection-only required name="person"></su-auto-complete></form>';
    const control = document.querySelector('su-auto-complete')!;
    control.addEventListener('query', (event) => {
      const query = (event as CustomEvent<{ query: string }>).detail.query;
      control.options = query ? [{ value: '42', label: '林晓' }] : [];
    });
  });
  const control = page.locator('su-auto-complete');
  const input = control.getByRole('combobox');
  await input.fill('林');
  await expect(control.getByRole('option', { name: '林晓' })).toBeVisible();
  await expect(control).toHaveJSProperty('value', '');
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(input).toHaveValue('林晓');
  const form = page.locator('#lookup');
  expect(await form.evaluate((node) => new FormData(node as HTMLFormElement).get('person'))).toBe(
    '42'
  );
  await input.fill('任意文字');
  await input.press('Escape');
  await expect(input).toHaveValue('林晓');
  await control.getByRole('button', { name: '清空' }).click();
  await expect(input).toHaveValue('');
  await expect(control).toHaveJSProperty('value', '');
});

test('collapsed menu opens nested leaves and emits the original item', async ({ page }) => {
  await page.evaluate(() => {
    const menu = document.createElement('su-menu');
    menu.collapsed = menu.collapsedFlyout = true;
    menu.items = [
      {
        key: 'root',
        label: '管理',
        children: [{ key: 'branch', label: '人员', children: [{ key: 'members', label: '成员' }] }],
      },
    ];
    menu.addEventListener('select', (event) => {
      menu.dataset.selected = (event as CustomEvent).detail.label;
    });
    document.querySelector('main')!.replaceChildren(menu);
  });
  const menu = page.locator('su-menu');
  const trigger = menu.getByRole('menuitem', { name: '管理', exact: true });
  await trigger.press('ArrowRight');
  const item = menu.getByRole('menuitem', { name: '人员 / 成员' });
  await expect(item).toBeFocused();
  await item.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await item.press('Enter');
  await expect(menu).toHaveAttribute('data-selected', '成员');
});

test('upload progress and rich text form bridge delegate to the host', async ({ page }) => {
  await page.evaluate(() => {
    document.querySelector('main')!.innerHTML =
      '<su-upload></su-upload><form id="editor"><su-rich-text-field name="body"><textarea aria-label="正文"></textarea></su-rich-text-field></form>';
    const upload = document.querySelector('su-upload')!;
    const file = new File(['内容'], 'demo.txt');
    upload.files = [file];
    upload.uploads = new Map([[file, { progress: 45 }]]);
    upload.addEventListener('upload-cancel', (event) => {
      if ((event as CustomEvent).detail.file === file) upload.uploads = new Map();
    });
    const field = document.querySelector('su-rich-text-field')!;
    const editor = field.querySelector('textarea')!;
    field.value = '<p>初始</p>';
    field.adapter = {
      setValue: (value) => {
        editor.value = value;
      },
      setDisabled: (disabled) => {
        editor.disabled = disabled;
      },
      subscribe: (change) => {
        const listener = () => change(editor.value);
        editor.addEventListener('input', listener);
        return () => editor.removeEventListener('input', listener);
      },
      focus: (options) => editor.focus(options),
    };
  });
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '45');
  const upload = page.locator('su-upload');
  await upload.locator('input[type=file]').setInputFiles({
    name: 'replacement.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('new'),
  });
  await expect(upload.getByText('replacement.txt')).toBeVisible();
  await expect(upload.getByRole('progressbar', { name: '上传进度 demo.txt' })).toHaveAttribute(
    'value',
    '45'
  );
  await upload.getByRole('button', { name: '取消上传 demo.txt' }).click();
  await expect(upload.getByRole('progressbar')).toHaveCount(0);
  await expect(upload.getByText('demo.txt')).toHaveCount(0);
  const editor = page.getByRole('textbox', { name: '正文' });
  await editor.fill('<p>新值</p>');
  const form = page.locator('#editor');
  expect(await form.evaluate((node) => new FormData(node as HTMLFormElement).get('body'))).toBe(
    '<p>新值</p>'
  );
  await form.evaluate((node) => (node as HTMLFormElement).reset());
  await expect(editor).toHaveValue('<p>初始</p>');
});

test('external selection replaces the previous record query', async ({ page }) => {
  await page.evaluate(() => {
    document.querySelector('main')!.innerHTML =
      '<su-auto-complete remote selection-only></su-auto-complete>';
    const control = document.querySelector('su-auto-complete')!;
    control.options = [
      { value: '1', label: '原记录' },
      { value: '2', label: '新记录' },
    ];
    control.value = '1';
  });
  const control = page.locator('su-auto-complete');
  const input = control.getByRole('combobox');
  await input.fill('未提交查询');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await control.evaluate((element) => {
    (element as HTMLElementTagNameMap['su-auto-complete']).value = '2';
  });
  await expect(input).toHaveValue('新记录');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
});

test('rich text ignores an old subscription after remounting the same adapter', async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const field = document.createElement('su-rich-text-field');
    const callbacks: Array<(value: string) => void> = [];
    field.adapter = {
      setValue() {},
      setDisabled() {},
      focus() {},
      subscribe(callback) {
        callbacks.push(callback);
        return () => {};
      },
    };
    const main = document.querySelector('main')!;
    main.append(field);
    await field.updateComplete;
    field.remove();
    main.append(field);
    await field.updateComplete;
    callbacks[1]('当前内容');
    callbacks[0]('过期内容');
    return field.value;
  });
  expect(result).toBe('当前内容');
});
