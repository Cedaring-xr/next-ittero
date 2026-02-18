'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { HiOutlineClipboardList, HiClipboardList } from 'react-icons/hi'
import { UserCircleIcon, CogIcon, TrashIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs'
import ElegantButton from '@/ui/elegant-button'
import { useRouter } from 'next/navigation'
import useAuthUser from '@/app/hooks/user-auth-user'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatDate } from '@/utils/helpers/date-and-time'
import { type ListEntry, getOrCreateUnassignedList } from '@/utils/api/lists'
import { injectOverdueList } from '@/utils/helpers/lists'
import { useListsWithItems } from '@/app/hooks/use-lists-queries'
import DeleteListModal from '@/ui/delete-list-modal'
import { useQueryClient } from '@tanstack/react-query'
import { usePinnedLists } from '@/contexts/PinnedListsContext'
import ErrorAlert from '@/ui/error-alert'

// Sortable List Item Component
function SortableListItem({
	list,
	onDelete,
	onTogglePin
}: {
	list: ListEntry
	onDelete: (e: React.MouseEvent, listId: string) => void
	onTogglePin: (e: React.MouseEvent, listId: string, currentPinned: boolean) => void
}) {
	const router = useRouter()
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: list.id
	})
	const isDraggingRef = React.useRef(false)

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1
	}

	// Track when dragging starts and ends using ref for immediate updates
	React.useEffect(() => {
		if (isDragging) {
			isDraggingRef.current = true
		} else if (!isDragging && isDraggingRef.current) {
			// Dragging just ended, reset after a delay
			setTimeout(() => {
				isDraggingRef.current = false
			}, 200)
		}
	}, [isDragging])

	const handleClick = () => {
		// Only navigate if we weren't dragging
		if (!isDraggingRef.current) {
			router.push(`/dashboard/lists/${list.id}`)
		}
	}

	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			<div
				className={`block mt-6 mb-2 p-4 border-4 transition-all ${
					list.isSystem
						? 'bg-slate-900 border-blue-600 hover:border-blue-500 cursor-pointer'
						: 'bg-slate-800 border-slate-700 hover:border-indigo-500 hover:shadow-lg cursor-pointer'
				}`}
				onClick={handleClick}
			>
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-3 flex-1">
						{/* Drag Handle - only show for non-system lists */}
						{!list.isSystem && (
							<div
								{...listeners}
								className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-white transition-colors"
								onClick={(e) => e.preventDefault()}
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 8h16M4 16h16"
									/>
								</svg>
							</div>
						)}
						{/* System list indicator */}
						{list.isSystem && (
							<div className="p-1 text-blue-400" title="System list - cannot be deleted">
								<LockClosedIcon className="w-5 h-5" />
							</div>
						)}
						<h3 className="text-white font-bold text-xl md:text-2xl underline">{list.title}</h3>
						{/* System badge */}
						{list.isSystem && (
							<span className="px-2 py-1 text-xs font-semibold bg-blue-600 text-white rounded">
								SYSTEM
							</span>
						)}
					</div>
					<div className="flex items-center gap-2">
						<p className="text-white text-sm">{formatDate(list.updatedAt)}</p>
						{/* Pin/Unpin button - all lists except system lists can be unpinned */}
						{!list.isSystem && (
							<button
								onClick={(e) => onTogglePin(e, list.id, list.pinned || false)}
								className={`p-1.5 rounded hover:bg-slate-700 transition-colors ${
									list.pinned ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-400'
								}`}
								aria-label={list.pinned ? 'Unpin list' : 'Pin list'}
								title={list.pinned ? 'Unpin from sidebar' : 'Pin to sidebar'}
							>
								{list.pinned ? <BsPinAngleFill className="w-4 h-4" /> : <BsPinAngle className="w-4 h-4" />}
							</button>
						)}
						{/* System lists show pinned indicator but no button */}
						{list.isSystem && list.pinned && (
							<div className="p-1.5 text-yellow-400" title="Always pinned">
								<BsPinAngleFill className="w-4 h-4" />
							</div>
						)}
						{/* Only show delete button for non-system lists */}
						{!list.isSystem && (
							<button
								onClick={(e) => onDelete(e, list.id)}
								className="p-1.5 rounded hover:bg-slate-700 text-gray-400 hover:text-red-400 transition-colors"
								aria-label="Delete list"
							>
								<TrashIcon className="w-4 h-4" />
							</button>
						)}
					</div>
				</div>
				<div className="flex justify-between mt-1 ml-8">
					<p className="text-white mb-4 italic">{list.description}</p>
					{!list.category ? (
						''
					) : (
						<div className="border-emerald-500 border-[2px] p-1 rounded-md text-white">
							{list.category}
						</div>
					)}
				</div>

				{/* Item counts */}
				<div className="flex gap-4 text-sm ml-8">
					<span className="text-gray-300">
						Total: <span className="font-semibold text-white">{list.items?.length || 0}</span>
					</span>
					<span className="text-gray-300">
						Completed:{' '}
						<span className="font-semibold text-green-400">
							{list.items?.filter((item) => item.completed).length || 0}
						</span>
					</span>
				</div>
			</div>
		</div>
	)
}

