import { test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const url = process.env.BASE_URL as string

test('debug axe violations', async ({ page }) => {
	await page.goto(`${url}/`)
	await page.waitForLoadState('networkidle')

	const results = await new AxeBuilder({ page }).analyze()

	for (const v of results.violations) {
		console.log('\n=== VIOLATION:', v.id, '===')
		console.log('Impact:', v.impact)
		console.log('Description:', v.description)
		console.log('Help:', v.help)
		console.log('Help URL:', v.helpUrl)
		for (const node of v.nodes) {
			console.log('\nElement HTML:', node.html)
			console.log('Target:', node.target)
			console.log('Failure Summary:', node.failureSummary)
		}
	}
})
