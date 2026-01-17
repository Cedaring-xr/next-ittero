import { test, expect } from '@playwright/test'

// Clear storageState for sign-in tests - we're testing unauthenticated flows
test.use({ storageState: { cookies: [], origins: [] } })

const url = process.env.BASE_URL as string
const test_email: string = process.env.PLAYWRIGHT_TEST_ADMIN_EMAIL as string
const test_password: string = process.env.PLAYWRIGHT_TEST_ADMIN_PASSWORD as string

test('[AUTH-001] @smoke should navigate to the sign in page', async ({ page }) => {
	await page.goto(`${url}/`)
	await page.getByRole('link', {name: 'Log in'}).click()
	await expect(page).toHaveURL(`${url}/auth/login`)
	await expect(page.getByRole('heading', {level: 1, name: 'Please sign in to continue.'})).toBeVisible()
	await expect(page.getByRole('textbox', {name: 'Email'})).toBeVisible()
	await expect(page.getByRole('textbox', {name: 'Password'})).toBeVisible()
	await expect(page.getByRole('link', {name: 'Forgot password? Click here.'})).toBeVisible()
	await expect(page.getByRole('link', {name: 'Don\'t have an account? Sign up.'})).toBeVisible()
})

test('[AUTH-002] @smoke should sign-in to the test account using email and password', async ({ page }) => {
	await page.goto(`${url}/`)
	await page.getByRole('link', {name: 'Log in'}).click()
	await expect(page).toHaveURL(`${url}/auth/login`)
	await page.waitForLoadState('networkidle')  // Wait for hydration 
	await expect(page.getByRole('heading', {level: 1, name: 'Please sign in to continue.'})).toBeVisible()
	await page.getByRole('textbox', {name: 'Email'}).fill(test_email)
	await page.getByRole('textbox', {name: 'Password'}).fill(test_password)
	await page.getByRole('button', {name: 'Log in'}).click()
	await expect(page).toHaveURL(`${url}/dashboard`)
	await expect(page.getByRole('heading', {level: 1, name: 'Your Dashboard' })).toBeVisible()
})

test.describe('Sign out tests', () => {
	// Use authenticated user state from auth.setup.ts
	test.use({ storageState: 'tests/.auth/user.json' })
	test('[AUTH-003] @smoke should be able to sign-out of an account that has successfully signed-in', async ({ page }) => {
		await page.goto(`${url}/dashboard`)
		await expect(page).toHaveURL(`${url}/dashboard`)
		await expect(page.getByRole('heading', { level: 1, name: 'Your Dashboard' })).toBeVisible()
		await page.getByRole('button', { name: 'Sign Out' }).click()
		await expect(page).toHaveURL(`${url}/auth/login`)
		await expect(page.getByRole('heading', { level: 1, name: 'Please sign in to continue.' })).toBeVisible()
	})
})

test('[AUTH-004] @smoke should fail to sign-in when using incorrect password', async ({ page }) => {
	await page.goto(`${url}/`)
	await page.getByRole('link', {name: 'Log in'}).click()
	await expect(page).toHaveURL(`${url}/auth/login`)
	await page.waitForLoadState('networkidle')  // Wait for hydration 
	await expect(page.getByRole('heading', {level: 1, name: 'Please sign in to continue.'})).toBeVisible()
	await page.getByRole('textbox', {name: 'Email'}).fill(test_email)
	await page.getByRole('textbox', {name: 'Password'}).fill('incorrect')
	await page.getByRole('button', {name: 'Log in'}).click()
	await expect(page.getByText('Incorrect username or password.')).toBeVisible()
})

test.describe('Sign out tests', () => {
	// Use authenticated user state from auth.setup.ts
	test.use({ storageState: 'tests/.auth/user.json' })
		test('[AUTH-008] @smoke should verify that authenticated users are redirected away from auth pages', async ({page}) => {
			await page.goto(`${url}/dashboard`)
			await expect(page).toHaveURL(`${url}/dashboard`)
			await expect(page.getByRole('heading', { level: 1, name: 'Your Dashboard' })).toBeVisible()
			await page.goto(`${url}/auth/login`)
			await expect(page).toHaveURL(`${url}/dashboard`)
			await expect(page.getByRole('heading', { level: 1, name: 'Your Dashboard' })).toBeVisible()
	})
})
