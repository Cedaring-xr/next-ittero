import { test, expect } from '@playwright/experimental-ct-react'
import { ConfirmResetPasswordFormWrapper } from './ConfirmResetPasswordForm.story'

test.describe('ConfirmResetPasswordForm Component', () => {
	test('renders heading', async ({ mount, page }) => {
		await mount(<ConfirmResetPasswordFormWrapper />)

		await expect(page.getByRole('heading', { name: 'Reset password.' })).toBeVisible()
	})

	test('renders email input field', async ({ mount, page }) => {
		await mount(<ConfirmResetPasswordFormWrapper />)

		const emailInput = page.locator('#email')
		await expect(emailInput).toBeVisible()
		await expect(emailInput).toHaveAttribute('type', 'email')
		await expect(emailInput).toHaveAttribute('required', '')
	})

	test('renders new password input field', async ({ mount, page }) => {
		await mount(<ConfirmResetPasswordFormWrapper />)

		const passwordInput = page.locator('#password')
		await expect(passwordInput).toBeVisible()
		await expect(passwordInput).toHaveAttribute('type', 'password')
		await expect(passwordInput).toHaveAttribute('required', '')
		await expect(passwordInput).toHaveAttribute('minLength', '6')
	})

	test('renders confirmation code input field', async ({ mount, page }) => {
		await mount(<ConfirmResetPasswordFormWrapper />)

		const codeInput = page.locator('#code')
		await expect(codeInput).toBeVisible()
		await expect(codeInput).toHaveAttribute('type', 'text')
		await expect(codeInput).toHaveAttribute('required', '')
		await expect(codeInput).toHaveAttribute('minLength', '6')
	})

	test('renders reset password button', async ({ mount, page }) => {
		await mount(<ConfirmResetPasswordFormWrapper />)

		await expect(page.getByRole('button', { name: /Reset Password/ })).toBeVisible()
	})

	test('allows text input for all fields', async ({ mount, page }) => {
		await mount(<ConfirmResetPasswordFormWrapper />)

		const emailInput = page.locator('#email')
		const passwordInput = page.locator('#password')
		const codeInput = page.locator('#code')

		await emailInput.fill('test@example.com')
		await passwordInput.fill('newpassword123')
		await codeInput.fill('123456')

		await expect(emailInput).toHaveValue('test@example.com')
		await expect(passwordInput).toHaveValue('newpassword123')
		await expect(codeInput).toHaveValue('123456')
	})

	test('displays error message when showError is true', async ({ mount, page }) => {
		await mount(<ConfirmResetPasswordFormWrapper showError={true} />)

		await expect(page.getByText('Invalid code or password')).toBeVisible()
	})

	test('does not display error message by default', async ({ mount, page }) => {
		await mount(<ConfirmResetPasswordFormWrapper showError={false} />)

		await expect(page.getByText('Invalid code or password')).not.toBeVisible()
	})
})
