import { test, expect } from '@playwright/experimental-ct-react'
import Banner from '../../../src/ui/info/banner'

test.describe('Banner Component', () => {
	test('renders with title and message', async ({ mount }) => {
		const component = await mount(
			<Banner
				title="Test Title"
				message="Test message content"
				color="teal-banner"
			/>
		)

		await expect(component.getByText('Test Title')).toBeVisible()
		await expect(component.getByText('Test message content')).toBeVisible()
	})

	test('can be dismissed by clicking close button', async ({ mount }) => {
		const component = await mount(
			<Banner
				title="Dismissible Banner"
				message="Click to close this banner"
				color="teal-banner"
			/>
		)

		// Banner should be visible initially
		await expect(component.getByText('Dismissible Banner')).toBeVisible()

		// Click the close button
		await component.locator('.close').click()

		// Banner content should no longer be visible
		await expect(component.getByText('Dismissible Banner')).not.toBeVisible()
	})

	test('renders with different color variants', async ({ mount }) => {
		const component = await mount(
			<Banner
				title="Colored Banner"
				message="This banner has a custom color"
				color="blue-banner"
			/>
		)

		await expect(component.getByText('Colored Banner')).toBeVisible()
		await expect(component.locator('.banner.blue-banner')).toBeVisible()
	})
})
