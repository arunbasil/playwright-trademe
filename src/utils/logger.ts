import { type TestInfo } from '@playwright/test';

/**
 * Structured logger for test diagnostics.
 *
 * - Attaches messages as annotations visible in the HTML report (under each test).
 * - Also writes to stdout so CI logs capture them.
 *
 * Usage:
 *   const log = new Logger(testInfo);
 *   log.info('Search results', { count: 42, filters: { beds: '3 +' } });
 */
export class Logger {
    constructor(private readonly testInfo: TestInfo) {}

    info(message: string, data?: Record<string, unknown>): void {
        this.log('info', message, data);
    }

    warn(message: string, data?: Record<string, unknown>): void {
        this.log('warn', message, data);
    }

    skip(reason: string): void {
        this.log('skip', reason);
    }

    private log(level: string, message: string, data?: Record<string, unknown>): void {
        const entry = data ? `${message} — ${JSON.stringify(data)}` : message;
        this.testInfo.annotations.push({ type: level, description: entry });
        console[level === 'info' ? 'info' : 'warn'](`[${level.toUpperCase()}]  ${entry}`);
    }
}
