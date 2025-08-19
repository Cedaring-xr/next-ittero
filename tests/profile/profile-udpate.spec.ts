import { test, expect } from '@playwright/test'
import { randomName } from '../helpers/helperFunctions'

const test_email: string = process.env.PLAYWRIGHT_TEST_EMAIL as string
const test_password: string = process.env.PLAYWRIGHT_TEST_PASSWORD as string
const user_name = randomName() as string

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
	// verify that the user is on the dashboad page (successful sign-in
	await expect(page.locator('h2')).toContainText('Your Dashboard')
    // click the profile button in the sidenavs
    await page.click("text=Profile")
    // verify that the user is now on the profile page
    await expect(page).toHaveURL('http://localhost/dashboard/profile')
    // verify that profile settings options are visible
    await expect(page.locator('h1')).toContainText('Profile Settings')
    // find input field and fill in generated name
    await page.getByRole('textbox', { name: 'name'}).fill(user_name)
    // click on update name button
    await page.click("text=Update Name")
    // go back to the dashboad page
    await page.click("text=Home")
    // verify that name has been udpated in the dashboard text
    await expect(page).toHaveURL("http://localhost:3000/dashboard")
    // verify that name has changed on the dashboard page header
    await expect(page.locator('h2')).toContainText(user_name)
})

/*todo:
    test the ability to change user name by using random string appended to name
    verify that the name has been changed by checking the name on the dashboard
    * match the name to the random string after it has been changed, before just check for a string that is visible
    I don't want to change password or email
*/
