# Admin Test Cases
# Test cases for api endpoints related to journals

# Statuses (Completed, Planned, Experiment, Future Content, Skipped)
# Priorities (high, med, low)

## Test Account Requirements
For proper functioning tests, need an authenticated user tokens

| Account Type | Environment Variable | Description |
|-------------|---------------------|-------------|
| Regular User | `PLAYWRIGHT_TEST_USER_EMAIL` | User NOT in 'Admins' group |


### JOURNAL-API-001: Admin User Can Access Admin Area
**Status:** `[completed]`
**Priority:** High
**Test Suite:**
**Description:**
Verify that journal entries for authenticated user is returned
**Preconditions:**
- User account is authenticated
**Tests Validating:**
1. Response is truthy
2. Response code is 200
3. Data has properties 'entries', 'count', 'nextToken'
4. entries is an array
5. data.entries is equal to data.count if count
**Expected Result:**
List of at least 1 user journal entries is returned
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`

---

### JOURNAL-API-002: should return entries with correct structure
**Status:** `[completed]`
**Priority:** High
**Test Suite:**
**Description:**
Verify that JSON structure of entries are correct
**Preconditions:**
- User account is authenicated, entries array exists
**Tests Validating:**
1. if entries array start verifying
2. each entry has properties 'entry_id', 'date', 'text', 'user_id', 'tag', 'createdAt'
3. entry date matches regex format
4. 'entry_id' is string
5. 'text' is string
**Expected Result:**
Structure of entries array JSON is consistant and expected
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`

---

### JOURNAL-API-003: should respect limit parameter
**Status:** `[completed]`
**Priority:** High
**Test Suite:**
**Description:**
Verify that limit params is used
**Preconditions:**
- User account is authenicated, entries array exists
**Tests Validating:**
1. send request with query params limit of 3
2. expect data.enties.length equals 3
**Expected Result:**
Number of entries matches number in request params
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`

---

### JOURNAL-API-004: should support pagination with nextToken
**Status:** `[competed]`
**Priority:** High
**Test Suite:**
**Description:**
Verify that user is able to request more entries after first reqeust
**Preconditions:**
- User account is authenicated, entries array has at least 6 entries
**Tests Validating:**
1. Make GET request with limit=5
2. Make another request using the nextToken
3. Verify that second request array is truthy
4. Verify firstData and secondData have entries
5. Verify that there is no overlap in entry ids
**Expected Result:**
Pagination requests are valid and load additional non-overlapping entries
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`

---

### JOURNAL-API-005: should return total journal entry count
**Status:** `[competed]`
**Priority:** High
**Test Suite:**
**Description:**
return a total count number for all entries without fetching all
**Preconditions:**
- User account is authenicated, entries DB has at least 1 entry
**Tests Validating:**
1. Expect response to be truthy and have status code 200
2. Expect data to have properties 'count', 'number'
3. Expect data.count to be greater than 0
**Expected Result:**
An accurate count number is returned 
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`

---

### JOURNAL-API-006: count should be consistent with entries
**Status:** `[competed]`
**Priority:** High
**Test Suite:**
**Description:**
return a total count number for all entries without fetching all
**Preconditions:**
- User account is authenicated, entries DB has at least 1 entry
**Tests Validating:**
1. Expect response to be truthy and have status code 200
2. Expect data to have properties 'count', 'number'
3. Expect data.count to be greater than 0
**Expected Result:**
An accurate count number is returned 
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`