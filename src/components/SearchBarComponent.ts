import { type Locator, type Page } from '@playwright/test';

/**
 * Reusable global search bar component (header search on every page).
 * Use this for keyword searches from the top-level search bar.
 * Section-specific search forms (Motors, Property) live in their own page objects.
 */
export class SearchBarComponent {
    private readonly input: Locator;
    private readonly submitButton: Locator;

    constructor(private readonly page: Page) {
        this.input = page.getByRole('searchbox');
        this.submitButton = page.getByRole('button', { name: 'Search' }).first();
    }

    async search(query: string) {
        await this.input.fill(query);
        await this.submitButton.click();
    }
}
