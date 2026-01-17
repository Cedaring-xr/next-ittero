import { test, expect } from '@playwright/test'

// Uses storageState from auth.setup.ts (admin user is pre-authenticated)
const url = process.env.BASE_URL as string

// Use admin auth for all tests in this file
  test.use({ storageState: 'tests/.auth/admin.json' })

test('[NAV-001] @smoke should be able to navigate through the links on dashboard page', async ({ page }) => {
   await page.goto(`${url}/dashboard`)
   await expect(page.getByRole('heading', {level: 1, name: 'Your Dashboard' })).toBeVisible()
   await page.getByRole('link', {name: 'Create New List'}).click()
   await page.waitForLoadState('networkidle')  // Wait for hydration 
   await expect(page).toHaveURL(`${url}/dashboard/lists/newList`)
   await page.goBack();
   await page.getByRole('link', {name: 'View Active Lists'}).click()
   await page.waitForLoadState('networkidle')  // Wait for hydration 
   await expect(page).toHaveURL(`${url}/dashboard/lists`)
   await page.goBack()
   await page.getByRole('link', {name: "Write Quick Journal"}).click()
   await page.waitForLoadState('networkidle')  // Wait for hydration 
   await expect(page).toHaveURL(`${url}/dashboard/journal/newJournal`)
   await page.goBack()
   await page.getByRole('link', {name: 'View Journal Entries'}).click()
   await page.waitForLoadState('networkidle')  // Wait for hydration 
   await expect(page).toHaveURL(`${url}/dashboard/journal`)
   await page.goBack()
   await page.getByRole('link', {name: 'Stats & Review'}).click()
   await page.waitForLoadState('networkidle')  // Wait for hydration 
   await expect(page).toHaveURL(`${url}/dashboard/stats`)
   await page.goBack()
   await page.getByRole('link', {name: 'User Feedback'}).click()
   await page.waitForLoadState('networkidle')  // Wait for hydration 
   await expect(page).toHaveURL(`${url}/dashboard/feedback`)
})


test.skip('[NAV-002] @smoke', async ({page}) => {
   await page.goto(`${url}/dashboard`)
   await expect(page.getByRole('heading', {level: 1, name: 'Your Dashboard' })).toBeVisible()
})
