import { type Page } from '@playwright/test';
import { HeaderComponent } from '../../components/HeaderComponent';

/**
 * Abstract base class for all page objects.
 * Provides shared components (header) and common utilities (waitForPageLoad).
 * Every page class should extend this.
 */
export abstract class BasePage {
    readonly header: HeaderComponent;

    constructor(protected readonly page: Page) {
        this.header = new HeaderComponent(page);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}
