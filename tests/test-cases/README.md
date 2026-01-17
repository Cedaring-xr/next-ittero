# Test Cases Documentation

This directory contains test case documentation for the Ittero application. Each test case is assigned a unique ID that can be referenced in Playwright test files.

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
| A11y   | Accessibility | WCAG-AA compatability |

## Test Case Status

Each test case has a status indicator:

| Status | Description |
|--------|-------------|
| `[Completed]` | Test is written and passing in Playwright |
| `[Planned]` | Test case defined, Playwright test not yet written |
| `[Future Content]` | Test will be added when future planned content is created |
| `[Skipped]` | Test intentionally skipped (with reason) |

## Test Coverage Overview

| Category | Completed | Planned  | Future  | Skipped | Total |
|----------|-----------|----------|---------|---------|-------|
| AUTH     | 7         | 0        | 0       | 1       | 8     |
| PROF     | 4         | 0        | 3       | 0       | 7     |
| LIST     | 0         | 8        | 0       | 0       | 8     |
| TASK     | 0         | 4        | 0       | 0       | 4     |
| JRNL     | 0         | 5        | 4       | 0       | 9     |
| ADMN     | 2         | 0        | 2       | 0       | 4     |
| A11Y     | 0         | 0        | 0       | 0       | 0     |
| API      | 0         | 0        | 0       | 0       | 0     |
| COMP     | 0         | 0        | 0       | 0       | 0     |
| UNIT     | 0         | 0        | 0       | 0       | 0     |
|----------|-----------|----------|---------|---------|-------|
| final total                                         | 40    |

*Last updated: January 2026*
