import { test, expect } from '@playwright/experimental-ct-react'
import ErrorAlert from '../../../src/ui/error-alert'

test.describe('ErrorAlert Component', () => {
	test('renders with error message', async ({ mount }) => {
		const component = await mount(
			<ErrorAlert
				message="Something went wrong"
				onClose={() => {}}
				autoDismiss={false}
			/>
		)
		await expect(component.getByText('Something went wrong')).toBeVisible()
	})

	test('calls onClose when close button clicked', async ({ mount }) => {
		let closed = false
		const component = await mount(
			<ErrorAlert
				message="Test error"
				onClose={() => { closed = true }}
				autoDismiss={false}
			/>
		)

		await component.getByRole('button', { name: 'Close' }).click()
		expect(closed).toBe(true)
	})

	test('auto-dismisses after delay when autoDismiss is true', async ({ mount, page }) => {
		let dismissed = false
		await mount(
			<ErrorAlert
				message="Auto dismiss test"
				onClose={() => { dismissed = true }}
				autoDismiss={true}
				autoDismissDelay={1000}
			/>
		)

		// Wait for auto-dismiss (1 second + buffer)
		await page.waitForTimeout(1200)
		expect(dismissed).toBe(true)
	})

	test('does not auto-dismiss when autoDismiss is false', async ({ mount, page }) => {
		let dismissed = false
		const component = await mount(
			<ErrorAlert
				message="No auto dismiss"
				onClose={() => { dismissed = true }}
				autoDismiss={false}
			/>
		)

		// Wait longer than default dismiss delay
		await page.waitForTimeout(2000)
		expect(dismissed).toBe(false)

		// Verify message still visible
		await expect(component.getByText('No auto dismiss')).toBeVisible()
	})
})
