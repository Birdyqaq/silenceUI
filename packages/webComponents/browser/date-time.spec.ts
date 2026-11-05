import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => {
    document.querySelector('main')!.innerHTML = `
      <form id="window"><fieldset><su-date-time-range name="window" label="有效期" required></su-date-time-range></fieldset></form>`;
    const range = document.querySelector('su-date-time-range')!;
    range.value = ['2026-11-04T23:00', '2026-11-05T07:00'];
  });
});

test('cross-day range submits repeated values, validates end and restores/reset values', async ({
  page,
}) => {
  const range = page.locator('su-date-time-range');
  const start = range.locator('input').nth(0);
  const end = range.locator('input').nth(1);
  await expect(end).toHaveValue('2026-11-05T07:00');
  const values = () =>
    page
      .locator('#window')
      .evaluate((form) => new FormData(form as HTMLFormElement).getAll('window'));
  expect(await values()).toEqual(['2026-11-04T23:00', '2026-11-05T07:00']);
  await end.fill('2026-11-04T22:00');
  await end.blur();
  expect(
    await page.locator('#window').evaluate((form) => (form as HTMLFormElement).reportValidity())
  ).toBe(false);
  await expect(end).toBeFocused();
  await range.evaluate((el) => {
    const range = el as HTMLElementTagNameMap['su-date-time-range'];
    const data = new FormData();
    data.append(range.name, '2026-12-31T23:00');
    data.append(range.name, '2027-01-01T01:00');
    range.formStateRestoreCallback(data);
  });
  await expect(start).toHaveValue('2026-12-31T23:00');
  expect(await values()).toEqual(['2026-12-31T23:00', '2027-01-01T01:00']);
  await page.locator('#window').evaluate((form) => (form as HTMLFormElement).reset());
  await expect(start).toHaveValue('2026-11-04T23:00');
  await expect(end).toHaveValue('2026-11-05T07:00');
  await range.evaluate((el) => {
    (el as HTMLElementTagNameMap['su-date-time-range']).min = '2026-11-05T00:00';
  });
  await expect(start).toHaveAttribute('aria-invalid', 'true');
  await range.evaluate((el) => {
    (el as HTMLElementTagNameMap['su-date-time-range']).focus();
  });
  await expect(start).toBeFocused();
});

test('fieldset disabled, readonly, rename and narrow dark layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  const range = page.locator('su-date-time-range');
  const inputs = range.locator('input');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-su-theme', 'dark');
    document.querySelector('fieldset')!.disabled = true;
  });
  await expect(inputs.nth(0)).toBeDisabled();
  expect(
    await page.locator('#window').evaluate((form) => [...new FormData(form as HTMLFormElement)])
  ).toEqual([]);
  await page.evaluate(() => {
    document.querySelector('fieldset')!.disabled = false;
    const range = document.querySelector('su-date-time-range')!;
    range.readonly = true;
    range.name = 'shift';
  });
  await expect(inputs.nth(1)).toHaveAttribute('readonly', '');
  expect(
    await page
      .locator('#window')
      .evaluate((form) => new FormData(form as HTMLFormElement).getAll('shift'))
  ).toEqual(['2026-11-04T23:00', '2026-11-05T07:00']);
  await expect(inputs.nth(0)).toHaveCSS('background-color', 'rgb(31, 41, 55)');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
