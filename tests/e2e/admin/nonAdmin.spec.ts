import { test, expect } from '@playwright/test'

// Uses storageState from auth.setup.ts (non-admin user is pre-authenticated)

const url = process.env.BASE_URL as string

// Use normal user auth for all tests in this file
  test.use({ storageState: 'tests/.auth/user.json' })

test('[ADMN-002] @smoke should not be able to view the admin section of the dashboard as a normal user', async ({ page }) => {
   await page.goto(`${url}/dashboard`)
   await expect(page.getByRole('heading', {level: 1, name: 'Your Dashboard' })).toBeVisible()
   await expect(page.getByText('Admin Area')).toHaveCount(0)
   await page.goto(`${url}/dashboard/admins`)
   await expect(page).toHaveURL(`${url}/dashboard`)
})
