import { test, expect } from '@playwright/test'

const test_email: string = process.env.PLAYWRIGHT_TEST_EMAIL as string
const test_password: string = process.env.PLAYWRIGHT_TEST_PASSWORD as string

test('should navigate to the sign in page', async ({ page }) => {
	// Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
	await page.goto('http://localhost:3000/')
	// Find an element with the text 'About' and click on it
	await page.click('text=Log In')
	// The new URL should be "/auth/login" (baseURL is used there)
	await expect(page).toHaveURL('http://localhost:3000/auth/login')
	// The new page should contain an h1 with "Please log in to continue."
	await expect(page.locator('h1')).toContainText('Please sign in to continue.')
})

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
	await page.getByRole('textbox', { name: 'email' }).fill(test_email)
	// input the password for test account into the password field
	await page.getByRole('textbox', { name: 'password' }).fill(test_password)
	// click the log-in button
	await page.click('text=Log In')
	// verfiy that the url is on the dashboard page
	await expect(page).toHaveURL('http://localhost:3000/dashboard')
	// verify thet the user is on the dashboad page (successful sign-in
	await expect(page.locator('h2')).toContainText('Your Dashboard')
})

test('should be able to sign-out of an account that has successfully signed-in', async ({ page }) => {
	// Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
	await page.goto('http://localhost:3000/')
	// Find an element with the text 'About' and click on it
	await page.click('text=Log In')
	// The new URL should be "/auth/login" (baseURL is used there)
	await expect(page).toHaveURL('http://localhost:3000/auth/login')
	// The new page should contain an h1 with "Please log in to continue."
	await expect(page.locator('h1')).toContainText('Please sign in to continue.')
	// input email for test account into the email field
	await page.getByRole('textbox', { name: 'email' }).fill(test_email)
	// input the password for test account into the password field
	await page.getByRole('textbox', { name: 'password' }).fill(test_password)
	// click the log-in button
	await page.click('text=Log In')
	// verfiy that the url is on the dashboard page
	await expect(page).toHaveURL('http://localhost:3000/dashboard')
	// verify thet the user is on the dashboad page (successful sign-in
	await expect(page.locator('h2')).toContainText('Your Dashboard')
	// verify that user is on the dashoard page
	await expect(page).toHaveURL('http://localhost:3000/dashboard')
	// click the sign-out button
	await page.click('text=Sign Out')
	// verify that the URL is on the login page
	await expect(page).toHaveURL('http://localhost:3000/auth/login')
	// verify that the login page text ins visible
	await expect(page.locator('h1')).toContainText('Please sign in to continue.')
})
