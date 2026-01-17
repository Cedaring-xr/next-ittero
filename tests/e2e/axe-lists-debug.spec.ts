import { test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.use({ storageState: 'tests/.auth/user.json' })

const url = process.env.BASE_URL as string

test('debug lists page contrast', async ({ page }) => {
	await page.goto(`${url}/dashboard/lists`)
	await page.waitForLoadState('networkidle')
	await page.waitForTimeout(1000)

	const results = await new AxeBuilder({ page }).analyze()

	for (const v of results.violations.filter(v => v.id === 'color-contrast')) {
		console.log('\n=== COLOR CONTRAST VIOLATION ===')
		for (const node of v.nodes) {
			console.log('Element HTML:', node.html)
			console.log('Target:', node.target)
			console.log('Failure Summary:', node.failureSummary)
		}
	}
})
