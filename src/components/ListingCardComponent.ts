import { type Locator, type Page } from '@playwright/test';

/**
 * Reusable listing card component used across Motors, Property, and Marketplace results.
 * Encapsulates all interactions with the listing card grid/list.
 */
export class ListingCardComponent {
    constructor(private readonly page: Page) { }

    private get cards(): Locator {
        return this.page.locator('a[href*="/listing/"]');
    }

    /** Wait for at least one listing card to be visible. */
    async waitForCards(timeout = 15_000) {
        await this.cards.first().waitFor({ state: 'visible', timeout });
    }

    /** Returns true if at least one listing card is visible, false otherwise. */
    async hasCards(timeout = 10_000): Promise<boolean> {
        try {
            await this.cards.first().waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Click the last listing card on the current page.
     * Note: Do NOT call scrollIntoViewIfNeeded() before click() —
     * Playwright's click() scrolls automatically, and the extra call
     * creates a window for stale DOM references in Angular SPAs.
     */
    async clickLast() {
        await this.cards.first().waitFor({ state: 'visible', timeout: 10_000 });
        await this.cards.last().click();
    }
}
