import { defineConfig, devices } from '@playwright/experimental-ct-react'

/**
 * Playwright Component Testing Configuration
 * Run with: npm run test:component
 */
export default defineConfig({
	testDir: './tests/component',
	snapshotDir: './tests/component/__snapshots__',
	timeout: 10 * 1000,
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? 'html' : 'list',
	use: {
		trace: 'on-first-retry',
		ctPort: 3100,
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
	],
})
