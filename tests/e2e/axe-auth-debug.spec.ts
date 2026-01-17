import { test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.use({ storageState: { cookies: [], origins: [] } })

const url = process.env.BASE_URL as string

test('debug login form', async ({ page }) => {
	await page.goto(`${url}/auth/login`)
	await page.waitForLoadState('networkidle')
	
	// Submit to trigger error state
	await page.getByRole('button', { name: /log in/i }).click()
	await page.waitForTimeout(500)

	const results = await new AxeBuilder({ page }).analyze()
	const serious = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical')
	
	for (const v of serious) {
		console.log(`\n[${v.impact}] ${v.id}: ${v.description}`)
		for (const node of v.nodes) {
			console.log('  HTML:', node.html.substring(0, 120))
			console.log('  Fix:', node.failureSummary?.split('\n')[1])
		}
	}
})
