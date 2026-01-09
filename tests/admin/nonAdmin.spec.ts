import { test, expect } from '@playwright/test'

// Uses storageState from auth.setup.ts (non-admin user is pre-authenticated)

const url = process.env.BASE_URL as string

// Use normal user auth for all tests in this file
  test.use({ storageState: 'tests/.auth/user.json' })

test('[ADMN-002] should not be able to view the admin section of the dashboard as a normal user', async ({ page }) => {
   // Go directly to dashboard (already authenticated via storageState)
   await page.goto(`${url}/dashboard`)

   // Verify we're on the dashboard (successful authentication)
   await expect(page.getByRole('heading', { name: 'Your Dashboard' })).toBeVisible()

   // CSearch for text of "Admin Area"
   await expect(page.getByText('Admin Area')).toHaveCount(0)

   // Navigate to admin page directly
   await page.goto(`${url}/dashboard/admins`)

   // Verify that user is shown access denied or redirected back to dashboard
   await expect(page).toHaveURL(`${url}/dashboard`)
})
