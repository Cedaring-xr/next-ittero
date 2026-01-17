import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import {
	type JournalEntry,
	calculateStreaks,
	filterEntriesForCurrentMonth,
	filterEntriesForCurrentWeek,
	getActivityDaysForMonth
} from '../../../src/utils/helpers/stat-function'

/**
 * Journal Stats Tests
 * Fetches data from API, saves outputs, and compares to stats page UI
 * Uses the same calculation functions as the app for consistency
 */

interface ApiTestOutput {
	timestamp: string
	totalCount: number
	entries: JournalEntry[]
	calculatedStats: {
		entriesThisMonth: number
		entriesThisWeek: number
		currentStreak: number
		activityDays: number[]
	}
}

// Directory for saving API outputs
const OUTPUT_DIR = 'tests/e2e/stats/outputs'

// Helper to ensure output directory exists
function ensureOutputDir() {
	const dir = path.resolve(OUTPUT_DIR)
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}
	return dir
}

// Helper to save API output to file
function saveApiOutput(filename: string, data: ApiTestOutput) {
	const dir = ensureOutputDir()
	const filepath = path.join(dir, filename)
	fs.writeFileSync(filepath, JSON.stringify(data, null, 2))
	return filepath
}

// Calculate stats from entries using shared utility functions
function calculateStatsFromEntries(entries: JournalEntry[], totalCount: number) {
	const now = new Date()
	const currentYear = now.getFullYear()
	const currentMonth = now.getMonth()

	// Get start of current week (Sunday)
	const startOfWeek = new Date(now)
	startOfWeek.setDate(now.getDate() - now.getDay())
	startOfWeek.setHours(0, 0, 0, 0)

	// Use shared utility functions
	const currentMonthEntries = filterEntriesForCurrentMonth(entries, currentYear, currentMonth)
	const currentWeekEntries = filterEntriesForCurrentWeek(entries, startOfWeek)
	const { currentStreak } = calculateStreaks(entries)
	const activityDays = getActivityDaysForMonth(entries, currentYear, currentMonth)

	return {
		totalEntries: totalCount,
		entriesThisMonth: currentMonthEntries.length,
		entriesThisWeek: currentWeekEntries.length,
		currentStreak,
		activityDays
	}
}

