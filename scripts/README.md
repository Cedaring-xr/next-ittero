# Scripts

This directory contains utility scripts for the Ittero project.

## Available Scripts

### compile-test-cases.ts

Compiles all test case documentation from `tests/test-cases/**/*.md` into a single JSON file.

**Usage:**
```bash
npm run test:compile-cases
```

**Output:**
- File: `tests/compiled-test-cases.json`
- Format: Structured JSON with test cases organized by category

**Output Structure:**
```json
{
  "generatedAt": "2026-01-30T19:40:50.040Z",
  "totalTestCases": 42,
  "categories": {
    "e2e": {
      "count": 42,
      "testCases": [
        {
          "id": "AUTH-001",
          "title": "Navigate to Sign-In Page",
          "status": "Completed",
          "priority": "high",
          "testSuite": "smoke",
          "description": "...",
          "preconditions": ["..."],
          "testSteps": ["..."],
          "expectedResult": "...",
          "playwrightFile": "tests/auth/signin.spec.ts",
          "category": "e2e",
          "filePath": "tests/test-cases/e2e/auth.md"
        }
      ]
    }
  },
  "statusSummary": {
    "Completed": 12,
    "Planned": 17,
    "Future Content": 8,
    "Skipped": 1
  },
  "prioritySummary": {
    "high": 25,
    "medium": 9,
    "low": 8
  }
}
```

**Use Case:**
- Share test case documentation with other projects
- Generate reports from test case data
- Track test coverage across different categories
- Export test specifications for external tools

---

### generate-test-results.ts

Compiles test execution results into a single JSON file.

**Usage:**
```bash
npm run test:generate-results
```

**Output:**
- File: `test-results.json`
- Format: Test execution results with pass/fail status

---

## Notes

- Both output files (`compiled-test-cases.json` and `test-results.json`) are included in `.gitignore`
- Scripts use `tsx` to execute TypeScript directly without compilation
- All scripts can be run from the project root using npm scripts
