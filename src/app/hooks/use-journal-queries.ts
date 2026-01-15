import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export interface JournalEntry {
	id: string
	user: string
	date: string // YYYY-MM-DD format
	text: string
	tag?: string
	createdAt?: string // ISO timestamp if available
}

export interface JournalStats {
	// Summary stats
	totalEntries: number
	entriesThisWeek: number
	entriesThisMonth: number
	currentStreak: number
	longestStreak: number
	averageEntriesPerWeek: number

	// Chart data
	entryTimesData: Array<{ date: string; time: number }>
	activityData: Array<{ date: string; hasEntry: boolean }>

	// Current month info
	currentMonth: string
	currentYear: number
	daysInMonth: number
}

// Fetch journal entries (for current month stats calculation)
export function useJournalEntries(options?: { limit?: number }) {
	const limit = options?.limit || 50 // Fetch enough for current month stats

	return useQuery({
		queryKey: ['journal-entries', limit],
		queryFn: async () => {
			const response = await fetch(`/api/journal?limit=${limit}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			})

			if (!response.ok) {
				throw new Error('Failed to fetch journal entries')
			}

			const data = await response.json()
			return (data.entries || []) as JournalEntry[]
		},
		staleTime: 5 * 60 * 1000 // Consider data fresh for 5 minutes
	})
}

// Fetch total journal entry count (lightweight endpoint)
export function useJournalCount() {
	return useQuery({
		queryKey: ['journal-count'],
		queryFn: async () => {
			const response = await fetch('/api/journal/count', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			})

			if (!response.ok) {
				throw new Error('Failed to fetch journal count')
			}

			const data = await response.json()
			return data.count as number
		},
		staleTime: 5 * 60 * 1000 // Consider data fresh for 5 minutes
	})
}

// Calculate journal statistics from entries
export function useJournalStats() {
	const { data: entries = [], isLoading: entriesLoading, error: entriesError } = useJournalEntries()
	const { data: totalCount = 0, isLoading: countLoading, error: countError } = useJournalCount()

	const isLoading = entriesLoading || countLoading
	const error = entriesError || countError

	const stats = useMemo(() => {
		const now = new Date()
		const currentYear = now.getFullYear()
		const currentMonth = now.getMonth() // 0-indexed
		const currentMonthName = now.toLocaleString('default', { month: 'long' })
		const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

		// Get start of current week (Sunday)
		const startOfWeek = new Date(now)
		startOfWeek.setDate(now.getDate() - now.getDay())
		startOfWeek.setHours(0, 0, 0, 0)

		// Get start of current month
		const startOfMonth = new Date(currentYear, currentMonth, 1)

		// Filter entries for current month
		const currentMonthEntries = entries.filter((entry) => {
			const entryDate = new Date(entry.date)
			return entryDate.getFullYear() === currentYear && entryDate.getMonth() === currentMonth
		})

		// Filter entries for current week
		const currentWeekEntries = entries.filter((entry) => {
			const entryDate = new Date(entry.date)
			return entryDate >= startOfWeek
		})

		// Calculate streaks
		const { currentStreak, longestStreak } = calculateStreaks(entries)

		// Calculate average entries per week (based on last 4 weeks)
		const fourWeeksAgo = new Date(now)
		fourWeeksAgo.setDate(now.getDate() - 28)
		const last4WeeksEntries = entries.filter((entry) => new Date(entry.date) >= fourWeeksAgo)
		const averageEntriesPerWeek = Math.round((last4WeeksEntries.length / 4) * 10) / 10

		// Generate entry times data for chart (current month)
		const entryTimesData = generateEntryTimesData(currentMonthEntries)

		// Generate activity data for heatmap (current month)
		const activityData = generateActivityData(currentMonthEntries, currentYear, currentMonth, daysInMonth)

		return {
			totalEntries: totalCount,
			entriesThisWeek: currentWeekEntries.length,
			entriesThisMonth: currentMonthEntries.length,
			currentStreak,
			longestStreak,
			averageEntriesPerWeek,
			entryTimesData,
			activityData,
			currentMonth: currentMonthName,
			currentYear,
			daysInMonth
		} as JournalStats
	}, [entries, totalCount])

	return {
		stats,
		entries,
		isLoading,
		error
	}
}

// Calculate current and longest streaks
function calculateStreaks(entries: JournalEntry[]): { currentStreak: number; longestStreak: number } {
	if (entries.length === 0) {
		return { currentStreak: 0, longestStreak: 0 }
	}

	// Get unique dates and sort them in descending order
	const uniqueDates = [...new Set(entries.map((e) => e.date))].sort(
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

// Generate entry times data for the line chart
function generateEntryTimesData(entries: JournalEntry[]): Array<{ date: string; time: number }> {
	// For now, since we don't have exact entry times, we'll use a placeholder
	// When createdAt timestamps are available, we can extract the actual time
	return entries
		.map((entry) => {
			const date = new Date(entry.date)
			const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`

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

// Generate activity data for the heatmap
function generateActivityData(
	entries: JournalEntry[],
	year: number,
	month: number,
	daysInMonth: number
): Array<{ date: string; hasEntry: boolean }> {
	// Create a set of dates that have entries
	const entryDates = new Set(
		entries.map((e) => {
			const date = new Date(e.date)
			return date.getDate()
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

// Format time value (0-24) to readable string
export function formatTime(value: number): string {
	const hours = Math.floor(value)
	const minutes = Math.round((value - hours) * 60)
	const period = hours >= 12 ? 'PM' : 'AM'
	const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
	return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}
