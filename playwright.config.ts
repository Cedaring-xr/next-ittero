import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '.env.local') })

export default defineConfig({
	testDir: './tests',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 0 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL:process.env.BASE_URL,

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry'
	},

	projects: [
		// Setup project - authenticates both admin and regular user
		{
			name: 'setup',
			testMatch: /auth\.setup\.ts/,
			use: { ...devices['Desktop Chrome'] }
		},

		// Admin user tests - use admin auth state
		{
			name: 'chromium-admin',
			use: {
				...devices['Desktop Chrome'],
				storageState: 'tests/.auth/admin.json'
			},
			dependencies: ['setup'],
			testMatch: /.*admin.*\.spec\.ts/
		},
		{
			name: 'firefox-admin',
			use: {
				...devices['Desktop Firefox'],
				storageState: 'tests/.auth/admin.json'
			},
			dependencies: ['setup'],
			testMatch: /.*admin.*\.spec\.ts/
		},

		// Regular user tests - use user auth state
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				storageState: 'tests/.auth/user.json'
			},
			dependencies: ['setup'],
			testIgnore: /.*admin.*\.spec\.ts/
		},
		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox'],
				storageState: 'tests/.auth/user.json'
			},
			dependencies: ['setup'],
			testIgnore: /.*admin.*\.spec\.ts/
		}
	]
})
