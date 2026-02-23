import { type Page } from '@playwright/test';
import { ListingCardComponent } from '../../components/ListingCardComponent';

export class MotorsResultsPage {
    readonly page: Page;
    readonly listings: ListingCardComponent;

    constructor(page: Page) {
        this.page = page;
        this.listings = new ListingCardComponent(page);
    }

    async waitForResults() {
        await this.listings.waitForCards();
    }

    async getResultCount(): Promise<number> {
        const heading = this.page.getByText(/Showing [\d,]+ results/i).first();
        const text = (await heading.textContent()) ?? '';
        const match = text.replace(/,/g, '').match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }

    async goToLastPage() {
        await this.waitForResults();

        // TradeMe motors uses aria-label="Last page, page N"
        const lastPageButton = this.page.getByLabel(/Last page, page \d+/);
        if (!await lastPageButton.isVisible()) return;

        await lastPageButton.scrollIntoViewIfNeeded();
        await lastPageButton.click();
        await this.waitForResults();
    }
}
