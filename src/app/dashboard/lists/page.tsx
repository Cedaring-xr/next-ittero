'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { HiOutlineClipboardList, HiClipboardList } from 'react-icons/hi'
import { UserCircleIcon, CogIcon } from '@heroicons/react/24/outline'
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
import { type ListEntry } from '@/utils/api/lists'
import { useListsWithItems } from '@/app/hooks/use-lists-queries'

// Sortable List Item Component
function SortableListItem({ list }: { list: ListEntry }) {
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
				className="block mt-6 mb-2 p-4 bg-slate-800 border-4 border-slate-700 hover:border-indigo-500 hover:shadow-lg cursor-pointer transition-all"
				onClick={handleClick}
			>
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-3 flex-1">
						{/* Drag Handle */}
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
						<h3 className="text-white font-bold text-xl md:text-2xl underline">{list.title}</h3>
					</div>
					<p className="text-white text-sm">{formatDate(list.updatedAt)}</p>
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

	// Fetch lists with React Query
	const { data: fetchedLists, isLoading, error: queryError } = useListsWithItems()

	// Local state for drag and drop reordering
	const [userLists, setUserLists] = useState<ListEntry[]>([])

	// Update local state when data is fetched
	useEffect(() => {
		if (fetchedLists) {
			setUserLists(fetchedLists)
		}
	}, [fetchedLists])

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

	const error = queryError ? (queryError as Error).message : null

	return (
		<main>
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
			<h3 className="text-black text-3xl">Current Lists</h3>
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
										<SortableListItem key={list.id} list={list} />
									))}
								</SortableContext>
							</DndContext>
						</div>
					)}
				</div>
			</div>
		</main>
	)
}
