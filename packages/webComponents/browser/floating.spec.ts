import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.goto('/browser/fixture.html?theme=dark&brand=1');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
});

test('dropdown flips at the viewport edge and follows a scrolling shadow ancestor', async ({
  page,
}) => {
  await page.evaluate(() => {
    const host = document.createElement('div');
    document.body.append(host);
    host.attachShadow({ mode: 'open' }).innerHTML = `
      <div id="scroll" style="position:fixed; right:0; bottom:0; width:160px;
        height:180px; overflow:auto; transform:translateZ(0)">
        <div style="height:320px; position:relative">
          <su-dropdown style="position:absolute;right:0;top:147px">
            <button type="button">操作</button>
          </su-dropdown>
        </div>
      </div>
      <input id="floating-outside" aria-label="外部" style="position:fixed;top:0;left:0">`;
    const dropdown = host.shadowRoot!.querySelector('su-dropdown')!;
    dropdown.items = [
      { key: 'open', label: '打开' },
      { key: 'locked', label: '锁定', disabled: true },
      { key: 'save', label: '保存' },
    ];
  });
  const trigger = page.getByRole('button', { name: '操作' });
  const menu = page.getByRole('menu');
  const open = menu.getByRole('menuitem', { name: '打开' });
  const save = menu.getByRole('menuitem', { name: '保存' });
  await trigger.press('ArrowUp');
  await expect(save).toBeFocused();
  await expect(menu).toHaveAttribute('data-placement', 'top');
  await save.press('Home');
  await expect(open).toBeFocused();
  await open.press('ArrowDown');
  await expect(save).toBeFocused();
  const before = (await menu.boundingBox())!;
  expect(before.x + before.width).toBeLessThanOrEqual(382);
  await page.locator('#scroll').evaluate((el) => {
    el.scrollTop = 50;
  });
  await expect.poll(async () => (await menu.boundingBox())!.y).toBeLessThan(before.y - 30);
  await save.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(menu).toHaveCount(0);

  await trigger.press('ArrowDown');
  await expect(open).toBeFocused();
  const outside = page.locator('#floating-outside');
  await open.press('Tab');
  await expect(outside).toBeFocused();
  await expect(menu).toHaveCount(0);
  await trigger.press('ArrowDown');
  await expect(open).toBeFocused();
  await page.locator('su-dropdown').evaluate((dropdown) => {
    const el = dropdown as HTMLElementTagNameMap['su-dropdown'];
    el.addEventListener(
      'select',
      () =>
        (el.getRootNode() as ShadowRoot)
          .querySelector<HTMLInputElement>('#floating-outside')!
          .focus(),
      { once: true }
    );
  });
  await open.press('Enter');
  await expect(outside).toBeFocused();
  await expect(menu).toHaveCount(0);
});

test('tooltip stays in the viewport inside a clipped ancestor and dismisses on Escape', async ({
  page,
  browserName,
}) => {
  await page.evaluate(() => {
    const content = '帮助说明'.repeat(20);
    document.body.insertAdjacentHTML(
      'beforeend',
      `
      <div style="position:fixed;left:0;top:0;overflow:hidden;transform:translateZ(0)">
        <su-tooltip content="${content}"><button type="button">帮助</button></su-tooltip>
      </div>`
    );
  });
  const trigger = page.getByRole('button', { name: '帮助' });
  await trigger.focus();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveAttribute('data-placement', 'bottom');
  expect((await tooltip.boundingBox())!.x).toBeGreaterThanOrEqual(8);
  await expect(trigger).toHaveAccessibleDescription('帮助说明'.repeat(20));
  if (browserName === 'chromium') {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setPageScaleFactor', { pageScaleFactor: 2 });
    await expect
      .poll(async () =>
        tooltip.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return rect.right <= window.visualViewport!.width - 7;
        })
      )
      .toBe(true);
    await cdp.detach();
  }
  await trigger.press('Escape');
  await expect(tooltip).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('inline collapsed menu retains names and navigates nested enabled items', async ({ page }) => {
  await page.evaluate(() => {
    const menu = document.createElement('su-menu');
    menu.collapsed = true;
    menu.items = [
      {
        key: 'parent',
        label: '设置',
        children: [
          { key: 'disabled', label: '锁定', disabled: true },
          { key: 'child', label: '权限' },
        ],
      },
    ];
    document.body.append(menu);
  });
  const menu = page.locator('su-menu');
  const parent = menu.getByRole('menuitem', { name: '设置' });
  const child = menu.getByRole('menuitem', { name: '权限' });
  await parent.press('ArrowRight');
  await expect(child).toBeVisible();
  await parent.press('ArrowRight');
  await expect(child).toBeFocused();
  await child.press('ArrowLeft');
  await expect(parent).toBeFocused();
  await parent.press('ArrowLeft');
  await expect(child).toHaveCount(0);
});

test('documented input part supports dark, brand focus, error and disabled styles', async ({
  page,
}) => {
  await page.evaluate(() => {
    const input = document.createElement('su-input');
    input.id = 'themed-input';
    document.body.append(input);
    const style = document.createElement('style');
    style.textContent = '#themed-input::part(control) { border-radius: 12px; }';
    document.head.append(style);
  });
  const host = page.locator('#themed-input');
  const input = host.getByRole('textbox');
  await expect(input).toHaveCSS('border-radius', '12px');
  await expect(input).toHaveCSS('background-color', 'rgb(17, 24, 39)');
  await input.focus();
  await expect(input).toHaveCSS('border-top-color', 'rgb(124, 58, 237)');
  await host.evaluate((el) => {
    (el as HTMLElementTagNameMap['su-input']).error = true;
  });
  await expect(input).toHaveCSS('border-top-color', 'rgb(239, 68, 68)');
  await host.evaluate((el) => {
    (el as HTMLElementTagNameMap['su-input']).disabled = true;
  });
  await expect(input).toBeDisabled();
  await expect(input).toHaveCSS('background-color', 'rgb(31, 41, 55)');
});
