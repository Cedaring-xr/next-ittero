import { test, expect } from '@playwright/experimental-ct-react'
import { Button } from '../../../src/ui/button'

test.describe('Button Component', () => {
	test('renders with children text', async ({ mount }) => {
		const component = await mount(<Button>Click Me</Button>)
		await expect(component.getByText('Click Me')).toBeVisible()
	})

	test('handles click events', async ({ mount }) => {
		let clicked = false
		const component = await mount(
			<Button onClick={() => { clicked = true }}>
				Click Me
			</Button>
		)

		const button = component.getByText('Click Me')
		await button.click()
		expect(clicked).toBe(true)
	})

	test('can be disabled', async ({ mount }) => {
		const component = await mount(<Button disabled>Disabled Button</Button>)
		const button = component.getByText('Disabled Button')
		await expect(button).toBeDisabled()
	})

	test('accepts custom className', async ({ mount }) => {
		const component = await mount(<Button className="custom-class">Styled Button</Button>)
		await expect(component.getByText('Styled Button')).toBeVisible()
	})
})
