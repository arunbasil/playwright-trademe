# Trade Me — Playwright E2E Test Suite

End-to-end test automation for [trademe.co.nz](https://www.trademe.co.nz) built with Playwright and TypeScript.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
  - [Components](#components)
  - [Pages](#pages)
  - [Fixtures](#fixtures)
  - [Logger](#logger)
- [Running Tests](#running-tests)
- [Test Tags — Sanity vs Regression](#test-tags--sanity-vs-regression)
- [Adding Requirements & Tests](#adding-requirements--tests)
- [Environment Configuration](#environment-configuration)
- [Writing a New Test — Step by Step](#writing-a-new-test--step-by-step)
- [Debugging](#debugging)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Copy env file and configure
cp .env.example .env

# 4. Run sanity suite (fast, ~1 min)
npm run test:sanity

# 5. View HTML report
npm run test:report
```

---

## Project Structure

```
.
├── src/
│   ├── components/              # Reusable UI components (shared across pages)
│   │   ├── HeaderComponent.ts   # Top nav: category tabs, Sign up, Log in
│   │   ├── SearchBarComponent.ts# Global header search bar
│   │   └── ListingCardComponent.ts # Listing card grid — Motors, Property, Marketplace
│   │
│   ├── pages/                   # Page Object Model (one class per page/section)
│   │   ├── shared/
│   │   │   ├── BasePage.ts      # Abstract base — composes Header, provides waitForPageLoad
│   │   │   └── HomePage.ts      # Home page (/) — composes SearchBar + BasePage
│   │   ├── motors/
│   │   │   ├── MotorsSearchPage.ts   # Motors filter form
│   │   │   ├── MotorsResultsPage.ts  # Motors search results + pagination
│   │   │   └── MotorsDetailPage.ts   # Individual motor listing detail
│   │   └── property/
│   │       ├── PropertySearchPage.ts  # Property filter form
│   │       ├── PropertyResultsPage.ts # Property results + pagination
│   │       └── PropertyDetailPage.ts  # Individual property listing detail
│   │
│   ├── fixtures/
│   │   └── pages.fixture.ts     # Custom test fixture — injects all page objects
│   │
│   ├── tests/                   # Test specs (mirror the pages/ structure)
│   │   ├── shared/
│   │   │   └── home.spec.ts
│   │   ├── motors/
│   │   │   └── motorsSearch.spec.ts
│   │   └── property/
│   │       └── propertySearch.spec.ts
│   │
│   ├── data/                    # Test data (JSON, data-driven tests)
│   │   ├── motors/motorsData.json
│   │   └── property/propertyData.json
│   │
│   └── utils/
│       └── logger.ts            # Structured logger — attaches to HTML report
│
├── specs/                       # Requirements documents (source of truth for tests)
│   ├── home.md
│   ├── motors-search.md
│   └── property-search.md
│
├── .env.example                 # Environment variable template
├── playwright.config.ts         # Playwright configuration
└── package.json
```

---

## Architecture

### Components

Reusable building blocks that are **shared across multiple pages**. A component maps to a discrete section of the UI.

| Component | Responsibility |
|---|---|
| `HeaderComponent` | Category tabs (Marketplace, Property, Motors, Jobs, Services), Sign up, Log in |
| `SearchBarComponent` | Global header search input and submit |
| `ListingCardComponent` | Listing card grid — `waitForCards()`, `hasCards()`, `clickLast()` |

Components are composed inside page objects — never instantiated directly in tests.

```
HomePage
  └── BasePage
        └── HeaderComponent     ← homePage.header.clickMotorsTab()
  └── SearchBarComponent        ← homePage.search.search('bike')

MotorsResultsPage
  └── ListingCardComponent      ← motorsResultsPage.listings.clickLast()
```

### Pages

Each page class represents a single page or major section. Pages extend `BasePage` which gives them `this.header` and `this.waitForPageLoad()` for free.

**Rule:** pages only interact with their own section of the DOM. Cross-page navigation goes through `header`.

### Fixtures

`src/fixtures/pages.fixture.ts` extends Playwright's `test` with all page objects pre-wired.

```typescript
// In every test file — instead of @playwright/test:
import { test, expect } from '../../fixtures/pages.fixture';

// Page objects arrive injected — no manual `new`:
test('example', async ({ homePage, motorsResultsPage }) => {
    await homePage.goto();
    await homePage.header.clickMotorsTab();
});
```

To add a new page object, register it once in `pages.fixture.ts` — every test file gets it automatically.

### Logger

`src/utils/logger.ts` provides structured diagnostic logging that appears in the **HTML report** (under each test's annotations tab) as well as stdout.

```typescript
const log = new Logger(testInfo);
log.info('Search results', { count: 42, beds: '3 +' });
log.warn('Pagination not visible — assuming single page');
log.skip('No results for this filter combination');
```

Use `log.info()` for key data values (counts, IDs, URLs). Do **not** use `console.log` directly in tests.

---

## Running Tests

| Command | What it runs |
|---|---|
| `npm test` | All tests |
| `npm run test:sanity` | Sanity suite only (`@sanity`) |
| `npm run test:regression` | Full regression suite (`@regression`) |
| `npm run test:home` | Home page tests only |
| `npm run test:motors` | Motors tests only |
| `npm run test:property` | Property tests only |
| `npm run test:headed` | All tests in headed (visible) browser |
| `npm run test:ui` | Playwright UI mode — interactive test runner |
| `npm run test:debug` | Debug mode with Playwright Inspector |
| `npm run test:report` | Open last HTML report |

---

## Test Tags — Sanity vs Regression

Every test is tagged at the `describe` block level. Tags control which suite it belongs to.

| Tag | Purpose | When to run |
|---|---|---|
| `@sanity` | Critical path — must always pass | Every commit, pre-deploy gate |
| `@regression` | Full coverage | Nightly, or before a release |
| `@home` | Home page area | When home page changes |
| `@motors` | Motors area | When motors feature changes |
| `@property` | Property area | When property feature changes |

A test can carry multiple tags:

```typescript
test.describe('Motors Search', { tag: ['@regression', '@motors'] }, () => { ... });
```

Run a specific combination:
```bash
# Only regression tests in the motors area:
npx playwright test --grep "@regression" --grep "@motors"
```

---

## Adding Requirements & Tests

Requirements live in `specs/` as Markdown files. They are the **single source of truth** — business requirement and test documentation in one place, version-controlled in git.

### Workflow

1. **Add a scenario** to the relevant spec file (e.g. `specs/motors-search.md`):
   ```markdown
   ### TC-MOTORS-002 — No results state is handled gracefully
   | Field | Value |
   |---|---|
   | **Status** | 🔲 Not implemented |
   | **Tags** | `@regression` `@motors` |
   ...
   ```

2. **Ask Claude to implement it:**
   > *"Implement all unimplemented scenarios in specs/motors-search.md"*

3. Claude reads the spec, writes the test, updates `Status` to `✅ Implemented`.

### Spec file anatomy

```markdown
### TC-[AREA]-[NNN] — [Human-readable scenario name]

| Field     | Value                              |
|-----------|------------------------------------|
| Tags      | `@sanity` or `@regression` + area  |
| Status    | 🔲 Not implemented / ✅ Implemented |
| Priority  | P0 (blocker) / P1 / P2             |
| Data      | Reference to data/*.json or inline |

**Steps**: numbered list of user actions
**Assertions**: bullet list of expected outcomes
```

### Priority guide

| Priority | Meaning |
|---|---|
| P0 | Blocker — app is broken without this working |
| P1 | Core user journey |
| P2 | Edge case, nice-to-have coverage |

---

## Environment Configuration

Copy `.env.example` to `.env` and edit as needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://www.trademe.co.nz` | Target environment URL |
| `SLOW_MO` | `0` | Milliseconds between actions (useful for local debugging) |

For CI, set `CI=true`. This enables:
- `forbidOnly` — prevents accidentally committed `.only` tests from passing
- `retries: 2` — retries flaky tests twice
- `workers: 1` — serialises tests to reduce resource contention

---

## Writing a New Test — Step by Step

1. **Write the requirement** in the relevant `specs/*.md` file.

2. **Add test data** to `src/data/<area>/<area>Data.json` if the test is data-driven.

3. **Create or update a page object** in `src/pages/<area>/` if new UI interactions are needed.
   - Extend `BasePage` for top-level pages.
   - Compose existing components (`HeaderComponent`, `ListingCardComponent`) rather than duplicating selectors.
   - Use only `getByRole()`, `getByLabel()`, or `getByTestId()` — never XPath or brittle CSS class selectors.

4. **Register new page objects** in `src/fixtures/pages.fixture.ts`.

5. **Write the test** in `src/tests/<area>/`.
   - Import from `../../fixtures/pages.fixture` (not `@playwright/test`).
   - Tag the `describe` block with `@sanity` or `@regression` plus the area tag.
   - Use `test.step()` for every logical step — steps appear in the HTML report.
   - Use `Logger` for diagnostic data, not `console.log`.
   - Never use `page.waitForTimeout()` — use `page.waitForLoadState()` or web-first assertions.

6. **Verify** the test appears in the correct suite:
   ```bash
   npx playwright test --list --grep @sanity
   ```

---

## Debugging

| Scenario | Command |
|---|---|
| See browser during test | `npm run test:headed` |
| Step through interactively | `npm run test:debug` |
| Use Playwright UI mode | `npm run test:ui` |
| Re-open last report | `npm run test:report` |
| View trace on failure | Open `playwright-report/index.html` → click failed test → Traces tab |

Traces, screenshots, and videos are captured automatically on first retry — no config needed.
