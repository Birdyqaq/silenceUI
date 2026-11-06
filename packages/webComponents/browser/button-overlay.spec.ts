import { expect, test } from '@playwright/test';
import type {} from '../types';

test.beforeEach(async ({ page }) => {
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
});

test('su-button inherits fieldset disabled state and preserves the first legend exception', async ({
  page,
}) => {
  await page.evaluate(() => {
    const fixture = document.querySelector('#nested')!;
    fixture.innerHTML = `
      <form id="button-form" novalidate>
        <fieldset disabled>
          <legend><su-button native-type="submit">Legend submit</su-button></legend>
          <su-button native-type="submit">Save</su-button>
          <su-button native-type="reset">Reset</su-button>
          <su-button disabled>Always disabled</su-button>
        </fieldset>
      </form>`;
    const form = fixture.querySelector('form')!;
    for (const type of ['submit', 'reset']) {
      form.dataset[type] = '0';
      form.addEventListener(type, (event) => {
        event.preventDefault();
        form.dataset[type] = String(Number(form.dataset[type]) + 1);
      });
    }
  });

  const form = page.locator('#button-form');
  const save = form.getByRole('button', { name: 'Save' });
  const reset = form.getByRole('button', { name: 'Reset' });
  await expect(save).toBeDisabled();
  await expect(reset).toBeDisabled();
  for (const button of [save, reset]) {
    await button.evaluate((element) => (element as HTMLButtonElement).click());
  }
  await expect(form).toHaveAttribute('data-submit', '0');
  await expect(form).toHaveAttribute('data-reset', '0');
  await form.getByRole('button', { name: 'Legend submit' }).click();
  await expect(form).toHaveAttribute('data-submit', '1');

  await form.locator('fieldset').evaluate((fieldset) => {
    (fieldset as HTMLFieldSetElement).disabled = false;
  });
  await save.click();
  await reset.click();
  await expect(form).toHaveAttribute('data-submit', '2');
  await expect(form).toHaveAttribute('data-reset', '1');
  await expect(form.getByRole('button', { name: 'Always disabled' })).toBeDisabled();
});

for (const topTag of ['su-modal', 'su-drawer'] as const) {
  test(`${topTag} receives pointer and keyboard interaction when opened last`, async ({ page }) => {
    const lowerTag: typeof topTag = topTag === 'su-modal' ? 'su-drawer' : 'su-modal';
    await page.evaluate(async ({ topTag, lowerTag }) => {
      const fixture = document.querySelector('#nested')!;
      const top = document.createElement(topTag);
      const lower = document.createElement(lowerTag);
      // The DOM order is the reverse of the opening order.
      fixture.append(top, lower);
      lower.open = true;
      await lower.updateComplete;
      top.open = true;
      await top.updateComplete;
    }, { topTag, lowerTag });

    const top = page.locator(topTag);
    const lower = page.locator(lowerTag);
    const firstButton = top.getByRole('button', {
      name: topTag === 'su-modal' ? '取消' : '关闭抽屉',
    });
    await expect(firstButton).toBeFocused();
    expect(await firstButton.evaluate((element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return document.elementFromPoint(x + width / 2, y + height / 2)?.localName;
    })).toBe(topTag);
    await firstButton.click();
    await expect(top).not.toHaveAttribute('open');
    await expect(lower).toHaveAttribute('open');
    await page.keyboard.press('Escape');
    await expect(lower).not.toHaveAttribute('open');
  });
}
