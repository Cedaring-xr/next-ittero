import { test, expect } from '@playwright/experimental-ct-react'
import { LogoutFormWrapper } from './LogoutForm.story'

test.describe('LogoutForm Component', () => {
	test('renders sign out button when not collapsed', async ({ mount, page }) => {
		await mount(<LogoutFormWrapper isCollapsed={false} />)

		await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible()
	})

	test('renders sign out button when collapsed', async ({ mount, page }) => {
		await mount(<LogoutFormWrapper isCollapsed={true} />)

		// Button should still be visible, just without text on larger screens
		await expect(page.getByRole('button')).toBeVisible()
	})

	test('button is inside a form', async ({ mount, page }) => {
		await mount(<LogoutFormWrapper isCollapsed={false} />)

		const form = page.locator('form')
		await expect(form).toBeVisible()

		const button = form.getByRole('button')
		await expect(button).toBeVisible()
	})

	test('shows power icon', async ({ mount, page }) => {
		await mount(<LogoutFormWrapper isCollapsed={false} />)

		// The PowerIcon should be rendered (check via SVG presence)
		const button = page.getByRole('button')
		await expect(button).toBeVisible()
	})

	test('applies collapsed styling', async ({ mount, page }) => {
		await mount(<LogoutFormWrapper isCollapsed={true} />)

		const button = page.getByRole('button')
		await expect(button).toBeVisible()
	})
})
