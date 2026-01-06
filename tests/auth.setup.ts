import { test as setup, expect } from '@playwright/test'

const authFile = 'tests/.auth/user.json'

const test_email = process.env.PLAYWRIGHT_TEST_ADMIN_EMAIL as string
const test_password = process.env.PLAYWRIGHT_TEST_ADMIN_PASSWORD as string

setup('authenticate', async ({ page }) => {
	// Go to login page
	await page.goto('http://localhost:3000/auth/login')

	// Verify we're on the login page
	await expect(page.locator('h1')).toContainText('Please sign in to continue.')

	// Fill in credentials
	await page.getByLabel('Email').fill(test_email)
	await page.getByLabel('Password').fill(test_password)

	// Click login
	await page.click('text=Log In')

	// Wait for successful navigation to dashboard
	await expect(page).toHaveURL('http://localhost:3000/dashboard')
	await expect(page.getByRole('heading', { name: 'Your Dashboard' })).toBeVisible()

	// Save authentication state
	await page.context().storageState({ path: authFile })
})
