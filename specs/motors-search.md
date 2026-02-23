# Feature: Motors Search

**Area tag**: `@motors`
**Implemented in**: `src/tests/motors/motorsSearch.spec.ts`
**Test data**: `src/data/motors/motorsData.json`

## Overview

The Motors section (`/motors`) allows users to search for vehicles using filters:
make, location, year, price, body style, and fuel type.
Search results display as listing cards; each card links to a detail page.

---

## How Requirements Work in This Project

> **For developers / Claude Code**: Add a scenario below, then ask:
> *"Implement all unimplemented scenarios in specs/motors-search.md"*
>
> To run only motors tests:
> ```bash
> npm run test:motors
> ```

---

## Scenarios

### TC-MOTORS-001 — Search with filters and validate the last listing detail page

| Field | Value |
|---|---|
| **Tags** | `@regression` `@motors` |
| **Status** | ✅ Implemented |
| **Priority** | P1 |
| **Data** | `motorsData.common` — make, location, yearFrom, priceMax, bodyStyle, fuel |

**Steps**:
1. Navigate to home page
2. Click "Motors" tab
3. Apply filters: make, location, year from, max price, body style, fuel type
4. Click "View listings"
5. Wait for results to load (`networkidle`)
6. Log result count; skip test if count = 0
7. Navigate to the last page of results
8. Click the last listing card
9. Validate the detail page

**Assertions**:
- URL contains `/listing/`
- Listing title (h1) is visible and non-empty
- Price display is visible
- Vehicle attributes section is visible (if present)
- Listing number is visible (if present)

---

### TC-MOTORS-002 — No results state is handled gracefully

| Field | Value |
|---|---|
| **Tags** | `@regression` `@motors` |
| **Status** | 🔲 Not implemented |
| **Priority** | P2 |
| **Data** | Use filters that are known to return 0 results (e.g. unrealistic year range) |

**Steps**:
1. Navigate to home → Motors
2. Apply filters that return 0 results
3. Submit search

**Assertions**:
- No listings are shown
- A "no results" or empty-state message is visible
- Page does not show an error

---

### TC-MOTORS-003 — Result count badge matches visible listing cards

| Field | Value |
|---|---|
| **Tags** | `@regression` `@motors` |
| **Status** | 🔲 Not implemented |
| **Priority** | P2 |

**Steps**:
1. Navigate to home → Motors
2. Apply any filters that return results
3. Submit search
4. Count visible listing cards on page 1

**Assertions**:
- Visible card count ≤ result count shown in heading
- "Showing X results" heading is visible

---

## Adding a New Scenario

```markdown
### TC-MOTORS-NNN — [Scenario name]

| Field | Value |
|---|---|
| **Tags** | `@sanity` or `@regression`, plus `@motors` |
| **Status** | 🔲 Not implemented |
| **Priority** | P0 / P1 / P2 |
| **Data** | Reference to data file or inline values |

**Steps**:
1. ...

**Assertions**:
- ...
```
