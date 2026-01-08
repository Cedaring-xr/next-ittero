import { test, expect } from '@playwright/test'

const url = process.env.BASE_URL as string

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
