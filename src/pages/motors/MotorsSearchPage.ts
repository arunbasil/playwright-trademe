import { type Locator, type Page } from '@playwright/test';

/**
 * Represents the motors search form on the Motors landing page.
 *
 * Filter options are passed as exact label text matching the dropdown values.
 * Location options:  "Any region" | "Auckland" | "Canterbury" | …
 * Year options:      "Any" | "2010" | … | "2025" | "2026" | …
 * Price Max options:  "Any" | "$1k" | "$2k" | … | "$50k" | … | "$200k"
 * Body style:        "Cab Chassis" | "Convertible" | "Coupe" | "Hatchback" | "RV/SUV" | "Sedan" | …
 * Fuel type:         "Diesel" | "Electric" | "Hybrid" | "Petrol" | …
 */
export class MotorsSearchPage {
    readonly page: Page;
    readonly searchButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchButton = page.getByRole('button', { name: 'View listings' });
    }

    async selectMake(make: string) {
        // Make defaults to "Any make" — only change if a specific make is requested
        if (make !== 'Any make') {
            await this.page.getByLabel('Make').selectOption({ label: make });
        }
    }

    async selectLocation(location: string) {
        await this.page.getByLabel('Location').selectOption({ label: location });
    }

    async selectYearFrom(year: string) {
        await this.page.getByLabel('Start Year').selectOption({ label: year });
    }

    async selectPriceMax(price: string) {
        await this.page.getByLabel('Maximum Price').selectOption({ label: price });
    }

    async selectBodyStyle(bodyStyle: string) {
        // Open the body style multi-select overlay
        await this.page.getByRole('button', { name: 'Any body style' }).click();
        await this.page.getByText(bodyStyle, { exact: true }).click();
        await this.page.keyboard.press('Escape');
    }

    async selectFuelType(fuel: string) {
        // Open the fuel type multi-select overlay
        await this.page.getByRole('button', { name: 'Any fuel type' }).click();
        await this.page.getByText(fuel, { exact: true }).click();
        await this.page.keyboard.press('Escape');
    }

    async clickSearch() {
        await this.searchButton.click();
    }
}
