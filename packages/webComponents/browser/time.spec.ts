import { expect, test } from '@playwright/test';
import type {} from '../components/form/time-picker';
import type {} from '../components/form/time-range';
import type {} from '../types';

test.beforeEach(async ({ page }) => {
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(async () => {
    document.querySelector('main')!.innerHTML =
      '<su-form><form id="time-form" novalidate><fieldset><su-form-item label="签到"><su-time-picker name="arrival" value="09:00" required></su-time-picker></su-form-item><su-time-range name="shift" label="班次" required></su-time-range></fieldset><button type="reset">重置时间</button></form></su-form>';
    const range = document.querySelector('su-time-range')!;
    range.value = ['09:00', '18:00'];
    await Promise.all([
      document.querySelector('su-time-picker')!.updateComplete,
      range.updateComplete,
    ]);
  });
});
test('native time values, repeat names, reset and inherited disabled', async ({ page }) => {
  const entries = () =>
    page.evaluate(() => Array.from(new FormData(document.querySelector('form')!).entries()));
  expect(await entries()).toEqual([
    ['arrival', '09:00'],
    ['shift', '09:00'],
    ['shift', '18:00'],
  ]);
  await page.locator('su-time-picker input').fill('10:30');
  await page.locator('su-time-range input').nth(1).fill('19:00');
  await page.getByRole('button', { name: '重置时间' }).focus();
  expect(await entries()).toEqual([
    ['arrival', '10:30'],
    ['shift', '09:00'],
    ['shift', '19:00'],
  ]);
  await page.getByRole('button', { name: '重置时间' }).click();
  await expect(page.locator('su-time-picker input')).toHaveValue('09:00');
  await expect(page.locator('su-time-range input').nth(1)).toHaveValue('18:00');
  await page.locator('fieldset').evaluate((el) => {
    (el as HTMLFieldSetElement).disabled = true;
  });
  await expect(page.locator('su-time-picker input')).toBeDisabled();
  expect(await entries()).toEqual([]);
  await page.locator('fieldset').evaluate((el) => {
    (el as HTMLFieldSetElement).disabled = false;
  });
  await expect(page.locator('su-time-range input').first()).toBeEnabled();
  expect((await entries()).length).toBe(3);
});
test('invalid range/step bridges to native form, errors and end focus', async ({ page }) => {
  await page.evaluate(async () => {
    const range = document.querySelector('su-time-range')!;
    range.value = ['18:00', '09:00'];
    await range.updateComplete;
    await document.querySelector('su-form')!.validate();
  });
  await expect(page.locator('su-time-range input').nth(1)).toBeFocused();
  await expect(page.locator('su-time-range input').nth(1)).toHaveAttribute('aria-invalid', 'true');
  expect(await page.evaluate(() => document.querySelector('form')!.checkValidity())).toBe(false);
  await page.evaluate(async () => {
    const range = document.querySelector('su-time-range')!;
    range.value = ['09:00', '18:00'];
    await range.updateComplete;
    const time = document.querySelector('su-time-picker')!;
    time.min = '09:00';
    time.step = 900;
    time.value = '09:05';
    await time.updateComplete;
    await document.querySelector('su-form')!.validate();
  });
  await expect(page.locator('su-time-picker input')).toBeFocused();
  await expect(page.locator('su-time-picker #su-form-description')).toContainText('step');
});
test('restoration and readonly retain submitted values without business events', async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const time = document.querySelector('su-time-picker')!;
    const range = document.querySelector('su-time-range')!;
    let changes = 0;
    time.addEventListener('change', () => changes++);
    range.addEventListener('change', () => changes++);
    time.formStateRestoreCallback('11:00');
    const data = new FormData();
    data.append('shift', '12:00');
    data.append('shift', '13:00');
    range.formStateRestoreCallback(data);
    time.readonly = true;
    range.readonly = true;
    await Promise.all([time.updateComplete, range.updateComplete]);
    return {
      changes,
      entries: Array.from(new FormData(document.querySelector('form')!).entries()),
    };
  });
  expect(result.changes).toBe(0);
  expect(result.entries).toEqual([
    ['arrival', '11:00'],
    ['shift', '12:00'],
    ['shift', '13:00'],
  ]);
  await expect(page.locator('su-time-picker input')).not.toBeEditable();
});
for (const mode of ['light', 'dark', 'brand'])
  for (const width of [1440, 390])
    test(`time ${mode} at ${width}px`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate((mode) => {
        document.documentElement.setAttribute('data-su-theme', mode === 'dark' ? 'dark' : 'light');
        document.documentElement.classList.toggle('su-theme-dark', mode === 'dark');
        if (mode === 'brand') {
          document.documentElement.style.setProperty('--su-color-primary', '#7c3aed');
          document.documentElement.style.setProperty('--su-color-primary-rgb', '124, 58, 237');
        }
      }, mode);
      const input = page.locator('su-time-picker input');
      await input.focus();
      // Native time fields have multiple tab stops (hour/minute/locale segment).
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Tab');
        if (
          await page
            .locator('su-time-range input')
            .first()
            .evaluate((el) => (el.getRootNode() as ShadowRoot).activeElement === el)
        )
          break;
      }
      await expect(page.locator('su-time-range input').first()).toBeFocused();
      if (mode === 'brand') {
        await input.focus();
        await expect(input).toHaveCSS('border-top-color', 'rgb(124, 58, 237)');
      }
      await expect(input).toHaveCSS(
        'background-color',
        mode === 'dark' ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)'
      );
      await expect(input).toHaveCSS('color-scheme', mode === 'dark' ? 'dark' : 'light');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true
      );
      await info.attach('time-form', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
