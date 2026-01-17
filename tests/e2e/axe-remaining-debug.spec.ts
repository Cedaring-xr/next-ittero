import { test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.use({ storageState: 'tests/.auth/user.json' })

const url = process.env.BASE_URL as string

const pages = [
	{ name: 'Journal', path: '/dashboard/journal' },
	{ name: 'New Journal', path: '/dashboard/journal/newJournal' },
	{ name: 'Stats', path: '/dashboard/stats' },
	{ name: 'New List', path: '/dashboard/lists/newList' },
]

for (const p of pages) {
	test(`debug ${p.name}`, async ({ page }) => {
		await page.goto(`${url}${p.path}`)
		await page.waitForLoadState('networkidle')

		const results = await new AxeBuilder({ page })
			.options({ resultTypes: ['violations'] })
			.analyze()

		const serious = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical')
		
		if (serious.length > 0) {
			console.log(`\n=== ${p.name} VIOLATIONS ===`)
			for (const v of serious) {
				console.log(`[${v.impact}] ${v.id}:`)
				for (const node of v.nodes) {
					console.log('  HTML:', node.html.substring(0, 100))
					console.log('  Fix:', node.failureSummary?.split('\n')[1])
				}
			}
		}
	})
}
