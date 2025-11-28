import { test, expect } from '@playwright/test'

// command for running tests (npx playwright test)
// run using the ui viewer (npx playwright test --ui)

// test('should navigate to the sign in page', async ({ page }) => {
// 	// Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
// 	await page.goto('http://localhost:3000/')
// 	// Find an element with the text 'About' and click on it
// 	await page.click('text=Log In')
// 	// The new URL should be "/auth/login" (baseURL is used there)
// 	await expect(page).toHaveURL('http://localhost:3000/auth/login')
// 	// The new page should contain an h1 with "Please log in to continue."
// 	await expect(page.locator('h1')).toContainText('Please log in to continue.')
// })

// test
