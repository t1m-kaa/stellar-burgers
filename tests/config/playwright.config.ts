import path from 'path';
import { defineConfig, devices } from '@playwright/test';

const projectRoot = path.resolve(__dirname, '../..');
const baseURL = 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: path.resolve(projectRoot, 'tests'),
  testMatch: '**/*.pl.tsx',
  outputDir: path.resolve(projectRoot, 'test-results'),
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    serviceWorkers: 'block',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm run start:test',
    cwd: projectRoot,
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI
  }
});
