import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './browser',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 20_000,
  globalTimeout: 180_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4179',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm exec vite --config browser/vite.config.mjs',
    url: 'http://127.0.0.1:4179/browser/fixture.html',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
