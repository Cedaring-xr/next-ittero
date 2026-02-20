import { test, expect } from '@playwright/experimental-ct-react'
import { SignupFormWrapper } from './SignupForm.story'

test.describe('SignupForm Component', () => {
	test('renders heading', async ({ mount, page }) => {
		await mount(<SignupFormWrapper />)

		await expect(page.getByRole('heading', { name: 'Please create an account.' })).toBeVisible()
	})

	test('renders name input field', async ({ mount, page }) => {
		await mount(<SignupFormWrapper />)

		const nameInput = page.locator('#name')
		await expect(nameInput).toBeVisible()
		await expect(nameInput).toHaveAttribute('type', 'text')
		await expect(nameInput).toHaveAttribute('required', '')
		await expect(nameInput).toHaveAttribute('minLength', '4')
	})

	test('renders email input field', async ({ mount, page }) => {
		await mount(<SignupFormWrapper />)

		const emailInput = page.locator('#email')
		await expect(emailInput).toBeVisible()
		await expect(emailInput).toHaveAttribute('type', 'email')
		await expect(emailInput).toHaveAttribute('required', '')
	})

	test('renders password input field', async ({ mount, page }) => {
		await mount(<SignupFormWrapper />)

		const passwordInput = page.locator('#password')
		await expect(passwordInput).toBeVisible()
		await expect(passwordInput).toHaveAttribute('type', 'password')
		await expect(passwordInput).toHaveAttribute('required', '')
		await expect(passwordInput).toHaveAttribute('minLength', '6')
	})

	test('renders create account button', async ({ mount, page }) => {
		await mount(<SignupFormWrapper />)

		await expect(page.getByRole('button', { name: /Create account/ })).toBeVisible()
	})

	test('renders log in link', async ({ mount, page }) => {
		await mount(<SignupFormWrapper />)

		const loginLink = page.getByRole('link', { name: /Log in/ })
		await expect(loginLink).toBeVisible()
		await expect(loginLink).toHaveAttribute('href', '/auth/login')
	})

	test('allows text input for all fields', async ({ mount, page }) => {
		await mount(<SignupFormWrapper />)

		const nameInput = page.locator('#name')
		const emailInput = page.locator('#email')
		const passwordInput = page.locator('#password')

		await nameInput.fill('Test User')
		await emailInput.fill('test@example.com')
		await passwordInput.fill('password123')

		await expect(nameInput).toHaveValue('Test User')
		await expect(emailInput).toHaveValue('test@example.com')
		await expect(passwordInput).toHaveValue('password123')
	})

	test('displays error message when showError is true', async ({ mount, page }) => {
		await mount(<SignupFormWrapper showError={true} />)

		await expect(page.getByText('Email already exists')).toBeVisible()
	})

	test('does not display error message by default', async ({ mount, page }) => {
		await mount(<SignupFormWrapper showError={false} />)

		await expect(page.getByText('Email already exists')).not.toBeVisible()
	})
})
