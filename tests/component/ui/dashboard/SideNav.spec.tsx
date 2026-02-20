import { test, expect } from '@playwright/experimental-ct-react'
import { SideNavWrapper } from './SideNav.story'

test.describe('SideNav Component', () => {
	test('renders logo when not collapsed', async ({ mount, page }) => {
		await mount(<SideNavWrapper />)

		await expect(page.getByRole('link', { name: /Ittero/i })).toBeVisible()
	})

	test('renders collapse button', async ({ mount, page }) => {
		await mount(<SideNavWrapper />)

		const collapseBtn = page.getByTestId('sidebar-collapse-btn')
		await expect(collapseBtn).toBeVisible()
	})

	test('renders profile link', async ({ mount, page }) => {
		await mount(<SideNavWrapper />)

		const profileBtn = page.getByTestId('sidebar-profile-btn')
		await expect(profileBtn).toBeVisible()
	})

	test('profile link has correct href', async ({ mount, page }) => {
		await mount(<SideNavWrapper />)

		const profileBtn = page.getByTestId('sidebar-profile-btn')
		await expect(profileBtn).toHaveAttribute('href', '/dashboard/profile')
	})

	test('renders navigation element with aria-label', async ({ mount, page }) => {
		await mount(<SideNavWrapper />)

		const nav = page.getByRole('navigation', { name: 'main navigation' })
		await expect(nav).toBeVisible()
	})

	test('does not show admin link when isAdmin is false', async ({ mount, page }) => {
		await mount(<SideNavWrapper isAdmin={false} />)

		const adminBtn = page.getByTestId('sidebar-admin-btn')
		await expect(adminBtn).not.toBeVisible()
	})

	test('shows admin link when isAdmin is true', async ({ mount, page }) => {
		await mount(<SideNavWrapper isAdmin={true} />)

		const adminBtn = page.getByTestId('sidebar-admin-btn')
		await expect(adminBtn).toBeVisible()
	})

	test('admin link has correct href', async ({ mount, page }) => {
		await mount(<SideNavWrapper isAdmin={true} />)

		const adminBtn = page.getByTestId('sidebar-admin-btn')
		await expect(adminBtn).toHaveAttribute('href', '/dashboard/admins')
	})

	test('does not show pinned lists when list is empty', async ({ mount, page }) => {
		await mount(<SideNavWrapper pinnedLists={[]} />)

		const pinnedSection = page.getByTestId('sidebar-pinned-lists')
		await expect(pinnedSection).not.toBeVisible()
	})

	test('shows pinned lists when provided', async ({ mount, page }) => {
		const pinnedLists = [
			{ id: '1', title: 'Work Tasks', isSystem: false, isVirtual: false },
			{ id: '2', title: 'Personal', isSystem: false, isVirtual: false }
		]

		await mount(<SideNavWrapper pinnedLists={pinnedLists} />)

		const pinnedSection = page.getByTestId('sidebar-pinned-lists')
		await expect(pinnedSection).toBeVisible()
		await expect(page.getByText('Work Tasks')).toBeVisible()
		await expect(page.getByText('Personal')).toBeVisible()
	})

	test('displays pinned lists count', async ({ mount, page }) => {
		const pinnedLists = [
			{ id: '1', title: 'Work Tasks', isSystem: false, isVirtual: false },
			{ id: '2', title: 'Personal', isSystem: false, isVirtual: false },
			{ id: '3', title: 'Shopping', isSystem: false, isVirtual: false }
		]

		await mount(<SideNavWrapper pinnedLists={pinnedLists} />)

		await expect(page.getByText('3/7')).toBeVisible()
	})
})
