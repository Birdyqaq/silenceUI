import { expect, chromium } from '@playwright/test';
import { realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [consumerRoot] = process.argv.slice(2);
if (!consumerRoot)
  throw new Error('Pass the directory containing the installed consumer examples.');

const browser = await chromium.launch();
try {
  for (const framework of ['vue', 'react']) {
    const root = realpathSync(resolve(consumerRoot, framework));
    if (framework === 'vue') {
      writeFileSync(
        resolve(root, 'root-smoke.html'),
        '<body><script type="module" src="/root-smoke.js"></script></body>'
      );
      writeFileSync(
        resolve(root, 'root-smoke.js'),
        `
        import { SuInput, SuAutoComplete } from 'silenceui';
        document.body.dataset.registered = String(
          customElements.get('su-input') === SuInput &&
          customElements.get('su-auto-complete') === SuAutoComplete
        );
      `
      );
    }
    const requireFromConsumer = createRequire(resolve(root, 'package.json'));
    const viteRoot = dirname(requireFromConsumer.resolve('vite/package.json'));
    const { createServer } = await import(
      pathToFileURL(resolve(viteRoot, 'dist/node/index.js')).href
    );
    const server = await createServer({ root, server: { host: '127.0.0.1', port: 0 } });
    try {
      await server.listen();
      const page = await browser.newPage();
      try {
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        if (framework === 'vue') {
          await page.goto(new URL('root-smoke.html', server.resolvedUrls.local[0]).href);
          await expect(page.locator('body')).toHaveAttribute('data-registered', 'true');
          console.log('root entry: browser smoke passed');
        }
        await page.goto(server.resolvedUrls.local[0]);
        const input = page.getByRole('combobox', { name: '城市' });
        await input.fill('上');
        await input.press('ArrowDown');
        await input.press('Enter');
        await expect(page.locator('#value')).toHaveText('上海');
        await page.getByRole('button', { name: '切换明暗' }).click();
        await expect(page.locator('html')).toHaveAttribute('data-su-theme', 'dark');

        if (framework === 'vue') {
          await page.getByRole('button', { name: '提交', exact: true }).click();
          await expect(page.locator('#submitted')).toHaveText('上海');
          await page.getByRole('button', { name: '切换禁用' }).click();
          await expect(input).toBeDisabled();
        } else {
          const field = await page.locator('su-auto-complete').elementHandle();
          const toggle = page.getByRole('button', { name: '切换挂载' });
          await toggle.click();
          await expect(input).toHaveCount(0);
          await field.evaluate((element) => {
            element.dispatchEvent(new CustomEvent('change', { detail: { value: '旧节点' } }));
          });
          await expect(page.locator('#value')).toHaveText('上海');
          await toggle.click();
          await input.fill('杭');
          await input.press('ArrowDown');
          await input.press('Enter');
          await expect(page.locator('#value')).toHaveText('杭州');
        }
        expect(errors).toEqual([]);
        console.log(`${framework}: browser smoke passed`);
      } finally {
        await page.close();
      }
    } finally {
      await server.close();
    }
  }
} finally {
  await browser.close();
}
