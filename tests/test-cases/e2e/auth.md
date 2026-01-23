# Authentication Test Cases
# Test cases for user authentication flows including sign-in, sign-up, sign-out, and password reset.

# Statuses (Completed, Planned, Experiment, Future Content, Skipped)
# Priorities (high, med, low)

## Test Account Requirements
For admin tests to work properly, the following test accounts are needed:

| Account Type | Environment Variable | Description |
|-------------|---------------------|-------------|
| Admin | `PLAYWRIGHT_TEST_ADMIN_EMAIL` | User in 'Admins' Cognito group |
| Regular User | `PLAYWRIGHT_TEST_USER_EMAIL` | User NOT in 'Admins' group |

### AUTH-001: Navigate to Sign-In Page
**Status:** `[Completed]`
**Priority:** high
**Test Suite:** smoke
**Description:**
Verify that users can navigate from the landing page to the sign-in page.
**Preconditions:**
- User is not logged in
**Test Steps:**
1. Navigate to the landing page (/)
2. Click "Log In" button
3. Verify URL changes to /auth/login
4. Verify sign-in form is displayed
**Expected Result:**
User sees the sign-in page with "Please sign in to continue." heading.
**Playwright File:** `tests/auth/signin.spec.ts`

---

### AUTH-002: Sign-In with Valid Credentials
**Status:** `[Completed]`
**Priority:** High
**Test Suite:** smoke
**Description:**
Verify that users can successfully sign in with valid email and password.
**Preconditions:**
- User has a valid account
- User is not logged in
**Test Steps:**
1. Navigate to /auth/login
2. Enter valid email address
3. Enter valid password
4. Click "Log In" button
5. Verify redirect to dashboard
**Expected Result:**
User is redirected to /dashboard and sees "Your Dashboard" heading.
**Playwright File:** `tests/auth/signin.spec.ts`

---

### AUTH-003: Sign-Out from Dashboard
**Status:** `[Completed]`
**Priority:** High
**Test Suite:** smoke
**Description:**
Verify that logged-in users can sign out successfully.
**Preconditions:**
- User is logged in and on dashboard
**Test Steps:**
1. From dashboard, click "Sign Out" button
2. Verify redirect to login page
**Expected Result:**
User is redirected to /auth/login and sees sign-in form.
**Playwright File:** `tests/auth/signin.spec.ts`

---

### AUTH-004: Sign-In with Invalid Credentials
**Status:** `[Completed]`
**Test Suite:** smoke
**Priority:** High
**Description:**
Verify that sign-in fails with incorrect credentials and displays appropriate error.
**Preconditions:**
- User is not logged in
**Test Steps:**
1. Navigate to /auth/login
2. Enter valid email address
3. Enter incorrect password
4. Click "Log In" button
5. Verify error message is displayed
**Expected Result:**
User remains on login page with error message displayed.
**Playwright File:** - `tests/auth/signin.spec.ts`

---

## Sign-Up Tests
### AUTH-005: Navigate to Sign-Up Page
**Status:** `[Completed]`
**Test Suite:** smoke
**Priority:** High
**Description:**
Verify that users can navigate to the sign-up page from login.
**Preconditions:**
- User is not logged in
**Test Steps:**
1. Navigate to /auth/login
2. Click "Don't have an account? Sign up." link
3. Verify URL changes to /auth/signup
**Expected Result:**
User sees the sign-up form.
**Playwright File:** - `tests/auth/signup.spec.ts`

---

### AUTH-006: Sign-Up with Valid Information
**Status:** `[Skipped] don't feel like creating new account with emails or removing test account in cognito`
**Priority:** High
**Description:**
Verify that new users can create an account.
**Preconditions:**
- Email is not already registered
**Test Steps:**
1. Navigate to /auth/signup
2. Enter valid email address
3. Enter valid password
4. Submit form
5. Verify redirect to confirmation page
**Expected Result:**
User is redirected to confirm signup page.
**Playwright File:** -

---

## Protected Routes Tests
### AUTH-007: Unauthenticated Access to Dashboard Redirects to Login
**Status:** `[Completed]`
**Priority:** High
**Test Suite:** smoke
**Description:**
Verify that unauthenticated users cannot access protected routes.
**Preconditions:**
- User is not logged in
**Test Steps:**
1. Attempt to navigate directly to /dashboard
2. Verify redirect to /auth/login
**Expected Result:**
User is redirected to login page.
**Playwright File:** - `tests/auth/signup.spec.ts`

---

### AUTH-008: Authenticated Access to Login Redirects to Dashboard
**Status:** `[Completed]`
**Priority:** Medium
**Test Suite:** smoke
**Description:**
Verify that authenticated users are redirected away from auth pages.
**Preconditions:**
- User is logged in
**Test Steps:**
1. Navigate to /auth/login while logged in
2. Verify redirect to /dashboard
**Expected Result:**
User is redirected to dashboard.
**Playwright File:** - `tests/auth/signin.spec.ts`
