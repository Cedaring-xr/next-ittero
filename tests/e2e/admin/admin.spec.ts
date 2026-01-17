import { test, expect } from '@playwright/test'

// Uses storageState from auth.setup.ts (admin user is pre-authenticated)
const url = process.env.BASE_URL as string

// Use admin auth for all tests in this file
  test.use({ storageState: 'tests/.auth/admin.json' })

test('[ADMN-001] @smoke should be able to view the admin section of the dashboard as an admin user', async ({ page }) => {
	await page.goto(`${url}/dashboard`)
	await expect(page.getByRole('heading', {level: 1, name: 'Your Dashboard' })).toBeVisible()
	await page.getByRole('link', {name: 'Admin Area'}).click()
	await expect(page).toHaveURL(`${url}/dashboard/admins`)
	await expect(page.getByRole('heading', { name: 'Admin Access Only' })).toBeVisible()
})
