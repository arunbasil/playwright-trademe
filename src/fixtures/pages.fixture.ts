import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/shared/HomePage';
import { MotorsSearchPage } from '../pages/motors/MotorsSearchPage';
import { MotorsResultsPage } from '../pages/motors/MotorsResultsPage';
import { MotorsDetailPage } from '../pages/motors/MotorsDetailPage';
import { PropertySearchPage } from '../pages/property/PropertySearchPage';
import { PropertyResultsPage } from '../pages/property/PropertyResultsPage';
import { PropertyDetailPage } from '../pages/property/PropertyDetailPage';

/**
 * Custom test fixture that pre-wires all page objects.
 *
 * Tests import { test, expect } from '../../fixtures/pages.fixture'
 * instead of '@playwright/test'. All page objects are injected automatically —
 * no manual instantiation in test files.
 *
 * To add a new page object:
 *  1. Import it here.
 *  2. Add it to PageFixtures type.
 *  3. Add its fixture definition below.
 */
type PageFixtures = {
    homePage: HomePage;
    motorsSearchPage: MotorsSearchPage;
    motorsResultsPage: MotorsResultsPage;
    motorsDetailPage: MotorsDetailPage;
    propertySearchPage: PropertySearchPage;
    propertyResultsPage: PropertyResultsPage;
    propertyDetailPage: PropertyDetailPage;
};

export const test = base.extend<PageFixtures>({
    homePage:           async ({ page }, use) => { await use(new HomePage(page)); },
    motorsSearchPage:   async ({ page }, use) => { await use(new MotorsSearchPage(page)); },
    motorsResultsPage:  async ({ page }, use) => { await use(new MotorsResultsPage(page)); },
    motorsDetailPage:   async ({ page }, use) => { await use(new MotorsDetailPage(page)); },
    propertySearchPage: async ({ page }, use) => { await use(new PropertySearchPage(page)); },
    propertyResultsPage: async ({ page }, use) => { await use(new PropertyResultsPage(page)); },
    propertyDetailPage: async ({ page }, use) => { await use(new PropertyDetailPage(page)); },
});

export { expect };
