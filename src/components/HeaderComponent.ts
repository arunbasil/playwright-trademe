import { type Page } from '@playwright/test';

/**
 * Reusable header component shared across all pages.
 * Covers the top nav bar: category tabs and auth action links.
 */
export class HeaderComponent {
    constructor(private readonly page: Page) { }

    async clickMarketplaceTab() {
        await this.page.getByRole('link', { name: 'Marketplace', exact: true }).first().click();
    }

    async clickPropertyTab() {
        await this.page.getByRole('link', { name: 'Property', exact: true }).first().click();
    }

    async clickMotorsTab() {
        await this.page.getByRole('link', { name: 'Motors', exact: true }).first().click();
    }

    async clickJobsTab() {
        await this.page.getByRole('link', { name: 'Jobs', exact: true }).first().click();
    }

    async clickServicesTab() {
        await this.page.getByRole('link', { name: 'Services', exact: true }).first().click();
    }

    async clickSignUp() {
        await this.page.getByLabel('navigation bar').getByRole('link', { name: 'Sign up' }).click();
    }

    async clickLogIn() {
        await this.page.getByLabel('navigation bar').getByRole('link', { name: 'Log in' }).click();
    }
}
