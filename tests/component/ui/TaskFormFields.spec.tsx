import { test, expect } from '@playwright/experimental-ct-react'
import { TaskFormWrapper } from './TaskFormFields.story'

test.describe('TaskFormFields Component', () => {
	test('renders all form fields', async ({ mount, page }) => {
		await mount(<TaskFormWrapper />)

		await expect(page.locator('#taskText')).toBeVisible()
		await expect(page.locator('#dueDate')).toBeVisible()
		await expect(page.locator('#dueTime')).toBeVisible()
		await expect(page.getByText('Priority')).toBeVisible()
	})

	test('allows text input for task', async ({ mount, page }) => {
		await mount(<TaskFormWrapper />)
		const taskInput = page.locator('#taskText')

		await taskInput.fill('Buy groceries')
		await expect(taskInput).toHaveValue('Buy groceries')
	})

	test('allows selecting due date', async ({ mount, page }) => {
		await mount(<TaskFormWrapper />)
		const dateInput = page.locator('#dueDate')

		await dateInput.fill('2024-12-31')
		await expect(dateInput).toHaveValue('2024-12-31')
	})

	test('disables time input when no date selected', async ({ mount, page }) => {
		await mount(<TaskFormWrapper />)
		const timeInput = page.locator('#dueTime')

		await expect(timeInput).toBeDisabled()
	})

	test('enables time input when date is selected', async ({ mount, page }) => {
		await mount(<TaskFormWrapper />)
		const dateInput = page.locator('#dueDate')
		const timeInput = page.locator('#dueTime')

		await dateInput.fill('2024-12-31')
		await expect(timeInput).toBeEnabled()
	})

	test('shows helper text for time input when no date selected', async ({ mount, page }) => {
		await mount(<TaskFormWrapper />)
		await expect(page.getByText('Select a due date first')).toBeVisible()
	})

	test('allows selecting priority', async ({ mount, page }) => {
		await mount(<TaskFormWrapper />)

		// Click on the urgent priority option (use force because label might intercept)
		const urgentOption = page.getByRole('radio', { name: 'urgent' })
		await urgentOption.click({ force: true })
		await expect(urgentOption).toBeChecked()
	})

	test('renders all priority options', async ({ mount, page }) => {
		await mount(<TaskFormWrapper />)

		const priorities = ['urgent', 'high', 'medium', 'low', 'none']
		for (const priority of priorities) {
			await expect(page.getByRole('radio', { name: priority })).toBeVisible()
		}
	})

	test('has none priority selected by default', async ({ mount, page }) => {
		await mount(<TaskFormWrapper />)
		const noneOption = page.getByRole('radio', { name: 'none' })
		await expect(noneOption).toBeChecked()
	})
})
