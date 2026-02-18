import { type ListEntry, OVERDUE_LIST } from '@/utils/api/lists'

/**
 * Computes the virtual "Overdue Tasks" list from a set of real lists.
 * Gathers all items across all lists where:
 *   - dueDate is set
 *   - dueDate is before today
 *   - item is not completed
 *
 * @param lists - Array of real list entries with their items
 * @returns A virtual ListEntry representing overdue tasks
 */
export function computeOverdueList(lists: ListEntry[]): ListEntry {
	const today = new Date()
	today.setHours(0, 0, 0, 0) // Compare against start of today

	const overdueItems = lists.flatMap((list) =>
		(list.items || []).filter(
			(item) => !item.completed && item.dueDate && new Date(item.dueDate) < today
		)
	)

	return {
		...OVERDUE_LIST,
		updatedAt: new Date().toISOString(),
		items: overdueItems
	}
}

/**
 * Injects the virtual overdue list into a list array.
 * The overdue list is always placed at the top.
 *
 * @param lists - Array of real list entries
 * @returns New array with the overdue list prepended
 */
export function injectOverdueList(lists: ListEntry[]): ListEntry[] {
	const overdueList = computeOverdueList(lists)
	return [overdueList, ...lists]
}
