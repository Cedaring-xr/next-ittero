'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ListEntry {
	id: string
	title: string
	description: string
	category: string
	tags: string[]
	archived: boolean
	pinned?: boolean
	createdAt: string
	updatedAt: string
}

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
	const [pinnedLists, setPinnedLists] = useState<ListEntry[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const fetchPinnedLists = async () => {
		setIsLoading(true)
		try {
			const response = await fetch('/api/lists', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (response.ok) {
				const data = await response.json()
				const lists = data.lists || []

				// TODO: Once 'pinned' property is added to the database schema,
				// filter by: lists.filter(list => list.pinned && !list.archived)
				// For now, we'll use the first 3 lists as pinned
				const topLists = lists.slice(0, 3)
				setPinnedLists(topLists)
			}
		} catch (error) {
			console.error('Error fetching pinned lists:', error)
			setPinnedLists([])
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchPinnedLists()
	}, [])

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

			// For now, just refresh the list
			await fetchPinnedLists()
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

			// Optimistically update UI
			setPinnedLists((prev) => prev.filter((list) => list.id !== listId))
			console.log(`Unpinned list: ${listId}`)
		} catch (error) {
			console.error('Error unpinning list:', error)
			// Revert on error
			await fetchPinnedLists()
			throw error
		}
	}

	const refreshPinnedLists = async () => {
		await fetchPinnedLists()
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
