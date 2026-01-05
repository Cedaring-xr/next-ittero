# Test Cases Documentation

This directory contains test case documentation for the Ittero application. Each test case is assigned a unique ID that can be referenced in Playwright test files.

## Directory Structure

```
docs/test-cases/
├── README.md           # This file - conventions and overview
├── auth.md             # Authentication test cases (AUTH-xxx)
├── profile.md          # Profile settings test cases (PROF-xxx)
├── lists.md            # Lists feature test cases (LIST-xxx)
├── journal.md          # Journal feature test cases (JRNL-xxx)
└── admin.md            # Admin feature test cases (ADMN-xxx)
```

## Test ID Convention

Test IDs follow the format: `{CATEGORY}-{NUMBER}`

| Prefix | Category | Description |
|--------|----------|-------------|
| AUTH   | Authentication | Sign-in, sign-up, sign-out, password reset |
| PROF   | Profile | Profile settings, user preferences |
| LIST   | Lists | List creation, management, items |
| JRNL   | Journal | Journal entries, creation, editing |
| ADMN   | Admin | Admin-only features and access |
| NAV    | Navigation | General navigation and routing |

## Test Case Status

Each test case has a status indicator:

| Status | Description |
|--------|-------------|
| `[IMPLEMENTED]` | Test is written and passing in Playwright |
| `[PLANNED]` | Test case defined, Playwright test not yet written |
| `[BLOCKED]` | Test cannot be implemented due to a dependency |
| `[SKIPPED]` | Test intentionally skipped (with reason) |

## Test Case Template

Each test case should include:

```markdown
### TEST-ID: Test Name

**Status:** `[IMPLEMENTED]` | `[PLANNED]` | `[BLOCKED]` | `[SKIPPED]`

**Priority:** High | Medium | Low

**Description:**
Brief description of what this test verifies.

**Preconditions:**
- List any required state before test runs
- e.g., User must be logged in

**Test Steps:**
1. Step one
2. Step two
3. Step three

**Expected Result:**
What should happen when the test passes.

**Playwright File:** `tests/path/to/test.spec.ts` (if implemented)
```

## Referencing Test IDs in Playwright

When writing Playwright tests, reference the test ID in the test name:

```typescript
test('[AUTH-001] should navigate to sign-in page', async ({ page }) => {
  // test implementation
})
```

This allows easy traceability between documentation and test code.

## Test Coverage Overview

| Category | Implemented | Planned | Total |
|----------|-------------|---------|-------|
| AUTH     | 4           | 2       | 6     |
| PROF     | 2           | 3       | 5     |
| LIST     | 0           | 5       | 5     |
| JRNL     | 0           | 4       | 4     |
| ADMN     | 1           | 2       | 3     |

*Last updated: January 2025*
