/**
 * Shared journal statistics calculation functions
 * Used by both the app (use-journal-queries.ts) and tests (journalStats.spec.ts)
 */

export interface JournalEntry {
	id: string
	user: string
	date: string // YYYY-MM-DD format
	text: string
	tag?: string
	createdAt?: string // ISO timestamp if available
}

export interface StreakResult {
	currentStreak: number
	longestStreak: number
}

export interface EntryTimeData {
	date: string
	time: number
}

export interface ActivityData {
	date: string
	hasEntry: boolean
}

/**
 * Calculate current and longest streaks from journal entries
 * Current streak: consecutive days ending today or yesterday
 * Longest streak: longest run of consecutive days
 */
export function calculateStreaks(entries: JournalEntry[]): StreakResult {
	if (entries.length === 0) {
		return { currentStreak: 0, longestStreak: 0 }
	}

	// Get unique dates and sort them in descending order
	const uniqueDates = Array.from(new Set(entries.map((e) => e.date))).sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime()
	)

	// Calculate current streak (consecutive days ending today or yesterday)
	let currentStreak = 0
	const today = new Date()
	today.setHours(0, 0, 0, 0)

	const yesterday = new Date(today)
	yesterday.setDate(today.getDate() - 1)

	// Check if the most recent entry is today or yesterday
	if (uniqueDates.length > 0) {
		const mostRecentDate = new Date(uniqueDates[0])
		mostRecentDate.setHours(0, 0, 0, 0)

		if (mostRecentDate.getTime() === today.getTime() || mostRecentDate.getTime() === yesterday.getTime()) {
			currentStreak = 1
			let expectedDate = new Date(mostRecentDate)
			expectedDate.setDate(expectedDate.getDate() - 1)

			for (let i = 1; i < uniqueDates.length; i++) {
				const entryDate = new Date(uniqueDates[i])
				entryDate.setHours(0, 0, 0, 0)

				if (entryDate.getTime() === expectedDate.getTime()) {
					currentStreak++
					expectedDate.setDate(expectedDate.getDate() - 1)
				} else {
					break
				}
			}
		}
	}

	// Calculate longest streak
	let longestStreak = 0
	let tempStreak = 1

	// Sort dates in ascending order for longest streak calculation
	const ascendingDates = [...uniqueDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

	for (let i = 1; i < ascendingDates.length; i++) {
		const prevDate = new Date(ascendingDates[i - 1])
		const currDate = new Date(ascendingDates[i])

		// Check if dates are consecutive
		const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

		if (diffDays === 1) {
			tempStreak++
		} else {
			longestStreak = Math.max(longestStreak, tempStreak)
			tempStreak = 1
		}
	}
	longestStreak = Math.max(longestStreak, tempStreak)

	return { currentStreak, longestStreak }
}

/**
 * Generate entry times data for the line chart
 * Uses UTC methods because date strings like "2026-01-15" are parsed as UTC midnight
 */
export function generateEntryTimesData(entries: JournalEntry[]): EntryTimeData[] {
	return entries
		.map((entry) => {
			const date = new Date(entry.date)
			const formattedDate = `${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCDate().toString().padStart(2, '0')}`

			// If createdAt exists, extract the hour; otherwise use a default
			let time = 12 // Default to noon
			if (entry.createdAt) {
				const createdDate = new Date(entry.createdAt)
				time = createdDate.getHours() + createdDate.getMinutes() / 60
			}

			return { date: formattedDate, time }
		})
		.sort((a, b) => {
			// Sort by date string (MM/DD format)
			return a.date.localeCompare(b.date)
		})
}

/**
 * Generate activity data for the heatmap
 * Uses getUTCDate() because date strings like "2026-01-15" are parsed as UTC midnight
 */
export function generateActivityData(
	entries: JournalEntry[],
	_year: number,
	month: number,
	daysInMonth: number
): ActivityData[] {
	// Create a set of dates that have entries
	const entryDates = new Set(
		entries.map((e) => {
			const date = new Date(e.date)
			return date.getUTCDate()
		})
	)

	// Generate activity for each day of the month
	return Array.from({ length: daysInMonth }, (_, i) => {
		const day = i + 1
		const formattedDate = `${(month + 1).toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`
		return {
			date: formattedDate,
			hasEntry: entryDates.has(day)
		}
	})
}

/**
 * Format time value (0-24) to readable string (e.g., "2:30 PM")
 */
export function formatTime(value: number): string {
	const hours = Math.floor(value)
	const minutes = Math.round((value - hours) * 60)
	const period = hours >= 12 ? 'PM' : 'AM'
	const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
	return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

/**
 * Filter entries for the current month
 * Uses UTC methods for consistency with date parsing
 */
export function filterEntriesForCurrentMonth(entries: JournalEntry[], year: number, month: number): JournalEntry[] {
	return entries.filter((entry) => {
		const entryDate = new Date(entry.date)
		return entryDate.getUTCFullYear() === year && entryDate.getUTCMonth() === month
	})
}

/**
 * Filter entries for the current week (starting Sunday)
 */
export function filterEntriesForCurrentWeek(entries: JournalEntry[], startOfWeek: Date): JournalEntry[] {
	return entries.filter((entry) => {
		const entryDate = new Date(entry.date)
		return entryDate >= startOfWeek
	})
}

/**
 * Get unique activity days (day numbers) for entries in the current month
 */
export function getActivityDaysForMonth(entries: JournalEntry[], year: number, month: number): number[] {
	const currentMonthEntries = filterEntriesForCurrentMonth(entries, year, month)
	const activityDays = currentMonthEntries.map((entry) => {
		const date = new Date(entry.date)
		return date.getUTCDate()
	})
	return Array.from(new Set(activityDays)).sort((a, b) => a - b)
}
