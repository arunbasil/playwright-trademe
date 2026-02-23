import { type Locator, type Page, expect } from '@playwright/test';

export class MotorsDetailPage {
    readonly page: Page;

    // Title heading
    readonly titleHeading: Locator;
    // Price display
    readonly priceDisplay: Locator;
    // Vehicle attributes (mileage, body, fuel, etc.)
    readonly attributesList: Locator;
    // Listing number
    readonly listingNumber: Locator;

    constructor(page: Page) {
        this.page = page;

        this.titleHeading = page.locator('h1').first();
        this.priceDisplay = page.getByText(/asking price|\$[\d,]+/i).first();
        this.attributesList = page.locator('tm-vehicle-attributes').first();
        this.listingNumber = page.getByText(/Listing #/).first();
    }

    async waitForPageLoad() {
        await this.titleHeading.waitFor({ state: 'visible', timeout: 15000 });
    }

    async validateMainElements() {
        // 1. Title heading
        await expect(this.titleHeading).toBeVisible();
        const title = await this.titleHeading.textContent();
        expect(title?.trim().length).toBeGreaterThan(0);

        // 2. Price display
        await expect(this.priceDisplay).toBeVisible();

        // 3. Vehicle attributes section
        if (await this.attributesList.isVisible()) {
            await expect(this.attributesList).toBeVisible();
        }

        // 4. Listing number
        if (await this.listingNumber.isVisible()) {
            await expect(this.listingNumber).toBeVisible();
        }
    }

    async getTitleText(): Promise<string> {
        return (await this.titleHeading.textContent()) ?? '';
    }

    async getPriceText(): Promise<string> {
        return (await this.priceDisplay.textContent()) ?? '';
    }

    async getListingId(): Promise<string> {
        const text = (await this.listingNumber.textContent()) ?? '';
        return text.replace(/.*#/, '').trim();
    }
}
