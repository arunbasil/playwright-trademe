import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './src/tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { open: 'never' }],
        ['list'],
        ['allure-playwright', {
            detail: true,
            outputFolder: 'allure-results',
            suiteTitle: true,
            environmentInfo: {
                framework: 'Playwright',
                language:  'TypeScript',
                base_url:  process.env.BASE_URL ?? 'https://www.trademe.co.nz',
            },
        }],
    ],
    use: {
        baseURL: process.env.BASE_URL ?? 'https://www.trademe.co.nz',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        viewport: { width: 1280, height: 720 },
        launchOptions: {
            slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
        },
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});