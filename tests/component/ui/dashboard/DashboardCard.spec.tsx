import { test, expect } from '@playwright/experimental-ct-react'
import DashboardCard from '../../../../src/ui/dashboard/dashboard-card'
import { BookOpenIcon } from '@heroicons/react/24/outline'

test.describe('DashboardCard Component', () => {
	test('renders with all props', async ({ mount, page }) => {
		await mount(
			<DashboardCard
				href="/dashboard/journal"
				imageSrc="/hero-desktop.png"
				title="Journal"
				icon={<BookOpenIcon />}
				alt="Journal image"
				iconColor="text-blue-500"
				glowColor="hover:shadow-blue-500/50"
			/>
		)

		await expect(page.getByRole('link')).toBeVisible()
		await expect(page.getByRole('heading', { name: 'Journal' })).toBeVisible()
	})

	test('link has correct href', async ({ mount, page }) => {
		await mount(
			<DashboardCard
				href="/dashboard/lists"
				imageSrc="/hero-desktop.png"
				title="Lists"
				icon={<BookOpenIcon />}
				alt="Lists image"
				iconColor="text-green-500"
				glowColor="hover:shadow-green-500/50"
			/>
		)

		const link = page.getByRole('link')
		await expect(link).toHaveAttribute('href', '/dashboard/lists')
	})

	test('displays title text', async ({ mount, page }) => {
		await mount(
			<DashboardCard
				href="/dashboard/stats"
				imageSrc="/hero-desktop.png"
				title="Statistics"
				icon={<BookOpenIcon />}
				alt="Stats image"
				iconColor="text-purple-500"
				glowColor="hover:shadow-purple-500/50"
			/>
		)

		await expect(page.getByRole('heading', { name: 'Statistics' })).toBeVisible()
	})

	test('image has correct alt text', async ({ mount, page }) => {
		await mount(
			<DashboardCard
				href="/dashboard/journal"
				imageSrc="/hero-desktop.png"
				title="Journal"
				icon={<BookOpenIcon />}
				alt="Journal dashboard image"
				iconColor="text-blue-500"
				glowColor="hover:shadow-blue-500/50"
			/>
		)

		const image = page.getByRole('img', { name: 'Journal dashboard image' })
		await expect(image).toBeVisible()
	})
})
