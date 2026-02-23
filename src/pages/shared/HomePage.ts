import { type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SearchBarComponent } from '../../components/SearchBarComponent';

/**
 * Home page — the root entry point at `/`.
 *
 * Navigation between sections is via `this.header` (inherited from BasePage):
 *   await homePage.header.clickMotorsTab();
 *   await homePage.header.clickPropertyTab();
 *
 * Global keyword search is via `this.search`:
 *   await homePage.search.search('vintage bike');
 */
export class HomePage extends BasePage {
    readonly search: SearchBarComponent;

    constructor(page: Page) {
        super(page);
        this.search = new SearchBarComponent(page);
    }

    async goto() {
        await this.page.goto('/');
        await this.waitForPageLoad();
    }
}
