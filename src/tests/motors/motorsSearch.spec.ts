import { test, expect } from '../../fixtures/pages.fixture';
import { Logger } from '../../utils/logger';
import motorsData from '../../data/motors/motorsData.json';

// TC-MOTORS-001
test.describe('Motors Search', { tag: ['@regression', '@motors'] }, () => {
    test.setTimeout(90_000);

    test('TC-MOTORS-001 — should search for an RV/SUV and validate the last listing detail page',
        async ({ homePage, motorsSearchPage, motorsResultsPage, motorsDetailPage, page }, testInfo) => {
            const log = new Logger(testInfo);
            const { make, location, yearFrom, priceMax, bodyStyle, fuel } = motorsData.common;

            await test.step('Navigate to Motors tab', async () => {
                await homePage.goto();
                await homePage.header.clickMotorsTab();
            });

            await test.step('Apply search filters', async () => {
                await motorsSearchPage.selectMake(make);
                await motorsSearchPage.selectLocation(location);
                await motorsSearchPage.selectYearFrom(yearFrom);
                await motorsSearchPage.selectPriceMax(priceMax);
                await motorsSearchPage.selectBodyStyle(bodyStyle);
                await motorsSearchPage.selectFuelType(fuel);
            });

            await test.step('Submit search and wait for results', async () => {
                await motorsSearchPage.clickSearch();
                await page.waitForLoadState('networkidle');
            });

            const resultCount = await motorsResultsPage.getResultCount();
            log.info('Search results', { count: resultCount, make, location, yearFrom, priceMax, bodyStyle, fuel });

            if (resultCount === 0) {
                log.skip('No results for motors search — skipping detail validation');
                test.skip(true, 'No results for motors search');
                return;
            }

            await test.step('Navigate to last page of results', async () => {
                await motorsResultsPage.goToLastPage();
            });

            await test.step('Open last listing', async () => {
                await motorsResultsPage.listings.clickLast();
            });

            await test.step('Validate detail page', async () => {
                await motorsDetailPage.waitForPageLoad();
                await expect(page).toHaveURL(/\/listing\//);
                await motorsDetailPage.validateMainElements();
            });

            const title = await motorsDetailPage.getTitleText();
            const price = await motorsDetailPage.getPriceText();
            log.info('Listing details', { title, price, url: page.url() });
        });
});
