import { useQuery } from '@tanstack/react-query'

type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

interface TodoItem {
	id: string
	text: string
	listId: string
	priority: Priority
	dueDate: string
	completed: boolean
	createdAt: string
	updatedAt: string
}

interface ListEntry {
	id: string
	title: string
	description: string
	category: string
	tags: string[]
	archived: boolean
	createdAt: string
	updatedAt: string
	items?: TodoItem[]
}

// Fetch all lists
export function useAllLists() {
	return useQuery({
		queryKey: ['lists'],
		queryFn: async () => {
			const response = await fetch('/api/lists', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch lists')
			}

			return data.lists as ListEntry[]
		}
	})
}

// Fetch all tasks for all lists
export function useAllTasks() {
	const { data: lists = [] } = useAllLists()

	return useQuery({
		queryKey: ['all-tasks'],
		queryFn: async () => {
			// Fetch items for each list
			const tasksPromises = lists.map(async (list) => {
				try {
					const response = await fetch(`/api/lists/items?listId=${list.id}`, {
						method: 'GET',
						headers: { 'Content-Type': 'application/json' }
					})

					const data = await response.json()

					if (response.ok) {
						return data.items || []
					}
					return []
				} catch (err) {
					console.error(`Error fetching items for list ${list.id}:`, err)
					return []
				}
			})

			const tasksArrays = await Promise.all(tasksPromises)
			// Flatten all tasks into a single array
			return tasksArrays.flat() as TodoItem[]
		},
		enabled: lists.length > 0 // Only run when we have lists
	})
}

// Calculate statistics from lists and tasks
export function useListsStats() {
	const { data: lists = [], isLoading: listsLoading } = useAllLists()
	const { data: tasks = [], isLoading: tasksLoading } = useAllTasks()

	const stats = {
		totalLists: lists.length,
		totalTasks: tasks.length,
		completedTasks: tasks.filter((task) => task.completed).length,
		activeTasks: tasks.filter((task) => !task.completed).length,
		tasksByPriority: {
			urgent: tasks.filter((task) => task.priority === 'urgent').length,
			high: tasks.filter((task) => task.priority === 'high').length,
			medium: tasks.filter((task) => task.priority === 'medium').length,
			low: tasks.filter((task) => task.priority === 'low').length,
			none: tasks.filter((task) => task.priority === 'none').length
		},
		tasksWithDueDate: tasks.filter((task) => task.dueDate).length,
		overdueTasks: tasks.filter((task) => {
			if (!task.dueDate || task.completed) return false
			return new Date(task.dueDate) < new Date()
		}).length,
		completionRate: tasks.length > 0 ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100) : 0
	}

	return {
		stats,
		isLoading: listsLoading || tasksLoading,
		lists,
		tasks
	}
}
