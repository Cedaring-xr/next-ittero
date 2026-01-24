'use client'
import { createContext, useContext, ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { type ListEntry } from '@/utils/api/lists'
import { useLists, listKeys } from '@/app/hooks/use-lists-queries'

interface PinnedListsContextType {
	pinnedLists: ListEntry[]
	isPinned: (listId: string) => boolean
	pinList: (listId: string) => Promise<void>
	unpinList: (listId: string) => Promise<void>
	isLoading: boolean
	refreshPinnedLists: () => Promise<void>
}

const PinnedListsContext = createContext<PinnedListsContextType | undefined>(undefined)

export function PinnedListsProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient()

	// Fetch lists with React Query
	const { data: lists = [], isLoading, refetch } = useLists()

	// TODO: Once 'pinned' property is added to the database schema,
	// filter by: lists.filter(list => list.pinned && !list.archived)
	// For now, we'll use the first 3 lists as pinned
	const pinnedLists = lists.slice(0, 3)

	const isPinned = (listId: string): boolean => {
		return pinnedLists.some((list) => list.id === listId)
	}

	const pinList = async (listId: string) => {
		try {
			// TODO: Implement API endpoint to update list pinned status
			// const response = await fetch(`/api/lists/${listId}/pin`, {
			// 	method: 'PATCH',
			// 	headers: { 'Content-Type': 'application/json' }
			// })

			// if (!response.ok) throw new Error('Failed to pin list')

			// Refetch lists using React Query
			await queryClient.invalidateQueries({ queryKey: listKeys.lists() })
			console.log(`Pinned list: ${listId}`)
		} catch (error) {
			console.error('Error pinning list:', error)
			throw error
		}
	}

	const unpinList = async (listId: string) => {
		try {
			// TODO: Implement API endpoint to update list pinned status
			// const response = await fetch(`/api/lists/${listId}/unpin`, {
			// 	method: 'PATCH',
			// 	headers: { 'Content-Type': 'application/json' }
			// })

			// if (!response.ok) throw new Error('Failed to unpin list')

			// Refetch lists using React Query
			await queryClient.invalidateQueries({ queryKey: listKeys.lists() })
			console.log(`Unpinned list: ${listId}`)
		} catch (error) {
			console.error('Error unpinning list:', error)
			throw error
		}
	}

	const refreshPinnedLists = async () => {
		await refetch()
	}

	return (
		<PinnedListsContext.Provider
			value={{
				pinnedLists,
				isPinned,
				pinList,
				unpinList,
				isLoading,
				refreshPinnedLists
			}}
		>
			{children}
		</PinnedListsContext.Provider>
	)
}

export function usePinnedLists() {
	const context = useContext(PinnedListsContext)
	if (context === undefined) {
		throw new Error('usePinnedLists must be used within a PinnedListsProvider')
	}
	return context
}
