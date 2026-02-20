import { test, expect } from '@playwright/experimental-ct-react'
import { ConfirmSignupFormWrapper } from './ConfirmSignupForm.story'

test.describe('ConfirmSignupForm Component', () => {
	test('renders heading', async ({ mount, page }) => {
		await mount(<ConfirmSignupFormWrapper />)

		await expect(page.getByRole('heading', { name: 'Please confirm your account.' })).toBeVisible()
	})

	test('renders email input field', async ({ mount, page }) => {
		await mount(<ConfirmSignupFormWrapper />)

		const emailInput = page.locator('#email')
		await expect(emailInput).toBeVisible()
		await expect(emailInput).toHaveAttribute('type', 'email')
		await expect(emailInput).toHaveAttribute('required', '')
	})

	test('renders code input field', async ({ mount, page }) => {
		await mount(<ConfirmSignupFormWrapper />)

		const codeInput = page.locator('#code')
		await expect(codeInput).toBeVisible()
		await expect(codeInput).toHaveAttribute('type', 'text')
		await expect(codeInput).toHaveAttribute('required', '')
		await expect(codeInput).toHaveAttribute('minLength', '6')
	})

	test('renders confirm button', async ({ mount, page }) => {
		await mount(<ConfirmSignupFormWrapper />)

		await expect(page.getByRole('button', { name: /Confirm/ })).toBeVisible()
	})

	test('allows text input for all fields', async ({ mount, page }) => {
		await mount(<ConfirmSignupFormWrapper />)

		const emailInput = page.locator('#email')
		const codeInput = page.locator('#code')

		await emailInput.fill('test@example.com')
		await codeInput.fill('123456')

		await expect(emailInput).toHaveValue('test@example.com')
		await expect(codeInput).toHaveValue('123456')
	})

	test('displays error message when showError is true', async ({ mount, page }) => {
		await mount(<ConfirmSignupFormWrapper showError={true} />)

		await expect(page.getByText('Invalid code')).toBeVisible()
	})

	test('does not display error message by default', async ({ mount, page }) => {
		await mount(<ConfirmSignupFormWrapper showError={false} />)

		await expect(page.getByText('Invalid code')).not.toBeVisible()
	})
})
