# Sanity Test Plan — TradeMe

> **Purpose**: Quick smoke tests to verify core site functionality is operational.
> These tests should run on every deployment and complete within 2 minutes.

---

## TC-SAN-001 — Homepage Loads Successfully

**Tags**: `@sanity` `@home`

1. Navigate to `https://www.trademe.co.nz`
2. **Verify** page title contains "Trade Me"
3. **Verify** TradeMe logo is visible
4. **Verify** global search bar is present with placeholder "Search all of Trade Me"
5. **Verify** main navigation tabs are visible: Marketplace, Property, Motors, Jobs, Services
6. **Verify** header utilities are visible: Categories, Watchlist, Favourites, Start a listing, Sign up, Log in

---

## TC-SAN-002 — Global Search Executes

**Tags**: `@sanity` `@search`

1. Navigate to homepage
2. Type "laptop" into the global search bar
3. Click the Search button
4. **Verify** URL contains search query parameter
5. **Verify** results page loads with listing cards visible
6. **Verify** page heading reflects the search term

---

## TC-SAN-003 — Property Tab Loads Search Form

**Tags**: `@sanity` `@property`

1. Navigate to homepage
2. Click the **Property** tab
3. **Verify** URL contains `/property`
4. **Verify** sub-tabs are visible: For sale, For rent, Sold, Flatmates, Retirement villages, Find an agent
5. **Verify** search form fields are present: Region, District, Suburb, Price range, Bedrooms, Bathrooms, Property type, Keywords
6. **Verify** "Search" button is visible and enabled

---

## TC-SAN-004 — Motors Tab Loads Search Form

**Tags**: `@sanity` `@motors`

1. Navigate to homepage
2. Click the **Motors** tab
3. **Verify** URL contains `/motors`
4. **Verify** sub-tabs are visible: Cars, Motorbikes, Caravans & motorhomes, Boats, Car parts & accessories
5. **Verify** search form fields are present: New & Used toggle, Make, Model, Location, Year range, Price range, Body style, Fuel type, Keywords
6. **Verify** "View listings" button is visible and enabled

---

## TC-SAN-005 — Jobs Tab Loads Search Form

**Tags**: `@sanity` `@jobs`

1. Navigate to homepage
2. Click the **Jobs** tab
3. **Verify** URL contains `/jobs`
4. **Verify** search form fields are present: Keywords, Category, Location
5. **Verify** "Search jobs" button is visible and enabled

---

## TC-SAN-006 — Marketplace Categories Dropdown

**Tags**: `@sanity` `@marketplace`

1. Navigate to homepage
2. Click the **Categories** button in the header
3. **Verify** dropdown opens with category links visible
4. **Verify** at least 5 categories are listed (e.g., Electronics & photography, Home & living, Clothing & Fashion)
5. Click on a category (e.g., "Electronics & photography")
6. **Verify** category browse page loads with listings or subcategories

---

## TC-SAN-007 — Footer Links Are Present

**Tags**: `@sanity` `@footer`

1. Navigate to homepage
2. Scroll to the footer
3. **Verify** section headings are visible: Marketplace, Property, Motors, Jobs, Services, Community
4. **Verify** "Help" or "Help centre" link is present
5. **Verify** "Contact Us" link is present
6. **Verify** social media links are present (at least 3 of: TikTok, Instagram, Facebook, LinkedIn, YouTube)

---

## TC-SAN-008 — Authentication Links Accessible

**Tags**: `@sanity` `@auth`

1. Navigate to homepage
2. **Verify** "Log in" link is visible in the header
3. Click "Log in"
4. **Verify** login page or modal loads
5. **Verify** URL contains `/login` or a login form is visible with email and password fields
6. Navigate back to homepage
7. **Verify** "Sign up" link is visible in the header

---

## Execution Notes

- **Environment**: Production (`https://www.trademe.co.nz`)
- **Browser**: Chromium (headless for CI, headed for local debug)
- **Timeout**: 30 seconds per test (default)
- **Run command**: `npx playwright test --grep @sanity`
- **Expected duration**: < 2 minutes for all 8 tests
- **Pre-conditions**: No authentication required (all tests run as anonymous user)
