// spec: specs/sanity.md
// seed: src/tests/seed.spec.ts

import { test, expect } from '../../fixtures/pages.fixture';
import { Logger } from '../../utils/logger';

// TC-SAN-001 through TC-SAN-008
test.describe('Sanity Suite — TradeMe Core Functionality', { tag: ['@sanity'] }, () => {

    // ────────────────────────────────────────────────────────────────────
    // TC-SAN-001 — Homepage Loads Successfully
    // ────────────────────────────────────────────────────────────────────
    test('TC-SAN-001 — Homepage loads with all core elements', { tag: ['@home'] },
        async ({ homePage, page }, testInfo) => {
            const log = new Logger(testInfo);

            await test.step('Navigate to homepage', async () => {
                await homePage.goto();
            });

            await test.step('Verify page title', async () => {
                // 1. Page title contains "Trade Me"
                await expect(page).toHaveTitle(/Trade Me/);
            });

            await test.step('Verify global search bar is present', async () => {
                // 2. Search bar is visible
                await expect(page.getByRole('searchbox')).toBeVisible();
            });

            await test.step('Verify main navigation tabs', async () => {
                // 3. All 5 section tabs are visible
                for (const tab of ['Marketplace', 'Property', 'Motors', 'Jobs', 'Services']) {
                    await expect(page.getByRole('link', { name: tab, exact: true }).first()).toBeVisible();
                }
            });

            await test.step('Verify header utilities', async () => {
                // 4. Key header actions are visible (scoped to navbar to avoid footer duplicates)
                const navbar = page.getByLabel('navigation bar');
                await expect(navbar.getByRole('link', { name: 'Log in' })).toBeVisible();
                await expect(navbar.getByRole('link', { name: 'Sign up' })).toBeVisible();
            });

            log.info('Homepage verified', { title: await page.title() });
        });

    // ────────────────────────────────────────────────────────────────────
    // TC-SAN-002 — Global Search Executes
    // ────────────────────────────────────────────────────────────────────
    test('TC-SAN-002 — Global search returns results', { tag: ['@search'] },
        async ({ homePage, page }, testInfo) => {
            const log = new Logger(testInfo);

            await test.step('Navigate to homepage', async () => {
                await homePage.goto();
            });

            await test.step('Search for "laptop"', async () => {
                // 1. Type search query and submit
                await homePage.search.search('laptop');
            });

            await test.step('Verify results page loads', async () => {
                // 2. URL reflects search
                await expect(page).toHaveURL(/search/i);
                // 3. Listing cards are visible
                await expect(page.locator('a[href*="/listing/"]').first()).toBeVisible();
            });

            log.info('Search executed', { url: page.url() });
        });

    // ────────────────────────────────────────────────────────────────────
    // TC-SAN-003 — Property Tab Loads Search Form
    // ────────────────────────────────────────────────────────────────────
    test('TC-SAN-003 — Property tab loads with search form', { tag: ['@property'] },
        async ({ homePage, page }, testInfo) => {
            const log = new Logger(testInfo);

            await test.step('Navigate to Property tab', async () => {
                await homePage.goto();
                await homePage.header.clickPropertyTab();
            });

            await test.step('Verify Property URL', async () => {
                // 1. URL contains /property
                await expect(page).toHaveURL(/\/property/);
            });

            await test.step('Verify property sub-tabs', async () => {
                // 2. Key sub-tabs are visible
                for (const tab of ['For sale', 'For rent']) {
                    await expect(page.getByRole('link', { name: tab }).first()).toBeVisible();
                }
            });

            await test.step('Verify search form is present', async () => {
                // 3. Search button is present on the property page
                await expect(page.getByRole('button', { name: 'Search' }).first()).toBeVisible();
            });

            log.info('Property tab verified', { url: page.url() });
        });

    // ────────────────────────────────────────────────────────────────────
    // TC-SAN-004 — Motors Tab Loads Search Form
    // ────────────────────────────────────────────────────────────────────
    test('TC-SAN-004 — Motors tab loads with search form', { tag: ['@motors'] },
        async ({ homePage, page }, testInfo) => {
            const log = new Logger(testInfo);

            await test.step('Navigate to Motors tab', async () => {
                await homePage.goto();
                await homePage.header.clickMotorsTab();
            });

            await test.step('Verify Motors URL', async () => {
                // 1. URL contains /motors
                await expect(page).toHaveURL(/\/motors/);
            });

            await test.step('Verify motors sub-tabs', async () => {
                // 2. Key sub-tabs are visible
                await expect(page.getByRole('link', { name: 'Cars' }).first()).toBeVisible();
            });

            await test.step('Verify search form fields', async () => {
                // 3. Core form elements are present
                await expect(page.getByLabel('Make')).toBeVisible();
                await expect(page.getByLabel('Location')).toBeVisible();
                await expect(page.getByRole('button', { name: 'View listings' })).toBeVisible();
            });

            log.info('Motors tab verified', { url: page.url() });
        });

    // ────────────────────────────────────────────────────────────────────
    // TC-SAN-005 — Jobs Tab Loads Search Form
    // ────────────────────────────────────────────────────────────────────
    test('TC-SAN-005 — Jobs tab loads with search form', { tag: ['@jobs'] },
        async ({ homePage, page }, testInfo) => {
            const log = new Logger(testInfo);

            await test.step('Navigate to Jobs tab', async () => {
                await homePage.goto();
                await homePage.header.clickJobsTab();
            });

            await test.step('Verify Jobs URL', async () => {
                // 1. URL contains /jobs
                await expect(page).toHaveURL(/\/jobs/);
            });

            await test.step('Verify search form', async () => {
                // 2. Search button is present
                await expect(page.getByRole('button', { name: /Search jobs/i })).toBeVisible();
            });

            log.info('Jobs tab verified', { url: page.url() });
        });

    // ────────────────────────────────────────────────────────────────────
    // TC-SAN-006 — Marketplace Categories Dropdown
    // ────────────────────────────────────────────────────────────────────
    test('TC-SAN-006 — Categories dropdown opens and navigates', { tag: ['@marketplace'] },
        async ({ homePage, page }, testInfo) => {
            const log = new Logger(testInfo);

            await test.step('Navigate to homepage', async () => {
                await homePage.goto();
            });

            await test.step('Open Categories dropdown', async () => {
                // 1. Click the Categories button
                await page.getByRole('button', { name: 'Categories' }).click();
            });

            await test.step('Verify categories are listed', async () => {
                // 2. At least some category links are visible (scoped to dropdown to avoid footer duplicates)
                await expect(page.getByRole('link', { name: 'Electronics & photography' }).first()).toBeVisible();
                await expect(page.getByRole('link', { name: 'Home & living' }).first()).toBeVisible();
            });

            await test.step('Navigate to a category', async () => {
                // 3. Click a category and verify page loads
                await page.getByRole('link', { name: 'Electronics & photography' }).click();
                await expect(page).toHaveURL(/electronics-photography/i);
            });

            log.info('Categories verified', { url: page.url() });
        });

    // ────────────────────────────────────────────────────────────────────
    // TC-SAN-007 — Footer Links Are Present
    // ────────────────────────────────────────────────────────────────────
    test('TC-SAN-007 — Footer contains key links', { tag: ['@footer'] },
        async ({ homePage, page }, testInfo) => {
            const log = new Logger(testInfo);

            await test.step('Navigate to homepage', async () => {
                await homePage.goto();
            });

            await test.step('Scroll to footer and verify links', async () => {
                // 1. Scroll to footer
                await page.locator('footer').first().scrollIntoViewIfNeeded();

                // 2. Key links are present
                await expect(page.getByRole('link', { name: /Contact Us/i }).first()).toBeVisible();
            });

            log.info('Footer verified');
        });

    // ────────────────────────────────────────────────────────────────────
    // TC-SAN-008 — Authentication Links Accessible
    // ────────────────────────────────────────────────────────────────────
    test('TC-SAN-008 — Auth links are present in header', { tag: ['@auth'] },
        async ({ homePage, page }, testInfo) => {
            const log = new Logger(testInfo);

            await test.step('Navigate to homepage', async () => {
                await homePage.goto();
            });

            await test.step('Verify auth links are visible', async () => {
                // 1. Log in and Sign up links present (scoped to navbar)
                const navbar = page.getByLabel('navigation bar');
                await expect(navbar.getByRole('link', { name: 'Log in' })).toBeVisible();
                await expect(navbar.getByRole('link', { name: 'Sign up' })).toBeVisible();
            });

            log.info('Auth links verified');
        });
});
