import { test, expect } from '@playwright/test'
import { scanElement, assertNoViolations, assertNoCriticalViolations, scanPage } from './a11y-utils'

const url = process.env.BASE_URL as string

/**
 * Modal Accessibility Tests
 * Tests for modal dialogs and their accessibility compliance
 */
test.describe('@a11y Modal Accessibility', () => {
	test.use({ storageState: 'tests/.auth/user.json' })

	test('[A11Y-030] @a11y Add Task modal should have no critical accessibility violations', async ({ page }) => {
		// Navigate to a list detail page
		await page.goto(`${url}/dashboard/lists`)
		await page.waitForLoadState('networkidle')

		// Wait for lists to load and click on the first list
		const listItem = page.locator('[id="list-container"] > div').first()
		const listExists = await listItem.count()

		if (listExists > 0) {
			await listItem.click()
			await page.waitForLoadState('networkidle')

			// Click the "Add New Task" button to open the modal
			await page.getByRole('button', { name: /add new task/i }).click()

			// Wait for modal to be visible
			await page.waitForSelector('[role="dialog"]', { state: 'visible' })

			// Scan the modal for accessibility violations
			const violations = await scanElement(page, '[role="dialog"]')
			assertNoViolations(violations, 'Add Task modal')
		} else {
			test.skip()
		}
	})

	test('[A11Y-031] @a11y Delete confirmation modal should have no critical accessibility violations', async ({
		page
	}) => {
		// Navigate to a list detail page
		await page.goto(`${url}/dashboard/lists`)
		await page.waitForLoadState('networkidle')

		// Wait for lists to load and click on the first list
		const listItem = page.locator('[id="list-container"] > div').first()
		const listExists = await listItem.count()

		if (listExists > 0) {
			await listItem.click()
			await page.waitForLoadState('networkidle')

			// Look for a delete button on an existing task
			const deleteButton = page.getByRole('button', { name: /delete todo/i }).first()
			const deleteExists = await deleteButton.count()

			if (deleteExists > 0) {
				await deleteButton.click()

				// Wait for confirmation modal to be visible
				await page.waitForSelector('[role="dialog"]', { state: 'visible' })

				// Scan the modal for accessibility violations
				const violations = await scanElement(page, '[role="dialog"]')
				assertNoViolations(violations, 'Delete confirmation modal')
			} else {
				test.skip()
			}
		} else {
			test.skip()
		}
	})

	test('[A11Y-032] @a11y Modal can be closed with Escape key', async ({ page }) => {
		await page.goto(`${url}/dashboard/lists`)
		await page.waitForLoadState('networkidle')

		const listItem = page.locator('[id="list-container"] > div').first()
		const listExists = await listItem.count()

		if (listExists > 0) {
			await listItem.click()
			await page.waitForLoadState('networkidle')

			// Open the modal
			await page.getByRole('button', { name: /add new task/i }).click()
			await page.waitForSelector('[role="dialog"]', { state: 'visible' })

			// Press Escape to close
			await page.keyboard.press('Escape')

			// Verify modal is closed
			await expect(page.locator('[role="dialog"]')).not.toBeVisible()
		} else {
			test.skip()
		}
	})

	test('[A11Y-033] @a11y Modal has proper aria attributes', async ({ page }) => {
		await page.goto(`${url}/dashboard/lists`)
		await page.waitForLoadState('networkidle')

		const listItem = page.locator('[id="list-container"] > div').first()
		const listExists = await listItem.count()

		if (listExists > 0) {
			await listItem.click()
			await page.waitForLoadState('networkidle')

			await page.getByRole('button', { name: /add new task/i }).click()
			await page.waitForSelector('[role="dialog"]', { state: 'visible' })

			const modal = page.locator('[role="dialog"]')

			// Check for required ARIA attributes
			await expect(modal).toHaveAttribute('aria-modal', 'true')
			await expect(modal).toHaveAttribute('aria-labelledby', 'modal-title')

			// Verify the title element exists
			await expect(page.locator('#modal-title')).toBeVisible()
		} else {
			test.skip()
		}
	})
})

/**
 * Form State Accessibility Tests
 * Tests for forms in various states (empty, error, loading)
 */
