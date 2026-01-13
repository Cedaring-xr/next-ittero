import { test, expect } from '@playwright/experimental-ct-react'
import LoadingSpinner from '../../../src/ui/loading-spinner'

test.describe('LoadingSpinner Component', () => {
	test('renders with default size', async ({ mount }) => {
		const component = await mount(<LoadingSpinner />)

		await expect(component).toBeVisible()
	})

	test('renders with custom text', async ({ mount }) => {
		const component = await mount(
			<LoadingSpinner text="Loading your data..." />
		)

		await expect(component.getByText('Loading your data...')).toBeVisible()
	})

	test('renders with large size', async ({ mount }) => {
		const component = await mount(
			<LoadingSpinner size="lg" text="Please wait..." />
		)

		await expect(component.getByText('Please wait...')).toBeVisible()
	})
})
