import { test, expect } from '@playwright/test'
import { randomName } from '../helpers/helperFunctions'

const url = process.env.BASE_URL as string
const user_name = randomName() as string

// Use admin auth for all tests in this file
test.use({ storageState: 'tests/.auth/admin.json' })

test.skip('[PROF-003] should be able to update user name from profile page', async ({ page }) => {
	await page.goto(`${url}/dashboard/profile`)
	await expect(page.getByRole('heading', {level: 1, name: 'Profile Settings' })).toBeVisible()
	await page.getByRole('textbox', { name: 'Enter your name'}).fill(user_name)
	await page.getByRole('button', {name: 'Update Name'}).click()
	await expect(page.getByText('Name has been updated successfully')).toBeVisible()
	await page.goto(`${url}/dashboard`)
	await expect(page.getByTestId('user-display-name')).toContainText(user_name)
	await page.goto(`${url}/dashboard/profile`)
	await page.getByRole('textbox', { name: 'Enter your name'}).fill("Matt Ray")
	await page.getByRole('button', {name: 'Update Name'}).click()
	await expect(page.getByText('Name has been updated successfully')).toBeVisible()
})

test('[PROF-004] should not be able to enter blank field for updating user name', async ({ page }) => {
	await page.goto(`${url}/dashboard/profile`)
	await expect(page.getByRole('heading', {level: 1, name: 'Profile Settings' })).toBeVisible()
	const nameInput = page.getByRole('textbox', { name: 'Enter your name'})
	await nameInput.fill('')
	await page.getByRole('button', {name: 'Update Name'}).click()
	// Check that the input is invalid (browser validation prevents submission)
	await expect(nameInput).toHaveJSProperty('validity.valid', false)
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
