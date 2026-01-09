# Profile Test Cases
# Test cases accessing user profile settings

# Statuses (Completed, Planned, Experiment, Future Content)
# Priorities (high, med, low)

## Test Account Requirements
For admin tests to work properly, the following test accounts are needed:

| Account Type | Environment Variable | Description |
|-------------|---------------------|-------------|
| Admin | `PLAYWRIGHT_TEST_ADMIN_EMAIL` | User in 'Admins' Cognito group |

### PROF-001: Navigate to Profile Settings
**Status:** `[Completed]`
**Priority:** med
**Description:**
Verify that authenticated users can navigate to their profile settings page from sidebar.
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
**Status:** `[Completed]`
**Priority:** med
**Description:**
Verify that user profile page is accessible from the header icon
**Preconditions:**
- User is logged in
**Test Steps:**
1. Navigate to /dashboard
2. Verify user's name is displayed
3. Click gears settings icon
4. Verify that page navigates to /profile
**Expected Result:**
Profile page is accessible from header gear icon
**Playwright File:** `tests/profile/profile-settings.spec.ts`

---

### PROF-003: Update Name of user
**Status:** `[Completed]`
**Priority:** med
**Description:**
Verify that user is able to update their username from the profile setting page
**Preconditions:**
- User is logged in
**Test Steps:**
1. Navigate to /dashboard/profile
2. Input generated random name in username field
3. Click "Update Name" button
4. navigate back to dashboard page
5. Verify that username is updated
6. Return to profile and reset name
**Expected Result:**
Username successfully updates and is visible on other pages
**Playwright File:** - `tests/profile/profile-update.spec.ts`

---

## Name update failure
### PROF-004: blank field does not update username
**Status:** `[Completed]`
**Priority:** High
**Description:**
Verify that users cannot have a blank username
**Preconditions:**
- User is logged in
**Test Steps:**
1. Navigate to /dashboard/profile
2. Enter current password
3. Enter new password
4. Confirm new password
5. Click "Update Password" button
6. Sign out and sign in with new password
**Expected Result:**
Error message apears notifying user that blank field does not work
**Playwright File:** - `tests/profile/profile-update.spec.ts`

---

## Date/Time Settings
### PROF-005: Change Timezone
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
**Playwright File:** - `tests/profile/profile-update.spec.ts`

---

### PROF-006: Change theme settings
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
**Playwright File:** - `tests/profile/profile-update.spec.ts`

---

### PROF-007: Change notification settings
**Status:** `[PLANNED]`
**Priority:** Low
**Description:**
Verify that users can toggle different notification settings.
**Preconditions:**
- User is logged in
**Test Steps:**
1. Navigate to /dashboard/profile
2. Verify notifications section
3. Toggle different settings
4. Verify result???
**Expected Result:**
Users are able to select notification setting that they desire
**Playwright File:** - `tests/profile/profile-update.spec.ts`