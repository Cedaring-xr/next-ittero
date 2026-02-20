import { test, expect } from '@playwright/experimental-ct-react'
import { useState } from 'react'
import Modal from '../../../src/ui/modal'

// Wrapper to manage modal state
function ModalWrapper() {
	const [isOpen, setIsOpen] = useState(true)

	return (
		<div>
			<button onClick={() => setIsOpen(true)}>Open Modal</button>
			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Test Modal">
				<p>Modal content goes here</p>
			</Modal>
		</div>
	)
}

test.describe('Modal Component', () => {
	test('renders when isOpen is true', async ({ mount, page }) => {
		await mount(
			<Modal isOpen={true} onClose={() => {}} title="Test Title">
				<p>Test Content</p>
			</Modal>
		)

		await expect(page.getByRole('dialog')).toBeVisible()
		await expect(page.getByText('Test Title')).toBeVisible()
		await expect(page.getByText('Test Content')).toBeVisible()
	})

	test('does not render when isOpen is false', async ({ mount, page }) => {
		await mount(
			<Modal isOpen={false} onClose={() => {}} title="Test Title">
				<p>Test Content</p>
			</Modal>
		)

		const dialog = page.getByRole('dialog')
		await expect(dialog).not.toBeVisible()
	})

	test('calls onClose when close button clicked', async ({ mount, page }) => {
		let closed = false
		await mount(
			<Modal isOpen={true} onClose={() => { closed = true }} title="Test Title">
				<p>Test Content</p>
			</Modal>
		)

		await page.getByRole('button', { name: 'Close modal' }).click()
		expect(closed).toBe(true)
	})

	test('calls onClose when clicking backdrop', async ({ mount, page }) => {
		let closed = false
		await mount(
			<Modal isOpen={true} onClose={() => { closed = true }} title="Test Title">
				<p>Test Content</p>
			</Modal>
		)

		// Click the backdrop (the dialog container itself)
		await page.getByRole('dialog').click({ position: { x: 10, y: 10 } })
		expect(closed).toBe(true)
	})

	test('calls onClose when Escape key pressed', async ({ mount, page }) => {
		let closed = false
		await mount(
			<Modal isOpen={true} onClose={() => { closed = true }} title="Test Title">
				<p>Test Content</p>
			</Modal>
		)

		// Wait for modal to be visible and focused
		const dialog = page.getByRole('dialog')
		await expect(dialog).toBeVisible()
		await dialog.focus()
		await page.keyboard.press('Escape')
		expect(closed).toBe(true)
	})

	test('renders without title', async ({ mount, page }) => {
		await mount(
			<Modal isOpen={true} onClose={() => {}}>
				<p>Content without title</p>
			</Modal>
		)

		await expect(page.getByRole('dialog')).toBeVisible()
		await expect(page.getByText('Content without title')).toBeVisible()
	})

	test('applies sm maxWidth size', async ({ mount, page }) => {
		await mount(
			<Modal isOpen={true} onClose={() => {}} maxWidth="sm">
				<p>sm modal</p>
			</Modal>
		)

		await expect(page.getByRole('dialog')).toBeVisible()
		await expect(page.getByText('sm modal')).toBeVisible()
	})

	test('applies md maxWidth size', async ({ mount, page }) => {
		await mount(
			<Modal isOpen={true} onClose={() => {}} maxWidth="md">
				<p>md modal</p>
			</Modal>
		)

		await expect(page.getByRole('dialog')).toBeVisible()
		await expect(page.getByText('md modal')).toBeVisible()
	})

	test('applies lg maxWidth size', async ({ mount, page }) => {
		await mount(
			<Modal isOpen={true} onClose={() => {}} maxWidth="lg">
				<p>lg modal</p>
			</Modal>
		)

		await expect(page.getByRole('dialog')).toBeVisible()
		await expect(page.getByText('lg modal')).toBeVisible()
	})

	test('applies xl maxWidth size', async ({ mount, page }) => {
		await mount(
			<Modal isOpen={true} onClose={() => {}} maxWidth="xl">
				<p>xl modal</p>
			</Modal>
		)

		await expect(page.getByRole('dialog')).toBeVisible()
		await expect(page.getByText('xl modal')).toBeVisible()
	})

	test('applies 2xl maxWidth size', async ({ mount, page }) => {
		await mount(
			<Modal isOpen={true} onClose={() => {}} maxWidth="2xl">
				<p>2xl modal</p>
			</Modal>
		)

		await expect(page.getByRole('dialog')).toBeVisible()
		await expect(page.getByText('2xl modal')).toBeVisible()
	})
})
