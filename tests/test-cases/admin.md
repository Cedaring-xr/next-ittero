# Admin Test Cases

Test cases for admin-only features and access control.

Statuses (completed, planned, experiment, removed)
Priorities( high, med, low)

## Admin Access
### ADMN-001: Admin User Can Access Admin Area
**Status:** `[completed]`
**Priority:** High
**Description:**
Verify that users in the 'Admins' Cognito group can access the admin section.
**Preconditions:**
- User is logged in with an admin account (member of 'Admins' group in cognito)
**Test Steps:**
1. Start on dashboard of signed in user
2. From dashboard, click "Admin Area" in sidenav
3. Verify URL changes to /dashboard/admins
4. Verify admin page content is displayed
**Expected Result:**
Admin user sees the admin section with "Admin Access Only" heading.
**Playwright File:** `tests/sign-in/admin.spec.ts`

---

### ADMN-002: Non-Admin User Cannot Access Admin Area
**Status:** `[completed]`
**Priority:** High
**Description:**
Verify that regular users cannot access the admin section.
**Preconditions:**
- User is logged in with a non-admin account
**Test Steps:**
1. Start on dashboard of normal user
2. Verify "Admin Area" is not present in sidebar navigation
3. Attempt to navigate directly to /dashboard/admins
4. Verify access is denied or redirected
**Expected Result:**
Non-admin user is redirected away from admin section or sees access denied message.
**Playwright File:** -
**Note:** Requires a non-admin test account to be configured.
---

### ADMN-003: Admin Area Link Visibility

**Status:** `[PLANNED]`

**Priority:** Medium

**Description:**
Verify that the "Admin Area" link only appears for admin users.

**Preconditions:**
- Test with both admin and non-admin accounts

**Test Steps:**
1. Log in as admin user
2. Verify "Admin Area" link is visible in sidenav
3. Log out
4. Log in as non-admin user
5. Verify "Admin Area" link is NOT visible in sidenav

**Expected Result:**
Admin link only visible to users in Admins group.

**Playwright File:** -

**Note:** Requires both admin and non-admin test accounts.

---

## Admin Features

### ADMN-010: View Admin Dashboard

**Status:** `[PLANNED]`

**Priority:** Medium

**Description:**
Verify admin dashboard displays relevant admin information.

**Preconditions:**
- User is logged in as admin

**Test Steps:**
1. Navigate to /dashboard/admins
2. Verify admin-specific content is displayed

**Expected Result:**
Admin sees admin-specific dashboard content.

**Playwright File:** -

---

### ADMN-011: Admin User Management

**Status:** `[PLANNED]`

**Priority:** Low

**Description:**
Verify admins can view/manage users (if feature exists).

**Preconditions:**
- User is logged in as admin
- User management feature exists

**Test Steps:**
1. Navigate to admin section
2. Access user management
3. Verify user list is displayed

**Expected Result:**
Admin can view and manage users.

**Playwright File:** -

**Note:** Depends on whether user management feature is implemented.

---

## Test Account Requirements

For admin tests to work properly, the following test accounts are needed:

| Account Type | Environment Variable | Description |
|-------------|---------------------|-------------|
| Admin | `PLAYWRIGHT_TEST_ADMIN_EMAIL` | User in 'Admins' Cognito group |
| Regular User | `PLAYWRIGHT_TEST_USER_EMAIL` | User NOT in 'Admins' group |

### Current Configuration

The current `.env.local` includes:
- `PLAYWRIGHT_TEST_ADMIN_EMAIL` - Admin test account
- `PLAYWRIGHT_TEST_ADMIN_PASSWORD` - Admin test password

**Missing:**
- Non-admin test account for negative testing (ADMN-002, ADMN-003)
