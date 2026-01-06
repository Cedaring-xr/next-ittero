# Authentication Test Cases

Test cases for user authentication flows including sign-in, sign-up, sign-out, and password reset.

## Sign-In Tests

### AUTH-001: Navigate to Sign-In Page

**Status:** `[IMPLEMENTED]`

**Priority:** High

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

**Playwright File:** `tests/sign-in/signin.spec.ts`

---

### AUTH-002: Sign-In with Valid Credentials

**Status:** `[IMPLEMENTED]`

**Priority:** High

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

**Playwright File:** `tests/sign-in/signin.spec.ts`

---

### AUTH-003: Sign-Out from Dashboard

**Status:** `[IMPLEMENTED]`

**Priority:** High

**Description:**
Verify that logged-in users can sign out successfully.

**Preconditions:**
- User is logged in and on dashboard

**Test Steps:**
1. From dashboard, click "Sign Out" button
2. Verify redirect to login page

**Expected Result:**
User is redirected to /auth/login and sees sign-in form.

**Playwright File:** `tests/sign-in/signin.spec.ts`

---

### AUTH-004: Sign-In with Invalid Credentials

**Status:** `[PLANNED]`

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

**Playwright File:** -

---

### AUTH-005: Sign-In with Empty Fields

**Status:** `[PLANNED]`

**Priority:** Medium

**Description:**
Verify that sign-in form validates required fields.

**Preconditions:**
- User is not logged in

**Test Steps:**
1. Navigate to /auth/login
2. Leave email field empty
3. Leave password field empty
4. Click "Log In" button
5. Verify validation errors

**Expected Result:**
Form validation prevents submission and shows required field errors.

**Playwright File:** -

---

## Sign-Up Tests

### AUTH-010: Navigate to Sign-Up Page

**Status:** `[PLANNED]`

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

**Playwright File:** -

---

### AUTH-011: Sign-Up with Valid Information

**Status:** `[PLANNED]`

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

## Password Reset Tests

### AUTH-020: Navigate to Password Reset

**Status:** `[PLANNED]`

**Priority:** Medium

**Description:**
Verify that users can access the password reset flow.

**Preconditions:**
- User is not logged in

**Test Steps:**
1. Navigate to /auth/login
2. Click "Forgot password? Click here." link
3. Verify URL changes to /auth/reset-password/submit

**Expected Result:**
User sees password reset form.

**Playwright File:** -

---

## Protected Routes Tests

### AUTH-030: Unauthenticated Access to Dashboard Redirects to Login

**Status:** `[PLANNED]`

**Priority:** High

**Description:**
Verify that unauthenticated users cannot access protected routes.

**Preconditions:**
- User is not logged in

**Test Steps:**
1. Attempt to navigate directly to /dashboard
2. Verify redirect to /auth/login

**Expected Result:**
User is redirected to login page.

**Playwright File:** -

---

### AUTH-031: Authenticated Access to Login Redirects to Dashboard

**Status:** `[PLANNED]`

**Priority:** Medium

**Description:**
Verify that authenticated users are redirected away from auth pages.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to /auth/login while logged in
2. Verify redirect to /dashboard

**Expected Result:**
User is redirected to dashboard.

**Playwright File:** -
