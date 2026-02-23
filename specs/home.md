# Feature: Home Page

**Area tag**: `@home`
**Implemented in**: `src/tests/shared/home.spec.ts`

## Overview

The Trade Me home page (`/`) is the primary entry point for all users.
It must load correctly, display the Trade Me brand, and provide navigable access to all major sections
(Marketplace, Property, Motors, Jobs, Services).

---

## How Requirements Work in This Project

> **For developers / Claude Code**: When you add or update a scenario below, run:
> ```
> # Implement all scenarios in this file
> npx playwright test --grep @home
> ```
> Or ask Claude: *"Implement any unimplemented scenarios in specs/home.md"*

Each scenario maps 1-to-1 with a test. The `Status` field tracks implementation state.

---

## Scenarios

### TC-HOME-001 — Page loads with the correct browser title

| Field | Value |
|---|---|
| **Tags** | `@sanity` `@home` |
| **Status** | ✅ Implemented |
| **Priority** | P0 — Blocker |

**Steps**:
1. Navigate to `/`

**Assertions**:
- Page `<title>` matches `/Trade Me/`

---

### TC-HOME-002 — All category tabs are visible

| Field | Value |
|---|---|
| **Tags** | `@sanity` `@home` |
| **Status** | 🔲 Not implemented |
| **Priority** | P1 |

**Steps**:
1. Navigate to `/`

**Assertions**:
- "Marketplace" tab is visible
- "Property" tab is visible
- "Motors" tab is visible
- "Jobs" tab is visible
- "Services" tab is visible

---

### TC-HOME-003 — Global search bar is present and accepts input

| Field | Value |
|---|---|
| **Tags** | `@sanity` `@home` |
| **Status** | 🔲 Not implemented |
| **Priority** | P1 |

**Steps**:
1. Navigate to `/`
2. Type "bike" into the search box

**Assertions**:
- Search input is visible and enabled
- Input value equals "bike"

---

### TC-HOME-004 — Clicking Motors tab navigates to Motors search

| Field | Value |
|---|---|
| **Tags** | `@regression` `@home` |
| **Status** | 🔲 Not implemented |
| **Priority** | P2 |

**Steps**:
1. Navigate to `/`
2. Click "Motors" category tab

**Assertions**:
- URL contains `/motors`
- Motors search form is visible

---

### TC-HOME-005 — Clicking Property tab navigates to Property search

| Field | Value |
|---|---|
| **Tags** | `@regression` `@home` |
| **Status** | 🔲 Not implemented |
| **Priority** | P2 |

**Steps**:
1. Navigate to `/`
2. Click "Property" category tab

**Assertions**:
- URL contains `/property`
- Property search form is visible

---

## Adding a New Scenario

Copy this template and fill in the fields:

```markdown
### TC-HOME-NNN — [Scenario name]

| Field | Value |
|---|---|
| **Tags** | `@sanity` or `@regression`, plus `@home` |
| **Status** | 🔲 Not implemented |
| **Priority** | P0 / P1 / P2 |

**Steps**:
1. ...

**Assertions**:
- ...
```
