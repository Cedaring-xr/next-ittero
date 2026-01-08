import { test, expect } from '@playwright/test'

// Uses storageState from auth.setup.ts (admin user is pre-authenticated)

const url = process.env.BASE_URL as string

test('[ADMN-001] should be able to view the admin section of the dashboard as an admin user', async ({ page }) => {
	// Go directly to dashboard (already authenticated via storageState)
	await page.goto(`${url}/dashboard`)

	// Verify we're on the dashboard (successful authentication)
	await expect(page.getByRole('heading', { name: 'Your Dashboard' })).toBeVisible()

	// Click on the admin section from sidenav
	await page.click('text=Admin Area')

	// Verify that admin section is open
	await expect(page).toHaveURL(`${url}/dashboard/admins`)

	// Verify that text on admin page is visible
	await expect(page.getByRole('heading', { name: 'Admin Access Only' })).toBeVisible()
})
