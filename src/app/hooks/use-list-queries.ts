import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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
}

// Fetch list details
export function useListDetails(listId: string) {
	return useQuery({
		queryKey: ['list', listId],
		queryFn: async () => {
			const response = await fetch(`/api/lists/${listId}`, {
				method: 'GET',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' }
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch list details')
			}

			return data.list as ListEntry
		}
	})
}

// Fetch list items
export function useListItems(listId: string) {
	return useQuery({
		queryKey: ['items', listId],
		queryFn: async () => {
			const response = await fetch(`/api/lists/items?listId=${listId}`, {
				method: 'GET',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' }
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch list items')
			}

			return data.items as TodoItem[]
		}
	})
}

// Create new item mutation
export function useCreateItem(listId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (newItem: {
			text: string
			listId: string
			priority: Priority
			dueDate: string
			completed: boolean
		}) => {
			const response = await fetch('/api/lists/items', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newItem)
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create todo item')
			}

			return data.data
		},
		onSuccess: () => {
			// Invalidate and refetch items
			queryClient.invalidateQueries({ queryKey: ['items', listId] })
		}
	})
}

// Toggle item completion mutation
export function useToggleItemCompletion(listId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ itemId, completed }: { itemId: string; completed: boolean }) => {
			const response = await fetch(`/api/lists/items/${itemId}`, {
				method: 'PATCH',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ completed })
			})

			if (!response.ok) {
				throw new Error('Failed to update item')
			}

			return response.json()
		},
		// Optimistic update
		onMutate: async ({ itemId, completed }) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: ['items', listId] })

			// Snapshot previous value
			const previousItems = queryClient.getQueryData(['items', listId])

			// Optimistically update
			queryClient.setQueryData(['items', listId], (old: TodoItem[] | undefined) => {
				if (!old) return old
				return old.map((item) => (item.id === itemId ? { ...item, completed } : item))
			})

			return { previousItems }
		},
		onError: (err, variables, context) => {
			// Rollback on error
			if (context?.previousItems) {
				queryClient.setQueryData(['items', listId], context.previousItems)
			}
		},
		onSettled: () => {
			// Refetch after error or success
			queryClient.invalidateQueries({ queryKey: ['items', listId] })
		}
	})
}

// Delete item mutation
export function useDeleteItem(listId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (itemId: string) => {
			const response = await fetch(`/api/lists/items/${itemId}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' }
			})

			if (!response.ok) {
				throw new Error('Failed to delete item')
			}

			return response.json()
		},
		// Optimistic update
		onMutate: async (itemId) => {
			await queryClient.cancelQueries({ queryKey: ['items', listId] })

			const previousItems = queryClient.getQueryData(['items', listId])

			queryClient.setQueryData(['items', listId], (old: TodoItem[] | undefined) => {
				if (!old) return old
				return old.filter((item) => item.id !== itemId)
			})

			return { previousItems }
		},
		onError: (err, variables, context) => {
			if (context?.previousItems) {
				queryClient.setQueryData(['items', listId], context.previousItems)
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['items', listId] })
		}
	})
}
