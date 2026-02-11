# Accessibility Debug Scripts

## debug-a11y.ts

A comprehensive tool for debugging accessibility violations in your application.

### Quick Start

```bash
# Test a public page
npx tsx scripts/debug-a11y.ts /auth/login

# Test an authenticated page
npx tsx scripts/debug-a11y.ts /dashboard --authenticated

# Test with user interaction (e.g., trigger form validation)
npx tsx scripts/debug-a11y.ts /auth/login --click "button:has-text('Log in')"

# Filter by specific rule
npx tsx scripts/debug-a11y.ts /auth/login --rule color-contrast

# Filter by severity level
npx tsx scripts/debug-a11y.ts /dashboard --authenticated --impact serious
```

### All Options

| Option | Description | Example |
|--------|-------------|---------|
| `--authenticated` | Use logged-in user session | `--authenticated` |
| `--admin` | Use admin session | `--admin` |
| `--click "selector"` | Click element before scan | `--click "button:has-text('Submit')"` |
| `--type "sel" "text"` | Type into input before scan | `--type "#email" "test@example.com"` |
| `--rule "rule-id"` | Only show specific rule | `--rule color-contrast` |
| `--impact "level"` | Filter by severity | `--impact serious` |
| `--headless` | Run without visible browser | `--headless` |

### Common Use Cases

#### 1. Debug form validation errors
```bash
npx tsx scripts/debug-a11y.ts /auth/signup --click "button:has-text('Create account')"
```

#### 2. Check color contrast issues
```bash
npx tsx scripts/debug-a11y.ts /dashboard --authenticated --rule color-contrast
```

#### 3. Debug authenticated pages
```bash
npx tsx scripts/debug-a11y.ts /dashboard/profile --authenticated
```

#### 4. Check for missing labels
```bash
npx tsx scripts/debug-a11y.ts /auth/login --rule label
```

#### 5. Find all critical issues
```bash
npx tsx scripts/debug-a11y.ts /dashboard --authenticated --impact critical
```

### Common Rule IDs

- `color-contrast` - Text color doesn't contrast enough with background
- `document-title` - Missing or empty page title
- `html-has-lang` - Missing lang attribute on html element
- `button-name` - Button missing accessible name
- `image-alt` - Image missing alt text
- `label` - Form input missing label
- `link-name` - Link missing accessible text
- `aria-required-attr` - Missing required ARIA attributes
- `tabindex` - Tabindex value greater than 0

### Output Explanation

The script provides detailed information for each violation:

- **Rule**: The accessibility rule that was violated
- **Impact**: Severity level (critical, serious, moderate, minor)
- **Description**: What the rule checks for
- **Help**: How to fix the issue
- **Learn more**: Link to full documentation
- **Selector**: CSS selector to find the element
- **HTML**: The actual HTML of the problematic element
- **Failure**: Detailed explanation of what's wrong
- **Fix suggestions**: Specific steps to resolve the issue

### Tips

1. **Run without --headless** (default) to keep the browser open for manual inspection
2. **Use browser DevTools** (F12) while the browser is open to inspect elements
3. **Start with --impact critical** to focus on the most important issues
4. **Use --rule** to debug specific types of issues
5. **Check the helpUrl** links for detailed WCAG documentation
