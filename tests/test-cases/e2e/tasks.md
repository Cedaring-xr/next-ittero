# Task Test Cases
# Test cases for list creation, management, and tasks.

# Statuses (Completed, Planned, Experiment, Future Content)
# Priorities (high, med, low)

## Test Account Requirements
For tests to work properly, the following test accounts are needed:

| Account Type | Environment Variable | Description |
|-------------|---------------------|-------------|
| Admin | `PLAYWRIGHT_TEST_ADMIN_EMAIL` |



### TASK-001: Add task to List
**Status:** `[PLANNED]`
**Priority:** High
**Description:**
Verify that users can add items to a list.
**Preconditions:**
- User is logged in
- A list exists
**Test Steps:**
1. Navigate to a list
2. Enter item text
3. Submit/add item
4. Verify item appears in list
**Expected Result:**
New item is added and visible in the list.
**Playwright File:** -

---

### TASK-002: Complete List Item
**Status:** `[PLANNED]`
**Priority:** High
**Description:**
Verify that users can mark list items as complete.
**Preconditions:**
- User is logged in
- A list with at least one item exists
**Test Steps:**
1. Navigate to a list with items
2. Click checkbox or complete button on an item
3. Verify item is marked as complete
**Expected Result:**
Item shows as completed (checked/strikethrough).
**Playwright File:** -

---

### TASK-003: Delete List Item
**Status:** `[PLANNED]`
**Priority:** High
**Description:**
Verify that users can delete list items.
**Preconditions:**
- User is logged in
- A list with at least one item exists
**Test Steps:**
1. Navigate to a list with items
2. Click delete on an item
3. Verify item is removed from list
**Expected Result:**
Item is deleted and no longer visible.
**Playwright File:** -

---

### TASK-004: Edit List Item
**Status:** `[Future Content]`
**Priority:** Medium
**Description:**
Verify that users can edit list item text.
**Preconditions:**
- User is logged in
- A list with at least one item exists
**Test Steps:**
1. Navigate to a list with items
2. Click edit on an item
3. Modify item text
4. Save changes
5. Verify item text is updated
**Expected Result:**
Item text is updated with new value.
**Playwright File:** -