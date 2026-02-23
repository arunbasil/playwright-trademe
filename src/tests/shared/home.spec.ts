import { test, expect } from '../../fixtures/pages.fixture';

// TC-HOME-001
test.describe('Home Page', { tag: ['@sanity', '@home'] }, () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goto();
    });

    test('TC-HOME-001 — should load with Trade Me title', async ({ page }) => {
        await expect(page).toHaveTitle(/Trade Me/);
    });
});
