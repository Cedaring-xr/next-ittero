import { test, expect } from '@playwright/test'

const url = process.env.BASE_URL as string

// Use admin auth for all tests in this file
  test.use({ storageState: 'tests/.auth/admin.json' })

test('[PROF-001] should navigate to profile settings page', async ({ page }) => {
	// Go directly to dashboard (already authenticated via storageState)
	await page.goto(`${url}/dashboard`)
	// Verify we're on the dashboard
	await expect(page.getByRole('heading', { name: 'Your Dashboard' })).toBeVisible()
	// Click the profile button in the sidenav
	await page.click('text=Profile')
	// Verify navigation to profile page
	await expect(page).toHaveURL(`${url}/dashboard/profile`)
	// Verify profile settings heading is visible
	await expect(page.getByRole('heading', { name: 'Profile Settings' })).toBeVisible()
})

test('[PROF-002] should be able to navigate to profile setting from header icon', async ({ page }) => {
	// Go directly to dashboard (already authenticated via storageState)
	await page.goto(`${url}/dashboard`)
	// Verify we're on the dashboard
	await expect(page.getByRole('heading', { name: 'Your Dashboard' })).toBeVisible()
	// Click the gear settings icon
	await page.click('#profile-settings')
	// verify that url changes to /dashboard/profile
	await expect(page).toHaveURL(`${url}/dashboard/profile`)
	// verify profile settings header is visible
	await expect(page.getByRole('heading', { name: 'Profile Settings' })).toBeVisible()
})
