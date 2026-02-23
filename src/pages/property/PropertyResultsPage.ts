import { type Page } from '@playwright/test';
import { ListingCardComponent } from '../../components/ListingCardComponent';

export class PropertyResultsPage {
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
        const heading = this.page.getByRole('heading', { level: 3 }).filter({
            hasText: /Showing \d+ results/i,
        });
        const text = (await heading.textContent()) ?? '';
        const match = text.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }

    async goToLastPage() {
        await this.waitForResults();

        const paginationNav = this.page.getByRole('navigation', { name: 'Pagination' });
        if (!await paginationNav.isVisible()) return;

        // Get the last numbered page link (exclude Next / Previous text links)
        const lastPageLink = paginationNav
            .getByRole('link')
            .filter({ hasNotText: /next|previous/i })
            .last();

        const lastPageText = (await lastPageLink.textContent())?.trim() ?? '';
        const currentPageLink = paginationNav.getByRole('link', { name: /current page/i });
        const currentPageText = (await currentPageLink.textContent())?.trim() ?? '';

        // Only navigate if we're not already on the last page
        if (lastPageText && lastPageText !== currentPageText) {
            await lastPageLink.scrollIntoViewIfNeeded();
            await lastPageLink.click();
            await this.waitForResults();
        }
    }
}
