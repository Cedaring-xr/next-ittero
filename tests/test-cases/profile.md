# Profile Test Cases

Test cases for user profile settings, preferences, and account management.

## Profile Navigation

### PROF-001: Navigate to Profile Settings

**Status:** `[IMPLEMENTED]`

**Priority:** High

**Description:**
Verify that authenticated users can navigate to their profile settings page.

**Preconditions:**
- User is logged in

**Test Steps:**
1. From dashboard, click "Profile" in sidenav
2. Verify URL changes to /dashboard/profile
3. Verify "Profile Settings" heading is displayed

**Expected Result:**
User sees the profile settings page with all settings sections visible.

**Playwright File:** `tests/profile/profile-settings.spec.ts`

---

### PROF-002: View Profile Information

**Status:** `[IMPLEMENTED]`

**Priority:** High

**Description:**
Verify that profile page displays current user information.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to /dashboard/profile
2. Verify user's name is displayed
3. Verify user's email is displayed

**Expected Result:**
Profile page shows current user's name and email.

**Playwright File:** `tests/profile/profile-udpate.spec.ts`

---

## Name Updates

### PROF-010: Update User Name

**Status:** `[PLANNED]`

**Priority:** Medium

**Description:**
Verify that users can update their display name.

**Preconditions:**
- User is logged in
- User is on profile page

**Test Steps:**
1. Navigate to /dashboard/profile
2. Clear name input field
3. Enter new name
4. Click "Update Name" button
5. Navigate to dashboard
6. Verify name is updated in header

**Expected Result:**
User's name is updated and reflected across the application.

**Playwright File:** -

---

### PROF-011: Update Name with Empty Value

**Status:** `[PLANNED]`

**Priority:** Low

**Description:**
Verify that name field validation prevents empty values.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to /dashboard/profile
2. Clear name input field
3. Click "Update Name" button
4. Verify validation error

**Expected Result:**
Form prevents submission and displays validation error.

**Playwright File:** -

---

## Password Updates

### PROF-020: Update Password with Valid Credentials

**Status:** `[PLANNED]`

**Priority:** High

**Description:**
Verify that users can update their password.

**Preconditions:**
- User is logged in
- User knows current password

**Test Steps:**
1. Navigate to /dashboard/profile
2. Enter current password
3. Enter new password
4. Confirm new password
5. Click "Update Password" button
6. Sign out and sign in with new password

**Expected Result:**
Password is updated successfully and user can sign in with new password.

**Playwright File:** -

---

### PROF-021: Update Password with Incorrect Current Password

**Status:** `[PLANNED]`

**Priority:** Medium

**Description:**
Verify that password update fails with incorrect current password.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to /dashboard/profile
2. Enter incorrect current password
3. Enter new password
4. Confirm new password
5. Click "Update Password" button
6. Verify error message

**Expected Result:**
Error message displayed indicating incorrect current password.

**Playwright File:** -

---

### PROF-022: Update Password with Mismatched Confirmation

**Status:** `[PLANNED]`

**Priority:** Medium

**Description:**
Verify that password update fails when confirmation doesn't match.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to /dashboard/profile
2. Enter current password
3. Enter new password
4. Enter different value in confirm field
5. Click "Update Password" button
6. Verify validation error

**Expected Result:**
Validation error displayed indicating passwords don't match.

**Playwright File:** -

---

## Email Updates

### PROF-030: Update Email Address

**Status:** `[PLANNED]`

**Priority:** Medium

**Description:**
Verify that users can update their email address.

**Preconditions:**
- User is logged in
- New email is not already registered

**Test Steps:**
1. Navigate to /dashboard/profile
2. Enter new email address
3. Click "Update Email" button
4. Verify confirmation flow (if applicable)

**Expected Result:**
Email update process initiated successfully.

**Playwright File:** -

---

## Theme Settings

### PROF-040: Change Color Scheme to Dark Mode

**Status:** `[PLANNED]`

**Priority:** Low

**Description:**
Verify that users can switch to dark mode.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to /dashboard/profile
2. Click "Dark" button in Theme Settings
3. Click "Save Theme" button
4. Verify dark mode is applied

**Expected Result:**
Application switches to dark color scheme.

**Playwright File:** -

---

### PROF-041: Change Accent Color

**Status:** `[PLANNED]`

**Priority:** Low

**Description:**
Verify that users can change accent color.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to /dashboard/profile
2. Click desired accent color button
3. Click "Save Theme" button
4. Verify accent color is applied

**Expected Result:**
Application uses selected accent color.

**Playwright File:** -

---

## Date/Time Settings

### PROF-050: Change Timezone

**Status:** `[PLANNED]`

**Priority:** Low

**Description:**
Verify that users can change their timezone setting.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to /dashboard/profile
2. Select new timezone from dropdown
3. Click "Save Settings" button
4. Verify timezone is saved

**Expected Result:**
Timezone preference is updated.

**Playwright File:** -

---

## Account Deletion

### PROF-060: Delete Account

**Status:** `[PLANNED]`

**Priority:** High

**Description:**
Verify that users can delete their account.

**Preconditions:**
- User is logged in
- Test account designated for deletion

**Test Steps:**
1. Navigate to /dashboard/profile
2. Scroll to Danger Zone
3. Click "Delete Account" button
4. Confirm deletion (if dialog appears)
5. Verify redirect to landing page
6. Verify cannot sign in with deleted credentials

**Expected Result:**
Account is permanently deleted and user is logged out.

**Playwright File:** -

**Note:** This test should use a dedicated test account to avoid deleting primary test accounts.
