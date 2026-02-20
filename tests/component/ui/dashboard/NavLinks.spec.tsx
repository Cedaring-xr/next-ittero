import { test, expect } from '@playwright/experimental-ct-react'
import NavLinks from '../../../../src/ui/dashboard/nav-links'

test.describe('NavLinks Component', () => {
	test('renders all five navigation links when not collapsed', async ({ mount, page }) => {
		await mount(<NavLinks isCollapsed={false} />)

		await expect(page.getByRole('link', { name: /Home/ })).toBeVisible()
		await expect(page.getByRole('link', { name: /Lists/ })).toBeVisible()
		await expect(page.getByRole('link', { name: /Journal/ })).toBeVisible()
		await expect(page.getByRole('link', { name: /Feedback/ })).toBeVisible()
		await expect(page.getByRole('link', { name: /Stats/ })).toBeVisible()
	})

	test('renders all navigation links when collapsed', async ({ mount, page }) => {
		await mount(<NavLinks isCollapsed={true} />)

		// Links should still be present - check by counting and hrefs
		const links = page.getByRole('link')
		await expect(links).toHaveCount(5)

		// Check all hrefs are present
		await expect(page.locator('a[href="/dashboard"]')).toBeVisible()
		await expect(page.locator('a[href="/dashboard/lists"]')).toBeVisible()
		await expect(page.locator('a[href="/dashboard/journal"]')).toBeVisible()
		await expect(page.locator('a[href="/dashboard/feedback"]')).toBeVisible()
		await expect(page.locator('a[href="/dashboard/stats"]')).toBeVisible()
	})

	test('Home link has correct href', async ({ mount, page }) => {
		await mount(<NavLinks isCollapsed={false} />)

		const homeLink = page.getByRole('link', { name: /Home/ })
		await expect(homeLink).toHaveAttribute('href', '/dashboard')
	})

	test('Lists link has correct href', async ({ mount, page }) => {
		await mount(<NavLinks isCollapsed={false} />)

		const listsLink = page.getByRole('link', { name: /Lists/ })
		await expect(listsLink).toHaveAttribute('href', '/dashboard/lists')
	})

	test('Journal link has correct href', async ({ mount, page }) => {
		await mount(<NavLinks isCollapsed={false} />)

		const journalLink = page.getByRole('link', { name: /Journal/ })
		await expect(journalLink).toHaveAttribute('href', '/dashboard/journal')
	})

	test('Feedback link has correct href', async ({ mount, page }) => {
		await mount(<NavLinks isCollapsed={false} />)

		const feedbackLink = page.getByRole('link', { name: /Feedback/ })
		await expect(feedbackLink).toHaveAttribute('href', '/dashboard/feedback')
	})

	test('Stats link has correct href', async ({ mount, page }) => {
		await mount(<NavLinks isCollapsed={false} />)

		const statsLink = page.getByRole('link', { name: /Stats/ })
		await expect(statsLink).toHaveAttribute('href', '/dashboard/stats')
	})
})
