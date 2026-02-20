import { test, expect } from '@playwright/experimental-ct-react'
import { LoginFormWrapper } from './LoginForm.story'

test.describe('LoginForm Component', () => {
	test('renders heading', async ({ mount, page }) => {
		await mount(<LoginFormWrapper />)

		await expect(page.getByRole('heading', { name: 'Please sign in to continue.' })).toBeVisible()
	})

	test('renders email input field', async ({ mount, page }) => {
		await mount(<LoginFormWrapper />)

		const emailInput = page.locator('#email')
		await expect(emailInput).toBeVisible()
		await expect(emailInput).toHaveAttribute('type', 'email')
		await expect(emailInput).toHaveAttribute('required', '')
	})

	test('renders password input field', async ({ mount, page }) => {
		await mount(<LoginFormWrapper />)

		const passwordInput = page.locator('#password')
		await expect(passwordInput).toBeVisible()
		await expect(passwordInput).toHaveAttribute('type', 'password')
		await expect(passwordInput).toHaveAttribute('required', '')
		await expect(passwordInput).toHaveAttribute('minLength', '6')
	})

	test('renders log in button', async ({ mount, page }) => {
		await mount(<LoginFormWrapper />)

		await expect(page.getByRole('button', { name: /Log in/ })).toBeVisible()
	})

	test('renders forgot password link', async ({ mount, page }) => {
		await mount(<LoginFormWrapper />)

		const forgotLink = page.getByRole('link', { name: /Forgot password/ })
		await expect(forgotLink).toBeVisible()
		await expect(forgotLink).toHaveAttribute('href', '/auth/reset-password/submit')
	})

	test('renders sign up link', async ({ mount, page }) => {
		await mount(<LoginFormWrapper />)

		const signupLink = page.getByRole('link', { name: /Sign up/ })
		await expect(signupLink).toBeVisible()
		await expect(signupLink).toHaveAttribute('href', '/auth/signup')
	})

	test('allows text input for email', async ({ mount, page }) => {
		await mount(<LoginFormWrapper />)

		const emailInput = page.locator('#email')
		await emailInput.fill('test@example.com')
		await expect(emailInput).toHaveValue('test@example.com')
	})

	test('allows text input for password', async ({ mount, page }) => {
		await mount(<LoginFormWrapper />)

		const passwordInput = page.locator('#password')
		await passwordInput.fill('password123')
		await expect(passwordInput).toHaveValue('password123')
	})

	test('displays error message when showError is true', async ({ mount, page }) => {
		await mount(<LoginFormWrapper showError={true} />)

		await expect(page.getByText('Invalid credentials')).toBeVisible()
	})

	test('does not display error message by default', async ({ mount, page }) => {
		await mount(<LoginFormWrapper showError={false} />)

		await expect(page.getByText('Invalid credentials')).not.toBeVisible()
	})
})
