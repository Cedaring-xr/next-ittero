import { test, expect } from '@playwright/test'

// Clear storageState for sign-in tests - we're testing unauthenticated flows
test.use({ storageState: { cookies: [], origins: [] } })

const url = process.env.BASE_URL as string
const test_email: string = process.env.PLAYWRIGHT_TEST_ADMIN_EMAIL as string
const test_password: string = process.env.PLAYWRIGHT_TEST_ADMIN_PASSWORD as string

test('[AUTH-005] @smoke should navigate to the sign up page', async ({ page }) => {
   await page.goto(`${url}/`)
   await page.getByRole('link', {name: 'Sign Up'}).click()
   await expect(page).toHaveURL(`${url}/auth/signup`)
   await expect(page.getByRole('heading', {level: 1, name: 'Please create an account.'})).toBeVisible()
   await expect(page.getByRole('textbox', {name: 'Name'})).toBeVisible()
   await expect(page.getByRole('textbox', {name: 'Email'})).toBeVisible()
   await expect(page.getByRole('textbox', {name: 'Password'})).toBeVisible()
   await expect(page.getByRole('button', {name: 'Create account'})).toBeVisible()
   await expect(page.getByRole('link', {name: 'Already have an account? Log in.'})).toBeVisible()
})

test('[AUTH-007] @smoke should redirect unauthenticated users from protected routes', async({page}) => {
   await page.goto(`${url}/`)
   await expect(page.getByRole('link', {name: 'Log In'})).toBeVisible()
   await page.goto(`${url}/dashboard`)
   await expect(page).toHaveURL(`${url}/auth/login`)
})