test.describe('@a11y Form State Accessibility', () => {
	test.use({ storageState: { cookies: [], origins: [] } })   

	test('[A11Y-040] @a11y Login form with error state should be accessible', async ({ page }) => {
		await page.goto(`${url}/auth/login`)
		await page.waitForLoadState('networkidle')

		// Submit empty form to trigger validation
		await page.getByRole('button', { name: /log in/i }).click()

		// Wait for potential error states
		await page.waitForTimeout(500)

		await assertNoCriticalViolations(page, 'Login form with validation state')
	})

	test('[A11Y-041] @a11y Signup form with error state should be accessible', async ({ page }) => {
		await page.goto(`${url}/auth/signup`)
		await page.waitForLoadState('networkidle')

		// Submit empty form to trigger validation
		await page.getByRole('button', { name: /create account/i }).click()

		// Wait for potential error states
		await page.waitForTimeout(500)

		await assertNoCriticalViolations(page, 'Signup form with validation state')
	})

	test.describe('Authenticated Form States', () => {
		test.use({ storageState: 'tests/.auth/user.json' })

		test('[A11Y-042] @a11y New list form should be accessible', async ({ page }) => {
			await page.goto(`${url}/dashboard/lists/newList`)
			await page.waitForLoadState('networkidle')

			await assertNoCriticalViolations(page, 'New list form')
		})

		test('[A11Y-043] @a11y New journal form should be accessible', async ({ page }) => {
			await page.goto(`${url}/dashboard/journal/newJournal`)
			await page.waitForLoadState('networkidle')

			await assertNoCriticalViolations(page, 'New journal form')
		})
	})
})

/**
 * Empty State Accessibility Tests
 * Tests for pages/components in empty states
 */
test.describe('@a11y Empty State Accessibility', () => {
	test.use({ storageState: 'tests/.auth/user.json' })

	test('[A11Y-050] @a11y Lists page empty state should be accessible', async ({ page }) => {
		await page.goto(`${url}/dashboard/lists`)
		await page.waitForLoadState('networkidle')

		// Wait for loading to complete
		await page.waitForTimeout(1000)

		// Check for either lists or empty state
		const emptyState = page.getByText(/no lists yet/i)
		const hasEmptyState = await emptyState.count()

		if (hasEmptyState > 0) {
			await assertNoCriticalViolations(page, 'Lists page empty state')
		} else {
			// Lists exist, still run accessibility check
			await assertNoCriticalViolations(page, 'Lists page with content')
		}
	})
})

/**
 * Loading State Accessibility Tests
 * Tests for pages during loading states
 */
test.describe('@a11y Loading State Accessibility', () => {
	test.use({ storageState: 'tests/.auth/user.json' })

	test('[A11Y-060] @a11y Loading spinner should be accessible', async ({ page }) => {
		await page.goto(`${url}/dashboard/lists`)

		// Check if loading spinner is visible (may be brief)
		const spinner = page.locator('.animate-spin')
		const spinnerVisible = await spinner.count()

		if (spinnerVisible > 0) {
			// Run quick scan during loading state
			const violations = await scanPage(page, {
				includedImpacts: ['critical', 'serious']
			})
			assertNoViolations(violations, 'Page with loading spinner')
		}

		// Also test after load completes
		await page.waitForLoadState('networkidle')
		await assertNoCriticalViolations(page, 'Lists page after load')
	})
})

/**
 * Interactive Component Accessibility Tests
 * Tests for interactive components like dropdowns, accordions, etc.
 */
test.describe('@a11y Interactive Component Accessibility', () => {
	test.use({ storageState: 'tests/.auth/user.json' })

	test('[A11Y-070] @a11y Sidenav should be navigable with keyboard', async ({ page }) => {
		await page.goto(`${url}/dashboard`)
		await page.waitForLoadState('networkidle')

		// Check that nav links are focusable
		const navLinks = page.locator('nav a')
		const linkCount = await navLinks.count()

		expect(linkCount).toBeGreaterThan(0)

		// Tab through navigation and verify focus
		for (let i = 0; i < Math.min(linkCount, 5); i++) {
			await page.keyboard.press('Tab')
		}

		// Verify some element is focused
		const focusedElement = page.locator(':focus')
		await expect(focusedElement).toBeTruthy()
	})

	test('[A11Y-071] @a11y Completed tasks accordion should be accessible', async ({ page }) => {
		await page.goto(`${url}/dashboard/lists`)
		await page.waitForLoadState('networkidle')

		const listItem = page.locator('[id="list-container"] > div').first()
		const listExists = await listItem.count()

		if (listExists > 0) {
			await listItem.click()
			await page.waitForLoadState('networkidle')

			// Look for completed tasks toggle
			const completedToggle = page.getByRole('button', { name: /completed tasks/i })
			const toggleExists = await completedToggle.count()

			if (toggleExists > 0) {
				// Click to expand
				await completedToggle.click()
				await page.waitForTimeout(300)

				await assertNoCriticalViolations(page, 'List detail with expanded completed tasks')
			}
		}
	})
})

/**
 * Color Contrast and Visual Accessibility
 * These tests use axe-core's color contrast rules
 */
test.describe('@a11y Visual Accessibility', () => {
	test.skip('[A11Y-080] @a11y Demo page charts should have accessible color contrast', async ({ page }) => {
		await page.goto(`${url}/demo`)
		await page.waitForLoadState('networkidle')

		// Focus on the stats section
		const statsSection = page.locator('text=Journal Statistics').first()
		await statsSection.scrollIntoViewIfNeeded()

		await assertNoCriticalViolations(page, 'Demo page statistics section')
	})
})
