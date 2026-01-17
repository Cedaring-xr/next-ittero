import { test, expect } from '@playwright/test'
import { scanPage, assertNoViolations, assertNoCriticalViolations } from './a11y-utils'

const url = process.env.BASE_URL as string

/**
 * Public Pages Accessibility Tests
 * These pages are accessible without authentication
 */
test.describe('@a11y Public Pages Accessibility', () => {
	test('[A11Y-001] @a11y Home page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'Home page')
	})

	test('[A11Y-002] @a11y Login page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/auth/login`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'Login page')
	})

	test('[A11Y-003] @a11y Signup page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/auth/signup`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'Signup page')
	})

	test('[A11Y-004] @a11y Demo page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/demo`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'Demo page')
	})

	test('[A11Y-005] @a11y FAQ page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/faq`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'FAQ page')
	})

	test('[A11Y-006] @a11y Reset password page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/auth/reset-password/submit`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'Reset password page')
	})
})

/**
 * Authenticated Pages Accessibility Tests
 * These require user authentication
 */
test.describe('@a11y Authenticated Pages Accessibility', () => {
	test.use({ storageState: 'tests/.auth/user.json' })

	test('[A11Y-010] @a11y Dashboard page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/dashboard`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'Dashboard page')
	})

	test('[A11Y-011] @a11y Lists page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/dashboard/lists`)
		await page.waitForLoadState('networkidle')
		// Wait for lists to load
		await page.waitForTimeout(1000)

		await assertNoCriticalViolations(page, 'Lists page')
	})

	test('[A11Y-012] @a11y Journal page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/dashboard/journal`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'Journal page')
	})

	test('[A11Y-013] @a11y New Journal page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/dashboard/journal/newJournal`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'New Journal page')
	})

	test('[A11Y-014] @a11y Stats page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/dashboard/stats`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'Stats page')
	})

	test('[A11Y-015] @a11y Profile page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/dashboard/profile`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'Profile page')
	})

	test('[A11Y-016] @a11y New List page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/dashboard/lists/newList`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'New List page')
	})

	test('[A11Y-017] @a11y Feedback page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/dashboard/feedback`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'Feedback page')
	})
})

/**
 * Admin Pages Accessibility Tests
 * These require admin authentication
 */
test.describe('@a11y Admin Pages Accessibility', () => {
	test.use({ storageState: 'tests/.auth/admin.json' })

	test('[A11Y-020] @a11y Admin page should have no critical accessibility violations', async ({ page }) => {
		await page.goto(`${url}/dashboard/admins`)
		await page.waitForLoadState('networkidle')

		await assertNoCriticalViolations(page, 'Admin page')
	})
})

/**
 * Full Scan Tests (all violations)
 * These tests report all violations for comprehensive auditing
 */
test.describe('@a11y Full Accessibility Audit', () => {
	test('[A11Y-100] @a11y-full Home page full accessibility audit', async ({ page }) => {
		await page.goto(`${url}/`)
		await page.waitForLoadState('networkidle')

		const violations = await scanPage(page)
		assertNoViolations(violations, 'Home page (full audit)')
	})

	test.describe('Authenticated Full Audit', () => {
		test.use({ storageState: 'tests/.auth/user.json' })

		test('[A11Y-101] @a11y-full Dashboard full accessibility audit', async ({ page }) => {
			await page.goto(`${url}/dashboard`)
			await page.waitForLoadState('networkidle')

			const violations = await scanPage(page)
			assertNoViolations(violations, 'Dashboard page (full audit)')
		})
	})
})