test.describe('Journal Stats - API to UI Comparison', () => {
	test.skip('[STATS-001] @smoke API data should match stats page display', async ({ request, page }) => {
		// Step 1: Fetch data from APIs
		const [entriesResponse, countResponse] = await Promise.all([
			request.get('/api/journal?limit=50'),
			request.get('/api/journal/count')
		])

		expect(entriesResponse.ok()).toBeTruthy()
		expect(countResponse.ok()).toBeTruthy()

		const entriesData = await entriesResponse.json()
		const countData = await countResponse.json()

		const entries: JournalEntry[] = entriesData.entries || []
		const totalCount: number = countData.count

		// Step 2: Calculate expected stats from API data
		const calculatedStats = calculateStatsFromEntries(entries, totalCount)

		// Step 3: Save API output for reference
		const output: ApiTestOutput = {
			timestamp: new Date().toISOString(),
			totalCount,
			entries,
			calculatedStats
		}
		const outputPath = saveApiOutput(`journal-stats-${Date.now()}.json`, output)
		console.log(`API output saved to: ${outputPath}`)

		// Step 4: Navigate to stats page and wait for data to load
		await page.goto('/dashboard/stats')

		// Wait for the journal stats section to be visible
		await expect(page.getByText('Journal Entry Statistics')).toBeVisible()

		// Wait for loading to complete (spinner should disappear)
		await expect(page.locator('.animate-spin').first()).not.toBeVisible({ timeout: 10000 })

		// Step 5: Extract displayed values from UI
		// Get the stat values by finding the number associated with each label
		const thisMonthValue = await page
			.locator('div')
			.filter({ hasText: /^This Month$/ })
			.locator('p.text-3xl')
			.first()
			.textContent()

		const thisWeekValue = await page
			.locator('div')
			.filter({ hasText: /^This Week$/ })
			.locator('p.text-3xl')
			.first()
			.textContent()

		const dayStreakValue = await page
			.locator('div')
			.filter({ hasText: /^Day Streak$/ })
			.locator('p.text-3xl')
			.first()
			.textContent()

		const totalEntriesValue = await page
			.locator('div')
			.filter({ hasText: /^Total Entries$/ })
			.locator('p.text-3xl')
			.first()
			.textContent()

		// Step 6: Compare API-calculated stats with UI values
		console.log('Calculated stats from API:', calculatedStats)
		console.log('UI values:', {
			thisMonth: thisMonthValue,
			thisWeek: thisWeekValue,
			dayStreak: dayStreakValue,
			totalEntries: totalEntriesValue
		})

		expect(parseInt(thisMonthValue || '0')).toBe(calculatedStats.entriesThisMonth)
		expect(parseInt(thisWeekValue || '0')).toBe(calculatedStats.entriesThisWeek)
		expect(parseInt(dayStreakValue || '0')).toBe(calculatedStats.currentStreak)
		expect(parseInt(totalEntriesValue || '0')).toBe(calculatedStats.totalEntries)
	})

	test.skip('[STATS-002] Activity chart should highlight correct days', async ({ request, page }) => {
		// Fetch entries from API
		const entriesResponse = await request.get('/api/journal?limit=50')
		expect(entriesResponse.ok()).toBeTruthy()

		const entriesData = await entriesResponse.json()
		const entries: JournalEntry[] = entriesData.entries || []

		// Calculate which days should have entries this month using shared utility
		const now = new Date()
		const currentYear = now.getFullYear()
		const currentMonth = now.getMonth()
		const uniqueDays = getActivityDaysForMonth(entries, currentYear, currentMonth)

		console.log(`Days with entries this month: ${uniqueDays.join(', ')}`)

		// Navigate to stats page
		await page.goto('/dashboard/stats')
		await expect(page.getByText('Journal Entry Statistics')).toBeVisible()
		await expect(page.locator('.animate-spin').first()).not.toBeVisible({ timeout: 10000 })

		// Check activity chart - days with entries should have purple background
		for (const day of uniqueDays) {
			// Find the activity box for this day
			const dayBox = page
				.locator('div')
				.filter({ hasText: new RegExp(`^${day}$`) })
				.locator('div.bg-purple-500')
				.first()

			await expect(dayBox).toBeVisible({
				timeout: 5000
			})
		}
	})

	test.skip('[STATS-003] should save API response for debugging', async ({ request }) => {
		// Fetch both API endpoints
		const [entriesResponse, countResponse] = await Promise.all([
			request.get('/api/journal?limit=100'),
			request.get('/api/journal/count')
		])

		const entriesData = await entriesResponse.json()
		const countData = await countResponse.json()

		// Calculate stats using shared utilities
		const calculatedStats = calculateStatsFromEntries(entriesData.entries || [], countData.count)

		// Save comprehensive output
		const output: ApiTestOutput = {
			timestamp: new Date().toISOString(),
			totalCount: countData.count,
			entries: entriesData.entries || [],
			calculatedStats
		}

		const filename = `api-snapshot-${new Date().toISOString().split('T')[0]}.json`
		const outputPath = saveApiOutput(filename, output)

		console.log(`Full API snapshot saved to: ${outputPath}`)
		console.log(`Total entries in system: ${countData.count}`)
		console.log(`Entries fetched: ${(entriesData.entries || []).length}`)
		console.log(`Entries this month: ${calculatedStats.entriesThisMonth}`)
		console.log(`Entries this week: ${calculatedStats.entriesThisWeek}`)
		console.log(`Current streak: ${calculatedStats.currentStreak}`)
		console.log(`Activity days this month: ${calculatedStats.activityDays.join(', ')}`)

		// Basic assertions
		expect(entriesResponse.ok()).toBeTruthy()
		expect(countResponse.ok()).toBeTruthy()
		expect(countData.count).toBeGreaterThanOrEqual(0)
	})
})

test.describe('Journal Stats - Edge Cases', () => {
	test.skip('[STATS-004] should handle user with no journal entries', async ({ request, page }) => {
		// This test documents expected behavior when there are no entries
		// The actual count will depend on the test user's data

		const countResponse = await request.get('/api/journal/count')
		const countData = await countResponse.json()

		await page.goto('/dashboard/stats')
		await expect(page.getByText('Journal Entry Statistics')).toBeVisible()

		// If user has no entries, stats should show zeros
		if (countData.count === 0) {
			const totalEntriesValue = await page
				.locator('div')
				.filter({ hasText: /^Total Entries$/ })
				.locator('p.text-3xl')
				.first()
				.textContent()

			expect(parseInt(totalEntriesValue || '0')).toBe(0)
		}
	})
})
