import { test, expect } from '@playwright/experimental-ct-react'
import { SubmitResetPasswordFormWrapper } from './SubmitResetPasswordForm.story'

test.describe('SubmitResetPasswordForm Component', () => {
	test('renders heading', async ({ mount, page }) => {
		await mount(<SubmitResetPasswordFormWrapper />)

		await expect(
			page.getByRole('heading', { name: 'Please enter your email to get confirmation code.' })
		).toBeVisible()
	})

	test('renders email input field', async ({ mount, page }) => {
		await mount(<SubmitResetPasswordFormWrapper />)

		const emailInput = page.locator('#email')
		await expect(emailInput).toBeVisible()
		await expect(emailInput).toHaveAttribute('type', 'email')
		await expect(emailInput).toHaveAttribute('required', '')
	})

	test('renders send code button', async ({ mount, page }) => {
		await mount(<SubmitResetPasswordFormWrapper />)

		await expect(page.getByRole('button', { name: /Send Code/ })).toBeVisible()
	})

	test('allows text input for email', async ({ mount, page }) => {
		await mount(<SubmitResetPasswordFormWrapper />)

		const emailInput = page.locator('#email')
		await emailInput.fill('test@example.com')
		await expect(emailInput).toHaveValue('test@example.com')
	})

	test('displays error message when showError is true', async ({ mount, page }) => {
		await mount(<SubmitResetPasswordFormWrapper showError={true} />)

		await expect(page.getByText('Email not found')).toBeVisible()
	})

	test('does not display error message by default', async ({ mount, page }) => {
		await mount(<SubmitResetPasswordFormWrapper showError={false} />)

		await expect(page.getByText('Email not found')).not.toBeVisible()
	})
})
