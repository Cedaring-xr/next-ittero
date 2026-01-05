import { test, expect } from '@playwright/test'

const test_email: string = process.env.PLAYWRIGHT_TEST_ADMIN_EMAIL as string
const test_password: string = process.env.PLAYWRIGHT_TEST_ADMIN_PASSWORD as string

test('should sign-in to the test account using email and password', async ({ page }) => {
	// Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
	await page.goto('http://localhost:3000/')
	// Find an element with the text 'About' and click on it
	await page.click('text=Log In')
	// The new URL should be "/auth/login" (baseURL is used there)
	await expect(page).toHaveURL('http://localhost:3000/auth/login')
	// The new page should contain an h1 with "Please log in to continue."
	await expect(page.locator('h1')).toContainText('Please sign in to continue.')
	// input email for test account into the email field
	await page.getByLabel('email').fill(test_email)
	// input the password for test account into the password field
	await page.getByLabel('password').fill(test_password)
	// click the log-in button
	await page.click('text=Log In')
	// verfiy that the url is on the dashboard page
	await expect(page).toHaveURL('http://localhost:3000/dashboard')
	// verify that the user is on the dashboad page (successful sign-in
	await page.getByRole('heading', { name: 'Your Dashboard' })
    // click the profile button in the sidenav
    await page.click("text=Profile")
    // verify that the user is now on the profile page
    await expect(page).toHaveURL('http://localhost:3000/dashboard/profile')
    // verify that profile settings options are visible
    await page.getByRole('heading', { name: 'Profile Settings' })
})
