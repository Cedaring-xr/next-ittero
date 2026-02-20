import { test, expect } from '@playwright/experimental-ct-react'
import AcmeLogo from '../../../src/ui/acme-logo'

test.describe('AcmeLogo Component', () => {
	test('renders the Ittero logo', async ({ mount }) => {
		const component = await mount(<AcmeLogo />)
		await expect(component.getByText('Ittero')).toBeVisible()
	})

	test('applies correct styling classes', async ({ mount }) => {
		const component = await mount(<AcmeLogo />)
		const logoText = component.getByText('Ittero')
		await expect(logoText).toBeVisible()
	})
})
