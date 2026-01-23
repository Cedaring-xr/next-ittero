import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
	calculateStreaks,
	generateEntryTimesData,
	generateActivityData,
	formatTime,
	filterEntriesForCurrentMonth,
	filterEntriesForCurrentWeek,
	getActivityDaysForMonth,
	type JournalEntry
} from '@/utils/helpers/stat-function'

describe('stat-function', () => {
	describe('calculateStreaks', () => {
		beforeEach(() => {
			// Mock current date to 2026-01-22 at noon local time
			vi.useFakeTimers()
			const localDate = new Date('2026-01-22')
			localDate.setHours(12, 0, 0, 0)
			vi.setSystemTime(localDate)
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('should return zero streaks for empty entries', () => {
			const result = calculateStreaks([])
			expect(result).toEqual({ currentStreak: 0, longestStreak: 0 })
		})

		it('should calculate current streak ending today', () => {
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-01-22', text: 'Entry 1' },
				{ id: '2', user: 'user1', date: '2026-01-21', text: 'Entry 2' },
				{ id: '3', user: 'user1', date: '2026-01-20', text: 'Entry 3' }
			]
			const result = calculateStreaks(entries)
			expect(result.currentStreak).toBe(3)
			expect(result.longestStreak).toBe(3)
		})

		it('should calculate current streak ending yesterday', () => {
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-01-21', text: 'Entry 1' },
				{ id: '2', user: 'user1', date: '2026-01-20', text: 'Entry 2' },
				{ id: '3', user: 'user1', date: '2026-01-19', text: 'Entry 3' }
			]
			const result = calculateStreaks(entries)
			expect(result.currentStreak).toBe(3)
			expect(result.longestStreak).toBe(3)
		})

		it('should not count current streak if last entry is older than yesterday', () => {
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-01-19', text: 'Entry 1' },
				{ id: '2', user: 'user1', date: '2026-01-18', text: 'Entry 2' },
				{ id: '3', user: 'user1', date: '2026-01-17', text: 'Entry 3' }
			]
			const result = calculateStreaks(entries)
			expect(result.currentStreak).toBe(0)
			expect(result.longestStreak).toBe(3)
		})

		it('should calculate longest streak correctly when different from current', () => {
			const entries: JournalEntry[] = [
				// Current streak: 2 days
				{ id: '1', user: 'user1', date: '2026-01-22', text: 'Entry 1' },
				{ id: '2', user: 'user1', date: '2026-01-21', text: 'Entry 2' },
				// Gap
				// Longest streak: 4 days
				{ id: '3', user: 'user1', date: '2026-01-15', text: 'Entry 3' },
				{ id: '4', user: 'user1', date: '2026-01-14', text: 'Entry 4' },
				{ id: '5', user: 'user1', date: '2026-01-13', text: 'Entry 5' },
				{ id: '6', user: 'user1', date: '2026-01-12', text: 'Entry 6' }
			]
			const result = calculateStreaks(entries)
			expect(result.currentStreak).toBe(2)
			expect(result.longestStreak).toBe(4)
		})

		it('should handle multiple entries on the same day', () => {
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-01-22', text: 'Entry 1' },
				{ id: '2', user: 'user1', date: '2026-01-22', text: 'Entry 2' },
				{ id: '3', user: 'user1', date: '2026-01-21', text: 'Entry 3' }
			]
			const result = calculateStreaks(entries)
			expect(result.currentStreak).toBe(2)
			expect(result.longestStreak).toBe(2)
		})
	})

	describe('generateEntryTimesData', () => {
		it('should generate entry times with default noon time when no createdAt', () => {
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-01-15', text: 'Entry 1' },
				{ id: '2', user: 'user1', date: '2026-01-16', text: 'Entry 2' }
			]
			const result = generateEntryTimesData(entries)

			expect(result).toHaveLength(2)
			expect(result[0]).toEqual({ date: '01/15', time: 12 })
			expect(result[1]).toEqual({ date: '01/16', time: 12 })
		})

		it('should extract time from createdAt timestamp', () => {
			// Use local time instead of UTC to avoid timezone conversion issues
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-01-15', text: 'Entry 1', createdAt: '2026-01-15T14:30:00' }
			]
			const result = generateEntryTimesData(entries)

			expect(result[0].date).toBe('01/15')
			// Time should be 14.5 hours (14:30)
			expect(result[0].time).toBeCloseTo(14.5, 1)
		})

		it('should sort entries by date', () => {
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-01-20', text: 'Entry 1' },
				{ id: '2', user: 'user1', date: '2026-01-15', text: 'Entry 2' },
				{ id: '3', user: 'user1', date: '2026-01-18', text: 'Entry 3' }
			]
			const result = generateEntryTimesData(entries)

			expect(result[0].date).toBe('01/15')
			expect(result[1].date).toBe('01/18')
			expect(result[2].date).toBe('01/20')
		})
	})

	describe('generateActivityData', () => {
		it('should generate activity data for each day of the month', () => {
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-01-15', text: 'Entry 1' },
				{ id: '2', user: 'user1', date: '2026-01-20', text: 'Entry 2' }
			]
			const result = generateActivityData(entries, 2026, 0, 31) // January 2026

			expect(result).toHaveLength(31)
			expect(result[14]).toEqual({ date: '01/15', hasEntry: true }) // Index 14 = day 15
			expect(result[19]).toEqual({ date: '01/20', hasEntry: true }) // Index 19 = day 20
			expect(result[0]).toEqual({ date: '01/01', hasEntry: false })
		})

		it('should handle months with different number of days', () => {
			const entries: JournalEntry[] = []
			const result = generateActivityData(entries, 2026, 1, 28) // February 2026

			expect(result).toHaveLength(28)
			expect(result[27]).toEqual({ date: '02/28', hasEntry: false })
		})

		it('should mark days without entries as hasEntry: false', () => {
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-01-01', text: 'Entry 1' }
			]
			const result = generateActivityData(entries, 2026, 0, 31)

			expect(result[0].hasEntry).toBe(true)
			expect(result[1].hasEntry).toBe(false)
			expect(result[30].hasEntry).toBe(false)
		})
	})

	describe('formatTime', () => {
		it('should format morning times correctly', () => {
			expect(formatTime(0)).toBe('12:00 AM')
			expect(formatTime(6)).toBe('6:00 AM')
			expect(formatTime(11.5)).toBe('11:30 AM')
		})

		it('should format afternoon/evening times correctly', () => {
			expect(formatTime(12)).toBe('12:00 PM')
			expect(formatTime(14.25)).toBe('2:15 PM')
			expect(formatTime(18.75)).toBe('6:45 PM')
			expect(formatTime(23.5)).toBe('11:30 PM')
		})

		it('should handle fractional hours', () => {
			expect(formatTime(9.5)).toBe('9:30 AM')
			expect(formatTime(15.25)).toBe('3:15 PM')
			expect(formatTime(20.75)).toBe('8:45 PM')
		})
	})

	describe('filterEntriesForCurrentMonth', () => {
		it('should filter entries for the specified month and year', () => {
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-01-15', text: 'Entry 1' },
				{ id: '2', user: 'user1', date: '2026-02-10', text: 'Entry 2' },
				{ id: '3', user: 'user1', date: '2026-01-25', text: 'Entry 3' },
				{ id: '4', user: 'user1', date: '2025-01-15', text: 'Entry 4' }
			]
			const result = filterEntriesForCurrentMonth(entries, 2026, 0) // January 2026

			expect(result).toHaveLength(2)
			expect(result[0].id).toBe('1')
			expect(result[1].id).toBe('3')
		})

		it('should return empty array when no entries match', () => {
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-02-15', text: 'Entry 1' }
			]
			const result = filterEntriesForCurrentMonth(entries, 2026, 0)

			expect(result).toHaveLength(0)
		})
	})

	describe('filterEntriesForCurrentWeek', () => {
		it('should filter entries on or after the start of week', () => {
			const startOfWeek = new Date('2026-01-18T00:00:00Z') // Sunday
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-01-17', text: 'Entry 1' },
				{ id: '2', user: 'user1', date: '2026-01-18', text: 'Entry 2' },
				{ id: '3', user: 'user1', date: '2026-01-20', text: 'Entry 3' }
			]
			const result = filterEntriesForCurrentWeek(entries, startOfWeek)

			expect(result).toHaveLength(2)
			expect(result[0].id).toBe('2')
			expect(result[1].id).toBe('3')
		})
	})

	describe('getActivityDaysForMonth', () => {
		it('should return sorted unique day numbers for the month', () => {
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-01-15', text: 'Entry 1' },
				{ id: '2', user: 'user1', date: '2026-01-15', text: 'Entry 2' }, // Duplicate day
				{ id: '3', user: 'user1', date: '2026-01-20', text: 'Entry 3' },
				{ id: '4', user: 'user1', date: '2026-01-05', text: 'Entry 4' },
				{ id: '5', user: 'user1', date: '2026-02-10', text: 'Entry 5' } // Different month
			]
			const result = getActivityDaysForMonth(entries, 2026, 0)

			expect(result).toEqual([5, 15, 20])
		})

		it('should return empty array when no entries in month', () => {
			const entries: JournalEntry[] = [
				{ id: '1', user: 'user1', date: '2026-02-15', text: 'Entry 1' }
			]
			const result = getActivityDaysForMonth(entries, 2026, 0)

			expect(result).toHaveLength(0)
		})
	})
})
