import { type Locator, type Page, expect } from '@playwright/test';

export class PropertyDetailPage {
    readonly page: Page;

    // Address (h1) - always present
    readonly addressHeading: Locator;
    // Listing title (h2) - the marketing title
    readonly listingTitle: Locator;
    // Price display (h2)
    readonly priceDisplay: Locator;
    // Listed date text
    readonly listedDate: Locator;
    // Property stats in details list
    readonly bedroomsInfo: Locator;
    readonly bathroomsInfo: Locator;
    readonly floorAreaInfo: Locator;
    // Property attributes table
    readonly propertyTypeCell: Locator;
    // Description content (the heading is visually-hidden; validate visible content instead)
    readonly descriptionContent: Locator;
    // Gallery images
    readonly galleryImage: Locator;
    // Agent details section
    readonly agentDetailsHeading: Locator;
    // Navigation
    readonly backToSearchButton: Locator;
    // Footer metadata
    readonly listingNumber: Locator;
    // Additional sections
    readonly openHomesHeading: Locator;
    readonly shareListingHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addressHeading = page.locator('h1').first();
        // listing title is the h2 BEFORE the h1 (comes after "Listing Description" h2)
        this.listingTitle = page.getByRole('heading', { level: 2 }).nth(1);
        // price h2 comes right after h1 in the listing content
        this.priceDisplay = page.getByRole('heading', { level: 2 }).filter({
            hasText: /negotiation|asking|tender|auction|deadline|\$/i,
        }).first();
        this.listedDate = page.getByText(/Listed:/).first();
        this.bedroomsInfo = page.getByText(/\d+\s*Bed/i).first();
        this.bathroomsInfo = page.getByText(/\d+\s*Bath/i).first();
        this.floorAreaInfo = page.getByText(/\d+m²\s*Floor/i).first();
        this.propertyTypeCell = page.getByRole('cell', { name: 'Property type' });
        // "Description" h3 is visually hidden — check the visible "Show more" expand button instead
        this.descriptionContent = page.getByRole('button', { name: /show more/i });
        this.galleryImage = page.locator('img[alt^="gallery carousel"]').first();
        this.agentDetailsHeading = page.getByRole('heading', { name: "Agent's details" });
        this.backToSearchButton = page.getByRole('button', { name: /back to search/i });
        this.listingNumber = page.getByText(/Listing #/).first();
        this.openHomesHeading = page.getByRole('heading', { name: 'Open home times' });
        this.shareListingHeading = page.getByRole('heading', { name: 'Share this listing' });
    }

    async waitForPageLoad() {
        await this.addressHeading.waitFor({ state: 'visible', timeout: 15000 });
    }

    async validateMainElements() {
        // 1. Address (h1) — visible and has text content
        await expect(this.addressHeading).toBeVisible();
        const addressText = await this.addressHeading.textContent();
        expect(addressText?.trim().length).toBeGreaterThan(0);

        // 2. Listed date
        await expect(this.listedDate).toBeVisible();

        // 3. Listing title (h2)
        await expect(this.listingTitle).toBeVisible();

        // 4. Price display
        await expect(this.priceDisplay).toBeVisible();

        // 5. Bedrooms and bathrooms in the details list
        await expect(this.bedroomsInfo).toBeVisible();
        await expect(this.bathroomsInfo).toBeVisible();

        // 6. Floor area (may be optional on some listings)
        if (await this.floorAreaInfo.isVisible()) {
            await expect(this.floorAreaInfo).toBeVisible();
        }

        // 7. Property type in the attributes table
        await expect(this.propertyTypeCell).toBeVisible();

        // 8. Description content is present — "Show more" button visible means text was rendered
        await expect(this.descriptionContent).toBeVisible();

        // 9. Gallery — at least one carousel image present
        await expect(this.galleryImage).toBeVisible();

        // 10. Agent's details section
        await expect(this.agentDetailsHeading).toBeVisible();

        // 11. Open home times section
        await expect(this.openHomesHeading).toBeVisible();

        // 12. Share this listing section
        await expect(this.shareListingHeading).toBeVisible();

        // 13. Back to search results button
        await expect(this.backToSearchButton).toBeVisible();

        // 14. Listing number in the page footer metadata
        await expect(this.listingNumber).toBeVisible();
    }

    async getAddressText(): Promise<string> {
        return (await this.addressHeading.textContent()) ?? '';
    }

    async getListingTitleText(): Promise<string> {
        return (await this.listingTitle.textContent()) ?? '';
    }

    async getPriceText(): Promise<string> {
        return (await this.priceDisplay.textContent()) ?? '';
    }

    async getListingId(): Promise<string> {
        const text = (await this.listingNumber.textContent()) ?? '';
        return text.replace(/.*#/, '').trim();
    }
}
