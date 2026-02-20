import { test, expect } from '@playwright/experimental-ct-react'
import Pagination from '../../../src/ui/pagination'

test.describe('Pagination Component', () => {
	test('shows current count', async ({ mount }) => {
		const component = await mount(
			<Pagination
				hasMore={true}
				loading={false}
				onLoadMore={() => {}}
				currentCount={10}
			/>
		)
		await expect(component.getByText('Showing 10 entries')).toBeVisible()
	})

	test('shows Load More button when hasMore is true', async ({ mount }) => {
		const component = await mount(
			<Pagination
				hasMore={true}
				loading={false}
				onLoadMore={() => {}}
				currentCount={10}
			/>
		)
		await expect(component.getByText('Load More')).toBeVisible()
	})

	test('hides Load More button when hasMore is false', async ({ mount }) => {
		const component = await mount(
			<Pagination
				hasMore={false}
				loading={false}
				onLoadMore={() => {}}
				currentCount={10}
			/>
		)
		const button = component.getByText('Load More')
		await expect(button).not.toBeVisible()
	})

	test('shows Loading... text when loading', async ({ mount }) => {
		const component = await mount(
			<Pagination
				hasMore={true}
				loading={true}
				onLoadMore={() => {}}
				currentCount={10}
			/>
		)
		await expect(component.getByText('Loading...')).toBeVisible()
	})

	test('disables button when loading', async ({ mount }) => {
		const component = await mount(
			<Pagination
				hasMore={true}
				loading={true}
				onLoadMore={() => {}}
				currentCount={10}
			/>
		)
		await expect(component.getByText('Loading...')).toBeDisabled()
	})

	test('calls onLoadMore when button clicked', async ({ mount }) => {
		let called = false
		const component = await mount(
			<Pagination
				hasMore={true}
				loading={false}
				onLoadMore={() => { called = true }}
				currentCount={10}
			/>
		)

		await component.getByText('Load More').click()
		expect(called).toBe(true)
	})

	test('uses custom button text', async ({ mount }) => {
		const component = await mount(
			<Pagination
				hasMore={true}
				loading={false}
				onLoadMore={() => {}}
				currentCount={10}
				buttonText="Show More"
			/>
		)
		await expect(component.getByText('Show More')).toBeVisible()
	})

	test('renders nothing when no items and no more to load', async ({ mount }) => {
		const component = await mount(
			<Pagination
				hasMore={false}
				loading={false}
				onLoadMore={() => {}}
				currentCount={0}
			/>
		)
		// Component should render nothing - check that text is not present
		const text = component.getByText('Showing 0 entries')
		await expect(text).not.toBeVisible()
	})
})
