# Lists Test Cases
# Test cases for list creation, management, and tasks.

# Statuses (Completed, Planned, Experiment, Future Content)
# Priorities (high, med, low)

## Test Account Requirements
For tests to work properly, the following test accounts are needed:

| Account Type | Environment Variable | Description |
|-------------|---------------------|-------------|
| Admin | `PLAYWRIGHT_TEST_ADMIN_EMAIL` |

### LIST-001: Navigate to Lists Page
**Status:** `[PLANNED]`
**Priority:** High
**Description:**
Verify that authenticated users can navigate to the lists page.
**Preconditions:**
- User is logged in
- User has previously created lists
**Test Steps:**
1. From dashboard, click "Lists" in sidenav
2. Verify URL changes to /dashboard/lists
3. Verify lists page is displayed
**Expected Result:**
User sees the lists page with existing lists.
**Playwright File:** - 

---

### LIST-002: Navigate to New List Page
**Status:** `[PLANNED]`
**Priority:** High
**Description:**
Verify that users can navigate to create a new list.
**Preconditions:**
- User is logged in
**Test Steps:**
1. Navigate to /dashboard/lists
2. Click "New List" button (or equivalent)
3. Verify URL changes to /dashboard/lists/newList
**Expected Result:**
User sees the new list creation form.
**Playwright File:** -

---

## List Creation
### LIST-003: Create New List
**Status:** `[PLANNED]`
**Priority:** High
**Description:**
Verify that users can create a new list.
**Preconditions:**
- User is logged in
**Test Steps:**
1. Navigate to /dashboard/lists/newList
2. Enter list name
3. Submit form
4. Verify redirect to new list or lists page
5. Verify new list appears in list
**Expected Result:**
New list is created and visible in the lists page.
**Playwright File:** -

---

### LIST-004: Create List with Empty Name
**Status:** `[PLANNED]`
**Priority:** Low
**Description:**
Verify that list creation requires a name.
**Preconditions:**
- User is logged in
**Test Steps:**
1. Navigate to /dashboard/lists/newList
2. Leave name field empty
3. Attempt to submit form
4. Verify validation error
**Expected Result:**
Form validation prevents creation without a name.
**Playwright File:** -

---

## List Management
### LIST-005: View List Details
**Status:** `[PLANNED]`
**Priority:** High
**Description:**
Verify that users can view an individual list.
**Preconditions:**
- User is logged in
- At least one list exists
**Test Steps:**
1. Navigate to /dashboard/lists
2. Click on a list
3. Verify list details page is displayed
**Expected Result:**
User sees the list with its tasks.
**Playwright File:** -

---

### LIST-006: Delete List
**Status:** `[PLANNED]`
**Priority:** High
**Description:**
Verify that users can delete a list.
**Preconditions:**
- User is logged in
- At least one list exists
**Test Steps:**
1. Navigate to a list detail page
2. Click delete button
3. Confirm deletion
4. Verify redirect to lists page
5. Verify list no longer appears
**Expected Result:**
List is deleted and removed from the lists page.
**Playwright File:** -

---

### LIST-007: Pin List to Sidebar
**Status:** `[PLANNED]`
**Priority:** Medium
**Description:**
Verify that users can pin a list to the sidebar.
**Preconditions:**
- User is logged in
- At least one unpinned list exists
**Test Steps:**
1. Navigate to a list
2. Click pin button
3. Verify list appears in sidebar under "Pinned Lists"
**Expected Result:**
List appears in the sidebar pinned lists section.
**Playwright File:** -

---

### LIST-008: Unpin List from Sidebar
**Status:** `[PLANNED]`
**Priority:** Medium
**Description:**
Verify that users can unpin a list from the sidebar.
**Preconditions:**
- User is logged in
- At least one pinned list exists
**Test Steps:**
1. In sidebar, click unpin button on a pinned list
2. Verify list is removed from pinned section
**Expected Result:**
List is removed from the sidebar pinned lists section.
**Playwright File:** -
