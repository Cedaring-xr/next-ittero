# Admin Test Cases
# Test cases for application navigation of common pages.

# Statuses (Completed, Planned, Experiment, Future Content, Skipped)
# Priorities (high, med, low)

## Test Account Requirements
For admin tests to work properly, the following test accounts are needed:

| Account Type | Environment Variable | Description |
|-------------|---------------------|-------------|
| Admin | `PLAYWRIGHT_TEST_ADMIN_EMAIL` | 


### NAV-001: Links functional on dashboard page
**Status:** `[Completed]`
**Priority:** High
**Test Suite:** smoke
**Description:**
Verify that
**Preconditions:**
- User is logged in with an admin account (member of 'Admins' group in cognito)
**Test Steps:**
1. Start on dashboard of signed in user
2. From dashboard, check links in sidebar
3. Check links from main sections
4. click "create new List"
5. Verify URL, then go back
6. Click "view active lists"
7. Verify URL, then go back
8. Click "write quick journal"
9. Verify URL, then go back
10. Click "view journal entries"
11. Verify URL, then go back
12. Click "stats & Review"
13. Verify URL, then go back
14. Click "feedback"
15. Verify URL, then go back
**Expected Result:**
Admin user sees the admin section with "Admin Access Only" heading.
**Playwright File:** - `tests/navigation/mainNavigation.spec.ts`

---

### NAV-002: Navigate through main pages
**Status:** `[Planned]`
**Priority:** High
**Test Suite:** smoke
**Description:**
Verify that main page navigation works and pages load
**Preconditions:**
- User is logged in with an admin account (member of 'Admins' group in cognito)
**Test Steps:**
1. Start on dashboard of signed in user
2. From dashboard, click "View active lists"
3. Verify URL changes to /dashboard/lists
4. click "create new list"
5. Verify URL changes to /dashboard/lists/newList
6. Click lists on sidebar
7. Click create task
8. Verify URL changes to /dashboard/lists/items
9. Click Journal on Sidebar
10. Verify URL changes to /dashboard/journal
11. click "create new entry"
12. Verify URL changes to /dashboard/journal/newJournal
13. Click stats on sidebar
14. Verify URL changes to /dashboard/stats
15. click home on sidebar
16. Verify URL changes to /dashboard
**Expected Result:**
Admin user is able to navigate through main pages and each page loads
**Playwright File:** - `tests/navigation/mainNavigation.spec.ts`
