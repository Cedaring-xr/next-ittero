import { test, expect } from '@playwright/experimental-ct-react'
import ConfirmModal from '../../../src/ui/confirm-modal'

test.describe('ConfirmModal Component', () => {
	test('renders with default props', async ({ mount, page }) => {
		await mount(
			<ConfirmModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => {}}
				message="Are you sure?"
			/>
		)

		await expect(page.getByRole('heading', { name: 'Confirm Action' })).toBeVisible()
		await expect(page.getByText('Are you sure?')).toBeVisible()
		await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible()
		await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible()
	})

	test('renders with custom title and button text', async ({ mount, page }) => {
		await mount(
			<ConfirmModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => {}}
				title="Delete Item"
				message="This will permanently delete the item"
				confirmText="Delete"
				cancelText="Keep It"
			/>
		)

		await expect(page.getByRole('heading', { name: 'Delete Item' })).toBeVisible()
		await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible()
		await expect(page.getByRole('button', { name: 'Keep It' })).toBeVisible()
	})

	test('calls onConfirm when confirm button clicked', async ({ mount, page }) => {
		let confirmed = false
		await mount(
			<ConfirmModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => { confirmed = true }}
				message="Confirm action?"
			/>
		)

		await page.getByRole('button', { name: 'Confirm' }).click()
		expect(confirmed).toBe(true)
	})

	test('calls onClose when cancel button clicked', async ({ mount, page }) => {
		let closed = false
		await mount(
			<ConfirmModal
				isOpen={true}
				onClose={() => { closed = true }}
				onConfirm={() => {}}
				message="Confirm action?"
			/>
		)

		await page.getByRole('button', { name: 'Cancel' }).click()
		expect(closed).toBe(true)
	})

	test('shows danger variant style', async ({ mount, page }) => {
		await mount(
			<ConfirmModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => {}}
				message="danger message"
				variant="danger"
			/>
		)

		await expect(page.getByText('danger message')).toBeVisible()
	})

	test('shows warning variant style', async ({ mount, page }) => {
		await mount(
			<ConfirmModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => {}}
				message="warning message"
				variant="warning"
			/>
		)

		await expect(page.getByText('warning message')).toBeVisible()
	})

	test('shows info variant style', async ({ mount, page }) => {
		await mount(
			<ConfirmModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => {}}
				message="info message"
				variant="info"
			/>
		)

		await expect(page.getByText('info message')).toBeVisible()
	})

	test('shows Processing... text when isLoading', async ({ mount, page }) => {
		await mount(
			<ConfirmModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => {}}
				message="Test message"
				isLoading={true}
			/>
		)

		await expect(page.getByRole('button', { name: 'Processing...' })).toBeVisible()
	})

	test('disables buttons when isLoading', async ({ mount, page }) => {
		await mount(
			<ConfirmModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => {}}
				message="Test message"
				isLoading={true}
			/>
		)

		await expect(page.getByRole('button', { name: 'Processing...' })).toBeDisabled()
		await expect(page.getByRole('button', { name: 'Cancel' })).toBeDisabled()
	})

	test('does not render when isOpen is false', async ({ mount, page }) => {
		await mount(
			<ConfirmModal
				isOpen={false}
				onClose={() => {}}
				onConfirm={() => {}}
				message="Test message"
			/>
		)

		const dialog = page.getByRole('dialog')
		await expect(dialog).not.toBeVisible()
	})
})
