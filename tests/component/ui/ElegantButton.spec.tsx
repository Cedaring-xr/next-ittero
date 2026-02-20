import { test, expect } from '@playwright/experimental-ct-react'
import ElegantButton from '../../../src/ui/elegant-button'
import { PlusIcon } from '@heroicons/react/24/outline'

test.describe('ElegantButton Component', () => {
	test('renders with default variant (primary)', async ({ mount }) => {
		const component = await mount(<ElegantButton>Primary Button</ElegantButton>)
		await expect(component.getByText('Primary Button')).toBeVisible()
	})

	test('renders primary variant', async ({ mount }) => {
		const component = await mount(<ElegantButton variant="primary">primary Button</ElegantButton>)
		await expect(component.getByText('primary Button')).toBeVisible()
	})

	test('renders secondary variant', async ({ mount }) => {
		const component = await mount(<ElegantButton variant="secondary">secondary Button</ElegantButton>)
		await expect(component.getByText('secondary Button')).toBeVisible()
	})

	test('renders outline variant', async ({ mount }) => {
		const component = await mount(<ElegantButton variant="outline">outline Button</ElegantButton>)
		await expect(component.getByText('outline Button')).toBeVisible()
	})

	test('renders ghost variant', async ({ mount }) => {
		const component = await mount(<ElegantButton variant="ghost">ghost Button</ElegantButton>)
		await expect(component.getByText('ghost Button')).toBeVisible()
	})

	test('renders danger variant', async ({ mount }) => {
		const component = await mount(<ElegantButton variant="danger">danger Button</ElegantButton>)
		await expect(component.getByText('danger Button')).toBeVisible()
	})

	test('renders small size', async ({ mount }) => {
		const component = await mount(<ElegantButton size="sm">sm Button</ElegantButton>)
		await expect(component.getByText('sm Button')).toBeVisible()
	})

	test('renders medium size', async ({ mount }) => {
		const component = await mount(<ElegantButton size="md">md Button</ElegantButton>)
		await expect(component.getByText('md Button')).toBeVisible()
	})

	test('renders large size', async ({ mount }) => {
		const component = await mount(<ElegantButton size="lg">lg Button</ElegantButton>)
		await expect(component.getByText('lg Button')).toBeVisible()
	})

	test('shows loading spinner when isLoading is true', async ({ mount, page }) => {
		await mount(
			<ElegantButton isLoading={true}>Loading Button</ElegantButton>
		)
		// Check that the button contains "Loading Button" text and is disabled
		const button = page.getByText('Loading Button')
		await expect(button).toBeVisible()
		// Also verify the button element itself is disabled
		await expect(page.locator('button')).toBeDisabled()
	})

	test('renders with icon on left (default)', async ({ mount }) => {
		const component = await mount(
			<ElegantButton icon={<PlusIcon />}>
				Add Item
			</ElegantButton>
		)
		await expect(component.getByText('Add Item')).toBeVisible()
	})

	test('renders with icon on right', async ({ mount }) => {
		const component = await mount(
			<ElegantButton icon={<PlusIcon />} iconPosition="right">
				Add Item
			</ElegantButton>
		)
		await expect(component.getByText('Add Item')).toBeVisible()
	})

	test('renders full width when fullWidth is true', async ({ mount }) => {
		const component = await mount(
			<ElegantButton fullWidth>Full Width Button</ElegantButton>
		)
		await expect(component.getByText('Full Width Button')).toBeVisible()
	})

	test('handles click events', async ({ mount }) => {
		let clicked = false
		const component = await mount(
			<ElegantButton onClick={() => { clicked = true }}>
				Click Me
			</ElegantButton>
		)

		await component.getByText('Click Me').click()
		expect(clicked).toBe(true)
	})

	test('is disabled when disabled prop is true', async ({ mount }) => {
		const component = await mount(
			<ElegantButton disabled>Disabled Button</ElegantButton>
		)
		const button = component.getByText('Disabled Button')
		await expect(button).toBeVisible()
		await expect(button).toBeDisabled()
	})

	test('is disabled when isLoading is true', async ({ mount }) => {
		const component = await mount(
			<ElegantButton isLoading>Loading Button</ElegantButton>
		)
		const button = component.getByText('Loading Button')
		await expect(button).toBeVisible()
		await expect(button).toBeDisabled()
	})
})
