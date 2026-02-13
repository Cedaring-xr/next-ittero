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

	// Filter for pinned lists (max 7, sorted by createdAt - oldest first)
	const pinnedLists = lists
		.filter((list) => list.pinned === true && !list.archived)
		.sort((a, b) => {
			// Sort by createdAt - oldest pinned lists first
			const dateA = new Date(a.createdAt).getTime()
			const dateB = new Date(b.createdAt).getTime()
			return dateA - dateB
		})
		.slice(0, 7) // Limit to 7 pinned lists

	const isPinned = (listId: string): boolean => {
		return pinnedLists.some((list) => list.id === listId)
	}

	const pinList = async (listId: string) => {
		try {
			const response = await fetch(`/api/lists/${listId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pinned: true })
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || errorData.error || 'Failed to pin list')
			}

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
			const response = await fetch(`/api/lists/${listId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pinned: false })
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || errorData.error || 'Failed to unpin list')
			}

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
