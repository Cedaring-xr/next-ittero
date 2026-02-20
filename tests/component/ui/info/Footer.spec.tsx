import { test, expect } from '@playwright/experimental-ct-react'
import Footer from '../../../../src/ui/info/footer'

test.describe('Footer Component', () => {
	test('renders Ittero branding', async ({ mount, page }) => {
		await mount(<Footer />)

		await expect(page.getByRole('heading', { name: 'Ittero' })).toBeVisible()
		await expect(page.getByText(/List, Iterate, Improve/)).toBeVisible()
	})

	test('displays version number', async ({ mount, page }) => {
		await mount(<Footer />)

		await expect(page.getByText('Version 1.02.1')).toBeVisible()
	})

	test('renders Quick Links section', async ({ mount, page }) => {
		await mount(<Footer />)

		await expect(page.getByRole('heading', { name: 'Quick Links' })).toBeVisible()
		await expect(page.getByRole('link', { name: 'Journal' })).toBeVisible()
		await expect(page.getByRole('link', { name: 'Lists' })).toBeVisible()
		await expect(page.getByRole('link', { name: 'FAQ' })).toBeVisible()
	})

	test('Quick Links have correct hrefs', async ({ mount, page }) => {
		await mount(<Footer />)

		const journalLink = page.getByRole('link', { name: 'Journal' })
		const listsLink = page.getByRole('link', { name: 'Lists' })
		const faqLink = page.getByRole('link', { name: 'FAQ' })

		await expect(journalLink).toHaveAttribute('href', '/dashboard/journal')
		await expect(listsLink).toHaveAttribute('href', '/dashboard/lists')
		await expect(faqLink).toHaveAttribute('href', '/faq')
	})

	test('renders Support section', async ({ mount, page }) => {
		await mount(<Footer />)

		await expect(page.getByRole('heading', { name: 'Support' })).toBeVisible()
		await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible()
		await expect(page.getByRole('link', { name: 'Terms of Service' })).toBeVisible()
		await expect(page.getByRole('link', { name: 'Contact Us' })).toBeVisible()
	})

	test('displays copyright with current year', async ({ mount, page }) => {
		await mount(<Footer />)

		const currentYear = new Date().getFullYear()
		await expect(page.getByText(`© ${currentYear} Ittero. All rights reserved.`)).toBeVisible()
	})

	test('renders social media links', async ({ mount, page }) => {
		await mount(<Footer />)

		await expect(page.getByRole('link', { name: 'Twitter' })).toBeVisible()
		await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible()
		await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible()
	})

	test('social media links have correct aria-labels', async ({ mount, page }) => {
		await mount(<Footer />)

		const twitterLink = page.getByRole('link', { name: 'Twitter' })
		const githubLink = page.getByRole('link', { name: 'GitHub' })
		const linkedinLink = page.getByRole('link', { name: 'LinkedIn' })

		await expect(twitterLink).toHaveAttribute('aria-label', 'Twitter')
		await expect(githubLink).toHaveAttribute('aria-label', 'GitHub')
		await expect(linkedinLink).toHaveAttribute('aria-label', 'LinkedIn')
	})
})
