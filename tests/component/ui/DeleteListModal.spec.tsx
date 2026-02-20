import { test, expect } from '@playwright/experimental-ct-react'
import DeleteListModal from '../../../src/ui/delete-list-modal'

test.describe('DeleteListModal Component', () => {
	test('renders with item count', async ({ mount, page }) => {
		await mount(
			<DeleteListModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => {}}
				itemCount={5}
			/>
		)

		await expect(page.getByRole('heading', { name: 'Delete List' })).toBeVisible()
		await expect(page.getByText(/This list contains.*5.*tasks/)).toBeVisible()
	})

	test('shows singular "task" for itemCount of 1', async ({ mount, page }) => {
		await mount(
			<DeleteListModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => {}}
				itemCount={1}
			/>
		)

		await expect(page.getByText(/This list contains.*1.*task/)).toBeVisible()
	})

	test('shows two delete options', async ({ mount, page }) => {
		await mount(
			<DeleteListModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => {}}
				itemCount={5}
			/>
		)

		await expect(page.getByText('Delete List and All Tasks')).toBeVisible()
		await expect(page.getByText(/Move Tasks to "Unassigned Tasks"/)).toBeVisible()
	})

	test('calls onConfirm with cascade mode when first option clicked', async ({ mount, page }) => {
		let mode: 'cascade' | 'reassign' | null = null
		await mount(
			<DeleteListModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={(m) => { mode = m }}
				itemCount={5}
			/>
		)

		await page.getByText('Delete List and All Tasks').click()
		expect(mode).toBe('cascade')
	})

	test('calls onConfirm with reassign mode when second option clicked', async ({ mount, page }) => {
		let mode: 'cascade' | 'reassign' | null = null
		await mount(
			<DeleteListModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={(m) => { mode = m }}
				itemCount={5}
			/>
		)

		await page.getByText(/Move Tasks to "Unassigned Tasks"/).click()
		expect(mode).toBe('reassign')
	})

	test('calls onClose when Cancel button clicked', async ({ mount, page }) => {
		let closed = false
		await mount(
			<DeleteListModal
				isOpen={true}
				onClose={() => { closed = true }}
				onConfirm={() => {}}
				itemCount={5}
			/>
		)

		await page.getByRole('button', { name: 'Cancel' }).click()
		expect(closed).toBe(true)
	})

	test('disables buttons when isLoading', async ({ mount, page }) => {
		await mount(
			<DeleteListModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => {}}
				itemCount={5}
				isLoading={true}
			/>
		)

		await expect(page.getByRole('button', { name: 'Cancel' })).toBeDisabled()
	})

	test('does not render when isOpen is false', async ({ mount, page }) => {
		await mount(
			<DeleteListModal
				isOpen={false}
				onClose={() => {}}
				onConfirm={() => {}}
				itemCount={5}
			/>
		)

		const dialog = page.getByRole('dialog')
		await expect(dialog).not.toBeVisible()
	})

	test('shows DEFAULT badge on cascade option', async ({ mount, page }) => {
		await mount(
			<DeleteListModal
				isOpen={true}
				onClose={() => {}}
				onConfirm={() => {}}
				itemCount={5}
			/>
		)

		await expect(page.getByText('DEFAULT')).toBeVisible()
	})
})
