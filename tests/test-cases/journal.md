# Journal Test Cases

Test cases for journal entries, creation, and management.

## Journal Navigation

### JRNL-001: Navigate to Journal Page

**Status:** `[PLANNED]`

**Priority:** High

**Description:**
Verify that authenticated users can navigate to the journal page.

**Preconditions:**
- User is logged in

**Test Steps:**
1. From dashboard, click "Journal" in sidenav
2. Verify URL changes to /dashboard/journal
3. Verify journal page is displayed

**Expected Result:**
User sees the journal page with any existing entries.

**Playwright File:** -

---

### JRNL-002: Navigate to New Journal Entry Page

**Status:** `[PLANNED]`

**Priority:** High

**Description:**
Verify that users can navigate to create a new journal entry.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to /dashboard/journal
2. Click "New Entry" button (or equivalent)
3. Verify URL changes to /dashboard/journal/newJournal

**Expected Result:**
User sees the new journal entry form.

**Playwright File:** -

---

## Journal Entry Creation

### JRNL-010: Create New Journal Entry

**Status:** `[PLANNED]`

**Priority:** High

**Description:**
Verify that users can create a new journal entry.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to /dashboard/journal/newJournal
2. Enter journal entry title
3. Enter journal entry content
4. Submit form
5. Verify redirect to journal page or entry detail
6. Verify new entry appears

**Expected Result:**
New journal entry is created and visible.

**Playwright File:** -

---

### JRNL-011: Create Journal Entry with Empty Content

**Status:** `[PLANNED]`

**Priority:** Medium

**Description:**
Verify that journal creation validates required fields.

**Preconditions:**
- User is logged in

**Test Steps:**
1. Navigate to /dashboard/journal/newJournal
2. Leave content field empty
3. Attempt to submit form
4. Verify validation error

**Expected Result:**
Form validation prevents creation without required content.

**Playwright File:** -

---

## Journal Entry Management

### JRNL-020: View Journal Entry

**Status:** `[PLANNED]`

**Priority:** High

**Description:**
Verify that users can view an individual journal entry.

**Preconditions:**
- User is logged in
- At least one journal entry exists

**Test Steps:**
1. Navigate to /dashboard/journal
2. Click on a journal entry
3. Verify entry detail is displayed

**Expected Result:**
User sees the full journal entry content.

**Playwright File:** -

---

### JRNL-021: Edit Journal Entry

**Status:** `[PLANNED]`

**Priority:** High

**Description:**
Verify that users can edit an existing journal entry.

**Preconditions:**
- User is logged in
- At least one journal entry exists

**Test Steps:**
1. Navigate to a journal entry
2. Click edit button
3. Modify entry content
4. Save changes
5. Verify content is updated

**Expected Result:**
Journal entry is updated with new content.

**Playwright File:** -

---

### JRNL-022: Delete Journal Entry

**Status:** `[PLANNED]`

**Priority:** High

**Description:**
Verify that users can delete a journal entry.

**Preconditions:**
- User is logged in
- At least one journal entry exists

**Test Steps:**
1. Navigate to a journal entry
2. Click delete button
3. Confirm deletion
4. Verify redirect to journal page
5. Verify entry no longer appears

**Expected Result:**
Journal entry is deleted and removed from the journal page.

**Playwright File:** -

---

## Journal Display

### JRNL-030: Journal Entries Display in Chronological Order

**Status:** `[PLANNED]`

**Priority:** Medium

**Description:**
Verify that journal entries are displayed in correct order.

**Preconditions:**
- User is logged in
- Multiple journal entries exist

**Test Steps:**
1. Navigate to /dashboard/journal
2. Verify entries are sorted by date (newest first or as designed)

**Expected Result:**
Journal entries appear in chronological order.

**Playwright File:** -

---

### JRNL-031: Journal Entry Shows Date

**Status:** `[PLANNED]`

**Priority:** Low

**Description:**
Verify that journal entries display their creation date.

**Preconditions:**
- User is logged in
- At least one journal entry exists

**Test Steps:**
1. Navigate to /dashboard/journal
2. Verify each entry shows a date

**Expected Result:**
Each journal entry displays its creation date.

**Playwright File:** -
