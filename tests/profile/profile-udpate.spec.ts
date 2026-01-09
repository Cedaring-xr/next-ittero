import { test, expect } from '@playwright/test'
import { randomName } from '../helpers/helperFunctions'

const url = process.env.BASE_URL as string
const user_name = randomName() as string

// Use admin auth for all tests in this file
  test.use({ storageState: 'tests/.auth/admin.json' })

test('[PROF-003] should be able to update user name from profile page', async ({ page }) => {
	// Go directly to profile page (already authenticated via storageState)
	await page.goto(`${url}/dashboard/profile`)
	// Verify profile settings heading is visible
	await expect(page.getByRole('heading', { name: 'Profile Settings' })).toBeVisible()
	// find input field and fill in generated name
	await page.getByRole('textbox', { name: 'name'}).fill(user_name)
	// click on update name button
	await page.click("text=Update Name")
	// wait for success message before navigating
	await expect(page.getByText('Name has been updated successfully')).toBeVisible()
	// go back to the dashboard page
	await page.goto(`${url}/dashboard`)
	// verify that name has changed on the dashboard page header
	await expect(page.getByTestId('user-display-name')).toContainText(user_name)
	// reset name to original
	await page.goto(`${url}/dashboard/profile`)
	// find input field and fill in generated name
	await page.getByRole('textbox', { name: 'name'}).fill("Matt Ray")
	// click on update name button
	await page.click("text=Update Name")
	// wait for success message
	await expect(page.getByText('Name has been updated successfully')).toBeVisible()
})


test('[PROF-004] should not be able to enter blank field for updating user name', async ({ page }) => {
	// Go directly to profile page (already authenticated via storageState)
	await page.goto(`${url}/dashboard/profile`)
	await expect(page.getByRole('heading', { name: 'Profile Settings' })).toBeVisible()
	// find input field and fill in generated name
	await page.getByRole('textbox', { name: 'name'}).fill('')
	// click on update name button
	await page.click("text=Update Name")
	// verify alert message
	await page.getByText('Please fill out this field.')
})

test.skip('[PROF-005] should be able to adjust user preferences settings for Date and time', async ({ page }) => {

})

test.skip('[PROF-006] should be able to adjust user preferences for theme', async ({ page }) => {

})

test.skip('[PROF-007] should be able to adjust user notification settings', async ({ page }) => {

})

/* 
	Out of scope: 
		changing email or password
		Delete account
*/
