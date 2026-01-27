/**
 * API utility functions for lists and list items
 */

type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

export interface TodoItem {
	id: string
	text: string
	listId: string
	priority: Priority
	dueDate: string
	completed: boolean
	createdAt: string
	updatedAt: string
}

export interface ListEntry {
	id: string
	title: string
	description: string
	category: string
	tags: string[]
	archived: boolean
	pinned?: boolean
	createdAt: string
	updatedAt: string
	items?: TodoItem[]
}

/**
 * Fetches all lists for the authenticated user
 * @returns Promise resolving to an array of list entries
 * @throws Error if the fetch fails
 */
export async function fetchLists(): Promise<ListEntry[]> {
	const response = await fetch('/api/lists', {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.error || 'Failed to fetch lists')
	}

	return data.lists || []
}

/**
 * Fetches all items for a specific list
 * @param listId - The ID of the list to fetch items for
 * @returns Promise resolving to an array of todo items
 * @throws Error if the fetch fails
 */
export async function fetchListItems(listId: string): Promise<TodoItem[]> {
	const response = await fetch(`/api/lists/items?listId=${listId}`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.error || 'Failed to fetch list items')
	}

	return data.items || []
}

/**
 * Fetches all lists with their items populated
 * @returns Promise resolving to an array of list entries with items
 * @throws Error if the fetch fails
 */
export async function fetchListsWithItems(): Promise<ListEntry[]> {
	const lists = await fetchLists()

	// Fetch items for each list
	const listsWithItems = await Promise.all(
		lists.map(async (list) => {
			try {
				const items = await fetchListItems(list.id)
				return { ...list, items }
			} catch (err) {
				console.error(`Error fetching items for list ${list.id}:`, err)
				return { ...list, items: [] }
			}
		})
	)

	return listsWithItems
}

/**
 * Creates a new list
 * @param listData - The data for the new list
 * @returns Promise resolving to the created list data
 * @throws Error if the creation fails
 */
export async function createList(listData: {
	title: string
	description: string
	category: string
	tags: string[]
}): Promise<any> {
	const response = await fetch('/api/lists', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(listData)
	})

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.error || 'Failed to create list')
	}

	return data
}

/**
 * Creates a new todo item
 * @param itemData - The data for the new todo item
 * @returns Promise resolving to the created todo item data
 * @throws Error if the creation fails
 */
export async function createListItem(itemData: {
	text: string
	listId: string
	priority: string
	dueDate: string
	completed: boolean
}): Promise<any> {
	const response = await fetch('/api/lists/items', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(itemData)
	})

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.error || 'Failed to create todo item')
	}

	return data
}
