import { test, expect } from '@playwright/test'

const url = process.env.BASE_URL as string

// Use admin auth for all tests in this file
  test.use({ storageState: 'tests/.auth/admin.json' })

test('[PROF-001] @smoke should navigate to profile settings page', async ({ page }) => {
	await page.goto(`${url}/dashboard`)
	await expect(page.getByRole('heading', {level: 2, name: 'Your Dashboard'})).toBeVisible()
	await page.getByRole('link', {name: 'Profile'}).click()
	await expect(page).toHaveURL(`${url}/dashboard/profile`)
	await expect(page.getByRole('heading', {level: 2, name: 'Profile Settings' })).toBeVisible()
})

test('[PROF-002] @smoke should be able to navigate to profile setting from header icon', async ({ page }) => {
	await page.goto(`${url}/dashboard`)
	await expect(page.getByRole('heading', {level: 2, name: 'Your Dashboard'})).toBeVisible()
	await(page.locator('#profile-settings')).click()
	await expect(page).toHaveURL(`${url}/dashboard/profile`)
	await expect(page.getByRole('heading', {level: 2, name: 'Profile Settings' })).toBeVisible()
})
