# Enterprise Playwright Project Standards
- **Environment**: Base URL is `https://www.trademe.co.nz` (Angular SPA)

## Architecture
- **Pattern**: Strict Page Object Model (POM) with **category-based folders**:
  - Pages: `src/pages/{shared,property,motors}/`
  - Tests: `src/tests/{shared,property,motors}/`
  - Data:  `src/data/{property,motors}/`
- **BasePage**: All page objects extend `src/pages/shared/BasePage.ts`. Navigation to sections (Property, Motors) is via `this.header` (HeaderComponent).
- **Components**: Reusable UI components live in `src/components/` (e.g. `HeaderComponent`, `SearchBarComponent`, `ListingCardComponent`).
- **Fixtures**: Tests import `{ test, expect }` from `src/fixtures/pages.fixture.ts` — **not** from `@playwright/test`. Page objects are injected via custom fixtures; never instantiate them manually in tests.
- **Logger**: Use `src/utils/logger.ts` for structured test logging (not raw `console.log`).
- **Hybrid Strategy**: Use `request` (API) for setup/teardown; `page` (UI) only for the core user journey.
- **Locators**: Use `getByRole`, `getByLabel`, or `getByTestId`. Never use XPath or brittle CSS selectors.

## Test Conventions
- **Test IDs**: Prefix tests with IDs like `TC-PROP-001`, `TC-HOME-001`.
- **Tags**: Use `@sanity`, `@regression`, `@property`, `@motors`, `@home` in `test.describe()`.
- **Steps**: Wrap logical blocks in `test.step('description', ...)` for structured HTML reports.
- **Zero results**: Use `test.skip()` (not hard failure) when search filters return 0 results.

## Angular SPA Gotchas
- **Never use `networkidle`**: TradeMe keeps persistent connections. Use `domcontentloaded` or element waits instead.
- **Overlay dismissal**: Use `page.keyboard.press('Escape')` after interacting with checkbox dropdowns (body style, fuel type, suburb).
- **Force clicks**: Some elements are blocked by Angular overlays — use `{ force: true }` only as last resort.

## Data & Environments
- **Data-Driven**: Store test data in `src/data/{category}/*.json`.
- **Environments**: Use `.env` files and `process.env` for URLs and credentials.
- **CI/CD**: Ensure `playwright.config.ts` includes `trace: 'on-first-retry'` and `reporter: 'html'`.

## Commands
- Test all:       `npx playwright test`
- Test category:  `npx playwright test src/tests/motors/`
- Test by tag:    `npx playwright test --grep @sanity`
- Headed + slow:  `SLOW_MO=500 npx playwright test --project=chromium --headed`
- UI Mode:        `npx playwright test --ui`
- Show report:    `npx playwright show-report`

## Skills Reference
- Consult `.skills/playwright-skill/` for Playwright best practices before debugging issues.