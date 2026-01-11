# Admin Test Cases
# Test cases for admin-only features and access control.

# Statuses (Completed, Planned, Experiment, Future Content, Skipped)
# Priorities (high, med, low)

## Test Account Requirements
For admin tests to work properly, the following test accounts are needed:

| Account Type | Environment Variable | Description |
|-------------|---------------------|-------------|
| Admin | `PLAYWRIGHT_TEST_ADMIN_EMAIL` | User in 'Admins' Cognito group |
| Regular User | `PLAYWRIGHT_TEST_USER_EMAIL` | User NOT in 'Admins' group |


### ADMN-001: Admin User Can Access Admin Area
**Status:** `[completed]`
**Priority:** High
**Test Suite:** smoke
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
**Playwright File:** - `tests/admin/admin.spec.ts`

---

### ADMN-002: Non-Admin User Cannot Access Admin Area
**Status:** `[completed]`
**Priority:** High
**Test Suite:** smoke
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
**Playwright File:** - `tests/admin/nonAdmin.spec.ts`
**Note:** Requires a non-admin test account to be configured.

---

### ADMN-003: View Admin Dashboard
**Status:** `[Futre Content]`
**Priority:** Low
**Description:**
Verify admin dashboard displays relevant admin information.
**Preconditions:**
- User is logged in as admin
**Test Steps:**
1. Start on dashboard page for logged in admin user
2. Navigate to /dashboard/admins
2. Verify admin-specific content is displayed
**Expected Result:**
Admin sees admin-specific dashboard content.
**Playwright File:** -

---

### ADMN-011: Admin User Management
**Status:** `[Future Content]`
**Priority:** Low
**Description:**
Verify admins can view/manage users or acount management capabilities.
**Preconditions:**
- User is logged in as admin
- User management feature exists
- test user exists to manage
**Test Steps:**
1. Start on dashboard page for logged in admin account
2. Navigate to admin section
3. Access user management
4. Modify user features
5. Verify user account modification is successful
**Expected Result:**
Admin can view and manage users account information
**Playwright File:** -
**Note:** Depends on whether user management feature is implemented and what features exist.
