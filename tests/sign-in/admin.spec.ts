import { test, expect } from '@playwright/test'

const test_admin_email: string = process.env.PLAYWRIGHT_TEST_ADMIN_EMAIL as string
const test_admin_password: string = process.env.PLAYWRIGHT_TEST_ADMIN_PASSWORD as string

test('should be able to sign-in as an admin account and view the admin section of the dashboard', async ({ page }) => {
	// Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
	await page.goto('http://localhost:3000/')
	// Find an element with the text 'About' and click on it
	await page.click('text=Log In')
	// The new URL should be "/auth/login" (baseURL is used there)
	await expect(page).toHaveURL('http://localhost:3000/auth/login')
	// The new page should contain an h1 with "Please log in to continue."
	await expect(page.locator('h1')).toContainText('Please sign in to continue.')
	// input email for test account into the email field
	await page.getByRole('textbox', { name: 'email' }).fill(test_admin_email)
	// input the password for test account into the password field
	await page.getByRole('textbox', { name: 'password' }).fill(test_admin_password)
	// click the log-in button
	await page.click('text=Log In')
	// verfiy that the url is on the dashboard page
	await expect(page).toHaveURL('http://localhost:3000/dashboard')
	// verify thet the user is on the dashboad page (successful sign-in
	await expect(page.locator('h2')).toContainText('Your Dashboard')
    // click on the admin section from sidenavs
    await page.click("text=Admin Area")
    // verify that admin section is open
    await expect(page).toHaveURL('http://localhost:3000/dashboard/admins')
    // verify that text on admin page is visible
    await expect(page.locator('h2')).toContainText('Admin Access Only')
})
