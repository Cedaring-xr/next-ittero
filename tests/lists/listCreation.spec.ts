import { test, expect } from '@playwright/test'

// Uses storageState from auth.setup.ts (admin user is pre-authenticated)
const url = process.env.BASE_URL as string

// Use admin auth for all tests in this file
  test.use({ storageState: 'tests/.auth/admin.json' })

test.skip('[LIST-001] @smoke should be able to retrieve user lists', async ({ page }) => {
   await page.goto(`${url}/dashboard`)
   await expect(page.getByRole('heading', {level: 2, name: 'Your Dashboard' })).toBeVisible()
   
})



