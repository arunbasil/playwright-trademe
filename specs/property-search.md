# Feature: Property Search

**Area tag**: `@property`
**Implemented in**: `src/tests/property/propertySearch.spec.ts`
**Test data**: `src/data/property/propertyData.json`

## Overview

The Property section allows users to search for real estate using filters:
region, district, suburb, property type, min/max price, and bedrooms.
The bedroom filter drives a parametrised test that iterates over all bedroom options.

---

## How Requirements Work in This Project

> **For developers / Claude Code**: Add a scenario below, then ask:
> *"Implement all unimplemented scenarios in specs/property-search.md"*
>
> To run only property tests:
> ```bash
> npm run test:property
> ```

---

## Scenarios

### TC-PROP-001 — Search each bedroom option and validate the last listing detail page

| Field | Value |
|---|---|
| **Tags** | `@regression` `@property` |
| **Status** | ✅ Implemented |
| **Priority** | P1 |
| **Data** | `propertyData.common` + `propertyData.bedroomOptions[]` (parametrised) |

**Parametrised over**: `bedroomOptions` = `["Any", "Studio +", "1 +", "2 +", "3 +", "4 +", "5 +", "6 +"]`

**Steps** (per bedroom option):
1. Navigate to home page
2. Click "Property" tab
3. Apply common filters: region, district, suburb, property type, max price
4. Select the current bedroom option
5. Click "Search"
6. Wait for results (`networkidle`)
7. Log result count; skip if count = 0
8. Navigate to last page
9. Click last listing
10. Validate detail page

**Assertions**:
- URL contains `/listing/`
- Address heading (h1) is visible and non-empty
- Listed date is visible
- Listing title (h2) is visible
- Price display is visible
- Bedrooms and bathrooms info are visible
- Property type cell is visible
- Description ("Show more" button) is visible
- Gallery image is visible
- Agent's details heading is visible
- Open home times heading is visible
- Share this listing heading is visible
- Back to search button is visible
- Listing number is visible

---

### TC-PROP-002 — Min and max price range filters narrow results

| Field | Value |
|---|---|
| **Tags** | `@regression` `@property` |
| **Status** | 🔲 Not implemented |
| **Priority** | P2 |
| **Data** | Add `minPrice` to `propertyData.common` |

**Steps**:
1. Navigate to home → Property
2. Apply region + min price + max price filters
3. Submit search
4. Open a listing

**Assertions**:
- Listing price is within the selected min/max range

---

### TC-PROP-003 — Property type filter shows only matching listings

| Field | Value |
|---|---|
| **Tags** | `@regression` `@property` |
| **Status** | 🔲 Not implemented |
| **Priority** | P2 |

**Steps**:
1. Navigate to home → Property
2. Select a region
3. Select property type "Apartment"
4. Submit search
5. Open a listing

**Assertions**:
- Listing detail page shows property type "Apartment"

---

### TC-PROP-004 — Back to search button returns to results page

| Field | Value |
|---|---|
| **Tags** | `@regression` `@property` |
| **Status** | 🔲 Not implemented |
| **Priority** | P2 |

**Steps**:
1. Run a property search that returns results
2. Click any listing
3. Click "Back to search results" button

**Assertions**:
- URL returns to results page (contains search parameters)
- Results grid is visible again

---

## Adding a New Scenario

```markdown
### TC-PROP-NNN — [Scenario name]

| Field | Value |
|---|---|
| **Tags** | `@sanity` or `@regression`, plus `@property` |
| **Status** | 🔲 Not implemented |
| **Priority** | P0 / P1 / P2 |
| **Data** | Reference to data file or inline values |

**Steps**:
1. ...

**Assertions**:
- ...
```
