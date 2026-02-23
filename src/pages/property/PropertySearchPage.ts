import { type Locator, type Page } from '@playwright/test';

/**
 * Represents the property search form on the Property landing page.
 *
 * All selectors use the visible label text from the dropdown options, matching
 * what is stored in the test-data JSON. This means no index arithmetic or
 * hard-coded maps — changing a filter value is a one-line edit in the data file.
 *
 * Bedroom options (pass exact label):  "Any" | "Studio +" | "1 +" | "2 +" | "3 +" | "4 +" | "5 +" | "6 +"
 * Bathroom options:                    "Any" | "1 +" | "2 +" | "3 +" | "4 +" | "5 +" | "6 +"
 * Price options (pass exact label):    "Any" | "$100k" | "$200k" | … | "$1.5M" | … | "$10M"
 * Property type (pass exact label):    "Apartment" | "House" | "Lifestyle bare land" | … | "Unit"
 */
export class PropertySearchPage {
    readonly page: Page;
    readonly searchButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchButton = page.getByRole('button', { name: 'Search' });
    }

    async selectRegion(region: string) {
        // e.g. region = "Auckland"
        await this.page.getByLabel('Location').selectOption({ label: region });
    }

    async selectDistrict(district: string) {
        // District dropdown is disabled until a region is chosen
        await this.page.getByLabel('District').waitFor({ state: 'visible' });
        // e.g. district = "Rodney"
        await this.page.getByLabel('District').selectOption({ label: district });
    }

    async selectSuburb(suburb: string) {
        // Open the suburb multi-select overlay
        await this.page.getByRole('button', { name: 'All suburbs' }).click();
        // Click the visible label text — clicking the hidden checkbox directly
        // bypasses Angular's event listeners and leaves "All Suburbs" selected.
        // e.g. suburb = "Millwater"
        await this.page.getByText(suburb, { exact: true }).click();
        await this.page.keyboard.press('Escape');
    }

    async selectBedrooms(beds: string) {
        // Pass the exact option label from propertyData.json, e.g. "5 +"
        // Supported values: "Any" | "Studio +" | "1 +" | "2 +" | "3 +" | "4 +" | "5 +" | "6 +"
        await this.page.getByLabel('Bedrooms').selectOption({ label: beds });
    }

    async selectPropertyType(type: string) {
        // Open the property-type multi-select overlay
        await this.page.getByRole('button', { name: 'Property type' }).click();
        // Click the visible label text — clicking the hidden checkbox directly
        // bypasses Angular's event listeners and leaves nothing selected.
        // e.g. type = "House"
        await this.page.getByText(type, { exact: true }).click();
        await this.page.keyboard.press('Escape');
    }

    async selectMaxPrice(price: string) {
        // Pass the exact option label from propertyData.json, e.g. "$1.5M"
        await this.page.getByLabel('Max price').selectOption({ label: price });
    }

    async selectMinPrice(price: string) {
        // Pass the exact option label, e.g. "$500k"
        await this.page.getByLabel('Min price').selectOption({ label: price });
    }

    async clickSearch() {
        await this.searchButton.click();
    }
}
