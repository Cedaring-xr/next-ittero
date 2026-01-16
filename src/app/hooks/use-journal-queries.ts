import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
	type JournalEntry,
	calculateStreaks,
	generateEntryTimesData,
	generateActivityData,
	filterEntriesForCurrentMonth,
	filterEntriesForCurrentWeek
} from '@/utils/helpers/stat-function'

// Re-export JournalEntry for consumers of this hook
export type { JournalEntry }

// Re-export formatTime for consumers
export { formatTime } from '@/utils/helpers/stat-function'

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

		// Filter entries for current month and week using shared helpers
		const currentMonthEntries = filterEntriesForCurrentMonth(entries, currentYear, currentMonth)
		const currentWeekEntries = filterEntriesForCurrentWeek(entries, startOfWeek)

		// Calculate streaks using shared helper
		const { currentStreak, longestStreak } = calculateStreaks(entries)

		// Calculate average entries per week (based on last 4 weeks)
		const fourWeeksAgo = new Date(now)
		fourWeeksAgo.setDate(now.getDate() - 28)
		const last4WeeksEntries = entries.filter((entry) => new Date(entry.date) >= fourWeeksAgo)
		const averageEntriesPerWeek = Math.round((last4WeeksEntries.length / 4) * 10) / 10

		// Generate chart data using shared helpers
		const entryTimesData = generateEntryTimesData(currentMonthEntries)
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
