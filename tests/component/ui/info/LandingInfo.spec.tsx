import { test, expect } from '@playwright/experimental-ct-react'
import LandingInfo from '../../../../src/ui/info/landing-info'

test.describe('LandingInfo Component', () => {
	test('renders main heading', async ({ mount, page }) => {
		await mount(<LandingInfo />)

		await expect(page.getByText('Simple but Powerful Productivity Tracking')).toBeVisible()
		await expect(page.getByText('Everything you need to stay organized and accomplish your goals')).toBeVisible()
	})

	test('renders all five features', async ({ mount, page }) => {
		await mount(<LandingInfo />)

		await expect(page.getByRole('heading', { name: 'Quick Journal' })).toBeVisible()
		await expect(page.getByRole('heading', { name: 'Categorized To-Do Lists' })).toBeVisible()
		await expect(page.getByRole('heading', { name: 'Item Tracking' })).toBeVisible()
		await expect(page.getByRole('heading', { name: 'Monthly Reports' })).toBeVisible()
		await expect(page.getByRole('heading', { name: 'Secure & Private' })).toBeVisible()
	})

	test('renders Quick Journal feature with description', async ({ mount, page }) => {
		await mount(<LandingInfo />)

		await expect(page.getByRole('heading', { name: 'Quick Journal' })).toBeVisible()
		await expect(page.getByText(/A personal daily quick journal designed to be fast/)).toBeVisible()
	})

	test('renders Categorized To-Do Lists feature with description', async ({ mount, page }) => {
		await mount(<LandingInfo />)

		await expect(page.getByText('Categorized To-Do Lists')).toBeVisible()
		await expect(page.getByText(/A to-do list broken out into categories/)).toBeVisible()
	})

	test('renders Item Tracking feature with description', async ({ mount, page }) => {
		await mount(<LandingInfo />)

		await expect(page.getByText('Item Tracking')).toBeVisible()
		await expect(page.getByText(/When items are completed they are not deleted forever/)).toBeVisible()
	})

	test('renders Monthly Reports feature with description', async ({ mount, page }) => {
		await mount(<LandingInfo />)

		await expect(page.getByText('Monthly Reports')).toBeVisible()
		await expect(page.getByText(/Detailed feedback on how to improve/)).toBeVisible()
	})

	test('renders Secure & Private feature with description', async ({ mount, page }) => {
		await mount(<LandingInfo />)

		await expect(page.getByText('Secure & Private')).toBeVisible()
		await expect(page.getByText(/Fully encrypted user data ensure/)).toBeVisible()
	})
})
