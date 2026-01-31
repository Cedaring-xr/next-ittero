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
1. Make a request to /count
2. make another request to entries with limit of 1000
3. compare the numbers from each results
4. Give slight variance of +-2
**Expected Result:**
Count is consistant with total entries
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`

---

### JOURNAL-API-008: should be able to create a new journal entry
**Status:** `[competed]`
**Priority:** High
**Test Suite:**
**Description:**
creates a new journal entry
**Preconditions:**
- User account is authenicated
**Tests Validating:**
1. Makes POST request with all required field data
2. expect response to be 201
3. expect return message of "successful"
4. expect return to have properties 'message', 'data', 'entry_id'
5. expect entry_id to be type string
**Expected Result:**
successful journal creation with all data
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`

---

### JOURNAL-API-009: should reject creation if required fields are not present
**Status:** `[competed]`
**Priority:** High
**Test Suite:**
**Description:**
journal entry creation requires certain fields
**Preconditions:**
- User account is authenicated
**Tests Validating:**
1. Makes POST request with missing 'text' field
2. expect response to be 400
3. expect error with failure description
4. Make another request with missing date
5. expect response to be 400
6. expect error with failure description
7. Make another request with incorrect date format
8. expect response to be 400
9. expect error with failure description
**Expected Result:**
successful journal creation with all data
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`

---

### JOURNAL-API-007: should reject unauthenticated GET request
**Status:** `[competed]`
**Priority:** High
**Test Suite:**
**Description:**
Journal entries cannot be fetched for unauthenticated users
**Preconditions:**
- User account is NOT authenicated
**Tests Validating:**
1. Makes GET request to /entries
2. expect response to be 401 or 403
**Expected Result:**
Error code and no data is returned
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`

---

### JOURNAL-API-010: should reject unauthenticated POST request
**Status:** `[competed]`
**Priority:** High
**Test Suite:**
**Description:**
Journal entries cannot be created for unauthenticated users
**Preconditions:**
- User account is NOT authenicated
**Tests Validating:**
1. Makes POST request with all required fields
2. expect response code of 401 or 403
**Expected Result:**
Error code and no data is created
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`

---

### JOURNAL-API-011: should reject GET request for alternate user
**Status:** `[competed]`
**Priority:** High
**Test Suite:**
**Description:**
Journal entries cannot be fetched for other users ids
**Preconditions:**
- User account is authenicated
**Tests Validating:**
1. Start with an valid user id for another account
2. Makes GET request using another users Id
3. expect response code of 400
**Expected Result:**
Error code and no data is returned
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`

---

### JOURNAL-API-012: should reject POST request for alternate user
**Status:** `[competed]`
**Priority:** High
**Test Suite:**
**Description:**
Journal entries cannot be created for other users ids
**Preconditions:**
- User account is authenicated
**Tests Validating:**
1. Start with a valid user Id for another user
2. Makes POST request using another users Id
3. Request has all other valid info
4. expect response code of 401 or 403
**Expected Result:**
Error code and no data is created
**Playwright File:** - `tests/api/journal-entries.api.spec.ts`