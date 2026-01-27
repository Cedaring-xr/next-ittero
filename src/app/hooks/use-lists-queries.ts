'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	fetchLists,
	fetchListItems,
	fetchListsWithItems,
	createList,
	createListItem,
	type ListEntry,
	type TodoItem
} from '@/utils/api/lists'

// Query keys for React Query
export const listKeys = {
	all: ['lists'] as const,
	lists: () => [...listKeys.all, 'list'] as const,
	list: (id: string) => [...listKeys.lists(), id] as const,
	items: (listId: string) => [...listKeys.all, 'items', listId] as const,
	listsWithItems: () => [...listKeys.all, 'with-items'] as const
}

/**
 * Hook to fetch all lists
 */
export function useLists() {
	return useQuery({
		queryKey: listKeys.lists(),
		queryFn: fetchLists
	})
}

/**
 * Hook to fetch all lists with their items populated
 */
export function useListsWithItems() {
	return useQuery({
		queryKey: listKeys.listsWithItems(),
		queryFn: fetchListsWithItems
	})
}

/**
 * Hook to fetch items for a specific list
 */
export function useListItems(listId: string, enabled = true) {
	return useQuery({
		queryKey: listKeys.items(listId),
		queryFn: () => fetchListItems(listId),
		enabled: !!listId && enabled
	})
}

/**
 * Hook to create a new list
 */
export function useCreateList() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createList,
		onSuccess: () => {
			// Invalidate and refetch lists queries
			queryClient.invalidateQueries({ queryKey: listKeys.all })
		}
	})
}

/**
 * Hook to create a new list item
 */
export function useCreateListItem() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createListItem,
		onSuccess: (data, variables) => {
			// Invalidate the specific list's items
			queryClient.invalidateQueries({ queryKey: listKeys.items(variables.listId) })
			// Also invalidate lists with items
			queryClient.invalidateQueries({ queryKey: listKeys.listsWithItems() })
		}
	})
}
