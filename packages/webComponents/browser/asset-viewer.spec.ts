import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/browser/fixture.html');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => {
    const viewer = document.createElement('se-asset-viewer');
    viewer.src = '/document.pdf#page=2';
    document.querySelector('main')!.replaceChildren(viewer);
  });
});

test('rejects HTML served from a same-origin PDF address', async ({ page }) => {
  await page.route('**/document.pdf', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<script>parent.document.documentElement.dataset.previewProbe="ran"</script>',
    })
  );
  const viewer = page.locator('se-asset-viewer');
  await viewer.getByRole('button', { name: '预览', exact: true }).click();
  await expect(viewer.getByRole('alert')).toContainText('资源加载失败');
  await expect(viewer.locator('iframe')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveAttribute('data-preview-probe', 'ran');
});

test('opens a PDF-typed object URL and revokes it on close', async ({ page }) => {
  await page.evaluate(() => {
    const revoke = URL.revokeObjectURL.bind(URL);
    URL.revokeObjectURL = (url) => {
      revoke(url);
      document.documentElement.dataset.revokedPdfUrl = url;
    };
  });
  await page.route('**/document.pdf', (route) =>
    route.fulfill({
      contentType: 'application/octet-stream',
      body: '%PDF-1.7\n%%EOF',
    })
  );
  const viewer = page.locator('se-asset-viewer');
  await viewer.getByRole('button', { name: '预览', exact: true }).click();
  const iframe = viewer.locator('iframe');
  await expect(iframe).toHaveAttribute('src', /^blob:.*#page=2$/);
  const source = (await iframe.getAttribute('src'))!.split('#')[0];
  expect(
    await page.evaluate(async (url) => (await fetch(url)).headers.get('Content-Type'), source)
  ).toBe('application/pdf');
  await viewer.getByRole('button', { name: '关闭' }).click();
  await expect(iframe).toHaveCount(0);
  await expect(page.locator('html')).toHaveAttribute('data-revoked-pdf-url', source);
});
