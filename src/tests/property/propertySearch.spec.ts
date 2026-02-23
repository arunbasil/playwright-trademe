import { test, expect } from '../../fixtures/pages.fixture';
import { Logger } from '../../utils/logger';
import propertyData from '../../data/property/propertyData.json';

// TC-PROP-001
test.describe('Property Search — Bedroom Scenarios', { tag: ['@regression', '@property'] }, () => {
    test.setTimeout(90_000);

    const { region, district, suburb, propertyType, maxPrice } = propertyData.common;

    for (const beds of propertyData.bedroomOptions) {
        test(`TC-PROP-001 — Bedrooms: "${beds}" → validate last listing`,
            async ({ homePage, propertySearchPage, propertyResultsPage, propertyDetailPage, page }, testInfo) => {
                const log = new Logger(testInfo);

                await test.step('Navigate to Property tab', async () => {
                    await homePage.goto();
                    await homePage.header.clickPropertyTab();
                });

                await test.step('Apply search filters', async () => {
                    await propertySearchPage.selectRegion(region);
                    await propertySearchPage.selectDistrict(district);
                    await propertySearchPage.selectSuburb(suburb);
                    await propertySearchPage.selectPropertyType(propertyType);
                    await propertySearchPage.selectMaxPrice(maxPrice);
                    await propertySearchPage.selectBedrooms(beds);
                });

                await test.step('Submit search and wait for results', async () => {
                    await propertySearchPage.clickSearch();
                    await page.waitForLoadState('domcontentloaded');
                });

                const resultCount = await propertyResultsPage.getResultCount();
                log.info('Search results', { beds, count: resultCount, region, district, suburb });

                if (resultCount === 0) {
                    log.skip(`No results for bedroom filter "${beds}"`);
                    test.skip(true, `No results for bedroom filter "${beds}"`);
                    return;
                }

                await test.step('Navigate to last page of results', async () => {
                    await propertyResultsPage.goToLastPage();
                });

                await test.step('Open last listing', async () => {
                    await propertyResultsPage.listings.clickLast();
                });

                await test.step('Validate detail page', async () => {
                    await propertyDetailPage.waitForPageLoad();
                    await expect(page).toHaveURL(/\/listing\//);
                    await propertyDetailPage.validateMainElements();
                });

                const address = await propertyDetailPage.getAddressText();
                const title = await propertyDetailPage.getListingTitleText();
                const price = await propertyDetailPage.getPriceText();
                const listingId = await propertyDetailPage.getListingId();
                log.info('Listing details', { listingId, address, title, price, url: page.url() });
            });
    }
});