export default function Lists() {
	const user = useAuthUser()
	const router = useRouter()
	const queryClient = useQueryClient()
	const { pinList, unpinList, pinnedLists } = usePinnedLists()

	// Fetch lists with React Query - refetch on mount to get fresh data when navigating back
	const { data: fetchedLists, isLoading, error: queryError, refetch } = useListsWithItems()

	// Local state for drag and drop reordering
	const [userLists, setUserLists] = useState<ListEntry[]>([])
	const [listToDelete, setListToDelete] = useState<string | null>(null)
	const [deleting, setDeleting] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const unassignedCheckRef = React.useRef(false) // Prevent multiple simultaneous calls

	// Update local state when data is fetched, injecting the computed overdue list
	useEffect(() => {
		if (fetchedLists) {
			setUserLists(injectOverdueList(fetchedLists))
		}
	}, [fetchedLists])

	// Refetch when component mounts (e.g., navigating back from list detail page)
	useEffect(() => {
		refetch()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Ensure the "Unassigned Tasks" system list exists for this user
	useEffect(() => {
		const ensureUnassignedList = async () => {
			// Prevent multiple simultaneous calls
			if (unassignedCheckRef.current) {
				return
			}
			unassignedCheckRef.current = true

			try {
				// If we have fetchedLists data, check if unassigned list already exists
				if (fetchedLists && fetchedLists.length > 0) {
					const unassignedExists = fetchedLists.some(
						(list) => list.isSystem === true && list.name === 'Unassigned Tasks'
					)

					if (unassignedExists) {
						console.log('Unassigned list already exists (found in fetched data)')
						return // No need to call the API
					}
				}

				// Either fetchedLists is empty/failed, or unassigned list doesn't exist
				// Call the endpoint to get or create it
				const result = await getOrCreateUnassignedList()
				if (result.created) {
					console.log('Created unassigned list for user')
				} else {
					console.log('Unassigned list already exists')
				}
			} catch (err) {
				console.error('Error ensuring unassigned list exists:', err)
			}
		}

		// Only run once after initial load completes
		if (!isLoading && fetchedLists !== undefined) {
			ensureUnassignedList()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading])

	// Drag and drop sensors
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8 // Require 8px of movement before drag starts
			}
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	// Handle drag end
	const handleDragEnd = (event: any) => {
		const { active, over } = event

		if (over && active.id !== over.id) {
			setUserLists((lists) => {
				const oldIndex = lists.findIndex((list) => list.id === active.id)
				const newIndex = lists.findIndex((list) => list.id === over.id)

				return arrayMove(lists, oldIndex, newIndex)
			})
		}
	}

	const handleCreateNewList = () => {
		router.push('/dashboard/lists/newList')
	}

	const handleItemCreate = () => {
		router.push('/dashboard/lists/items')
	}

	const handleDeleteClick = (e: React.MouseEvent, listId: string) => {
		e.stopPropagation()
		setListToDelete(listId)
	}

	const handleTogglePin = async (e: React.MouseEvent, listId: string, currentPinned: boolean) => {
		e.stopPropagation()

		try {
			if (currentPinned) {
				await unpinList(listId)
			} else {
				await pinList(listId)
			}
			// Refetch to get updated lists
			await refetch()
		} catch (error) {
			console.error('Error toggling pin:', error)
			// Show error to user
			setErrorMessage(error instanceof Error ? error.message : 'Failed to update pin status')
		}
	}

	const handleDeleteConfirm = async (mode: 'cascade' | 'reassign') => {
		if (!listToDelete) return
		setDeleting(true)

		// Get the items from the list being deleted (before deletion)
		const listBeingDeleted = userLists.find((list) => list.id === listToDelete)
		const itemsToMove = listBeingDeleted?.items || []

		try {
			// For now, we only support cascade mode (reassign will be added in Phase 3)
			const response = await fetch(`/api/lists/${listToDelete}?deleteMode=${mode}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' }
			})

			if (!response.ok) {
				throw new Error('Failed to delete list')
			}

			const data = await response.json()

			if (mode === 'cascade') {
				console.log(`List deleted successfully. ${data.itemsDeleted} items deleted.`)
				if (data.itemsFailed > 0) {
					console.warn(`${data.itemsFailed} items failed to delete`)
				}
				setUserLists((prev) => {
					const realLists = prev
						.filter((list) => !list.isVirtual) // Exclude virtual lists before computing
						.filter((list) => list.id !== listToDelete)
					return injectOverdueList(realLists)
				})
			} else {
				console.log(`List deleted. ${data.itemsReassigned || 0} items moved to Unassigned Tasks.`)
				setUserLists((prev) => {
					const realLists = prev
						.filter((list) => !list.isVirtual) // Exclude virtual lists before computing
						.filter((list) => list.id !== listToDelete)
						.map((list) => {
							if (list.isSystem && list.name === 'Unassigned Tasks') {
								return { ...list, items: [...(list.items || []), ...itemsToMove] }
							}
							return list
						})
					return injectOverdueList(realLists)
				})
			}

			// Invalidate queries to update sidebar and other components
			await queryClient.invalidateQueries({ queryKey: ['lists'] })

			setListToDelete(null)
		} catch (err) {
			console.error('Error deleting list:', err)
			setListToDelete(null)
		} finally {
			setDeleting(false)
		}
	}

	const error = queryError ? (queryError as Error).message : null

	return (
		<main>
			{/* Error Alert */}
			{errorMessage && <ErrorAlert message={errorMessage} onClose={() => setErrorMessage(null)} />}

			<div className="flex justify-between bg-gradient-to-br from-[#1e3a5f] to-slate-900 text-white px-6 py-4 -mx-6 -mt-6 mb-6 w-[calc(100%+3rem)]">
				<div className="flex ml-4">
					<HiOutlineClipboardList className="h-[30px] w-[30px]" />{' '}
					<h1 className="md:text-xl ml-2">Your Lists</h1>
				</div>
				<div className="flex items-center mr-4 gap-4">
					<div className="flex items-center">
						<UserCircleIcon className="w-6 mr-1" />
						<h2>{user?.name || user?.username}</h2>
					</div>
					<div className="h-6 w-px bg-slate-400"></div>
					<Link
						id="profile-settings"
						href="/dashboard/profile"
						className="hover:text-[#39CCCC] transition-colors p-1 hover:bg-slate-800 rounded"
						aria-label="Profile settings"
					>
						<CogIcon className="w-6 h-6" />
					</Link>
				</div>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4">
				<ElegantButton
					variant="secondary"
					size="lg"
					icon={<HiOutlineClipboardList className="h-6 w-6" />}
					onClick={handleCreateNewList}
					className="h-12"
				>
					Create New List
				</ElegantButton>
				<ElegantButton
					variant="secondary"
					size="lg"
					icon={<HiClipboardList className="h-6 w-6" />}
					onClick={handleItemCreate}
					className="h-12"
				>
					Create tasks
				</ElegantButton>
			</div>
			<div className="flex items-center justify-between">
				<h3 className="text-black text-3xl">Current Lists</h3>
				<div className="flex items-center gap-4">
					<span className="text-gray-600 text-sm flex items-center gap-1">
						<BsPinAngleFill className="w-4 h-4 text-yellow-500" />
						<span className="font-semibold">
							{isLoading ? '...' : `${pinnedLists.length}/7 pinned`}
						</span>
					</span>
					<span className="text-gray-600 text-lg">
						{isLoading ? '...' : `${fetchedLists?.length || 0} ${fetchedLists?.length === 1 ? 'list' : 'lists'}`}
					</span>
				</div>
			</div>
			<div className="font-lusitana font-bold p-6">
				<div>
					{isLoading ? (
						// Loading state
						<div className="flex flex-col items-center justify-center py-12">
							<div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
							<p className="text-gray-600 text-lg">Loading your lists...</p>
						</div>
					) : !userLists.length ? (
						// Empty state
						<div className="flex flex-col items-center justify-center py-12 bg-slate-100 rounded-lg">
							<HiOutlineClipboardList className="h-16 w-16 text-gray-400 mb-4" />
							<p className="text-gray-700 text-xl mb-2">No Lists Yet</p>
							<p className="text-gray-600 mb-6">Get started by creating your first list</p>
							<div className="flex gap-4">
								<ElegantButton variant="primary" size="lg" onClick={handleCreateNewList}>
									Create New List
								</ElegantButton>
							</div>
						</div>
					) : (
						// Lists display
						<div id="list-container">
							<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
								<SortableContext items={userLists.map((list) => list.id)} strategy={verticalListSortingStrategy}>
									{userLists.map((list) => (
										<SortableListItem
											key={list.id}
											list={list}
											onDelete={handleDeleteClick}
											onTogglePin={handleTogglePin}
										/>
									))}
								</SortableContext>
							</DndContext>
						</div>
					)}
				</div>
			</div>

			<DeleteListModal
				isOpen={!!listToDelete}
				onClose={() => setListToDelete(null)}
				onConfirm={handleDeleteConfirm}
				itemCount={userLists.find((list) => list.id === listToDelete)?.items?.length || 0}
				isLoading={deleting}
			/>
		</main>
	)
}
