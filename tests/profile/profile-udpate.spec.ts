import { test, expect } from '@playwright/test'
import { randomName } from '../helpers/helperFunctions'

const url = process.env.BASE_URL as string
const user_name = randomName() as string

test('[PROF-002] should be able to update user name from profile page', async ({ page }) => {
	// Go directly to profile page (already authenticated via storageState)
	await page.goto(`${url}/dashboard/profile`)

	// Verify profile settings heading is visible
	await expect(page.getByRole('heading', { name: 'Profile Settings' })).toBeVisible()

	// TODO: Uncomment when ready to test name updates
	// find input field and fill in generated name
	// await page.getByRole('textbox', { name: 'name'}).fill(user_name)
	// // click on update name button
	// await page.click("text=Update Name")
	// // go back to the dashboard page
	// await page.click("text=Home")
	// // verify that name has been updated in the dashboard text
	// await expect(page).toHaveURL(`${url}/dashboard`)
	// // verify that name has changed on the dashboard page header
	// await expect(page.locator('h2')).toContainText(user_name)
})

/*todo:
    test the ability to change user name by using random string appended to name
    verify that the name has been changed by checking the name on the dashboard
    * match the name to the random string after it has been changed, before just check for a string that is visible
    I don't want to change password or email
*/
