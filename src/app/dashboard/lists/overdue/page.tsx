'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	ArrowLeftIcon,
	CheckIcon,
	TrashIcon,
	ChevronDownIcon,
	ChevronRightIcon
} from '@heroicons/react/24/outline'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import ElegantButton from '@/ui/elegant-button'
import ConfirmModal from '@/ui/confirm-modal'
import TaskItemModal from '@/ui/lists/task-item-modal'
import { useListsWithItems, listKeys } from '@/app/hooks/use-lists-queries'
import { computeOverdueList } from '@/utils/helpers/lists'

type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

export default function OverdueTasksPage(): JSX.Element {
	const router = useRouter()
	const queryClient = useQueryClient()

	const { data: lists = [], isLoading } = useListsWithItems()

	const overdueList = computeOverdueList(lists)
	const overdueItems = overdueList.items || []

	// Map of listId -> title for the source-list badge on each task
	const listTitleMap = Object.fromEntries(lists.map((list) => [list.id, list.title]))

	// UI state
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
	const [itemToDelete, setItemToDelete] = useState<string | null>(null)
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
	const [isCompletedExpanded, setIsCompletedExpanded] = useState(false)

	// Toggle completion mutation
	const toggleCompletionMutation = useMutation({
		mutationFn: async ({ itemId, completed }: { itemId: string; completed: boolean }) => {
			const response = await fetch(`/api/lists/items/${itemId}`, {
				method: 'PATCH',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ completed })
			})
			if (!response.ok) throw new Error('Failed to update item')
			return response.json()
		},
		onSuccess: (_, { itemId }) => {
			const item = overdueItems.find((i) => i.id === itemId)
			if (item) {
				queryClient.invalidateQueries({ queryKey: ['items', item.listId] })
			}
			queryClient.invalidateQueries({ queryKey: listKeys.listsWithItems() })
		}
	})

	// Delete item mutation
	const deleteItemMutation = useMutation({
		mutationFn: async (itemId: string) => {
			const response = await fetch(`/api/lists/items/${itemId}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' }
			})
			if (!response.ok) throw new Error('Failed to delete item')
			return response.json()
		},
		onSuccess: (_, itemId) => {
			const item = overdueItems.find((i) => i.id === itemId)
			if (item) {
				queryClient.invalidateQueries({ queryKey: ['items', item.listId] })
			}
			queryClient.invalidateQueries({ queryKey: listKeys.listsWithItems() })
			setDeleteConfirmOpen(false)
			setItemToDelete(null)
		}
	})

	const handleToggleComplete = (itemId: string) => {
		const item = overdueItems.find((i) => i.id === itemId)
		if (!item) return
		toggleCompletionMutation.mutate({ itemId, completed: !item.completed })
	}

	const handleDeleteClick = (itemId: string) => {
		setItemToDelete(itemId)
		setDeleteConfirmOpen(true)
	}

	const handleDeleteConfirm = () => {
		if (!itemToDelete) return
		deleteItemMutation.mutate(itemToDelete)
	}

	const handleDeleteCancel = () => {
		setDeleteConfirmOpen(false)
		setItemToDelete(null)
	}

	const getPriorityColor = (priority: Priority) => {
		switch (priority) {
			case 'urgent':
				return 'bg-red-600 text-white'
			case 'high':
				return 'bg-orange-600 text-white'
			case 'medium':
				return 'bg-yellow-600 text-white'
			case 'low':
				return 'bg-blue-600 text-white'
			case 'none':
				return 'bg-gray-600 text-white'
		}
	}

	const formatDueDate = (dueDate: string) => {
		if (!dueDate) return ''
		const hasTime = dueDate.includes('T')
		if (hasTime) {
			const date = new Date(dueDate)
			const dateStr = date.toLocaleDateString()
			const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
			return `${dateStr} at ${timeStr}`
		}
		return new Date(dueDate).toLocaleDateString()
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-white text-xl">Loading...</p>
			</div>
		)
	}

	// Sort overdue tasks oldest first (most overdue at top)
	const activeTodos = overdueItems
		.filter((item) => !item.completed)
		.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

	const completedTodos = overdueItems.filter((item) => item.completed)

	return (
		<div className="max-w-6xl mx-auto p-6">
			<ElegantButton
				variant="primary"
				size="sm"
				icon={<ArrowLeftIcon className="h-5 w-5" />}
				onClick={() => router.push('/dashboard/lists')}
				className="mb-6"
			>
				Back to Lists
			</ElegantButton>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-3 mb-4">
				<div className="bg-slate-700 rounded-md p-3 text-center">
					<p className="text-gray-400 text-xs uppercase tracking-wide">Overdue Tasks</p>
					<p className="text-xl font-semibold text-red-400 mt-1">{activeTodos.length}</p>
				</div>
				<div className="bg-slate-700 rounded-md p-3 text-center">
					<p className="text-gray-400 text-xs uppercase tracking-wide">Completed</p>
					<p className="text-xl font-semibold text-green-400 mt-1">{completedTodos.length}</p>
				</div>
			</div>

			{/* List Container */}
			<div className="bg-slate-800 rounded-lg p-6 mb-6">
				{/* Header */}
				<div className="flex justify-between items-start mb-4">
					<h1 className="font-lusitana text-3xl font-bold text-white">Overdue Tasks</h1>
				</div>

				<p className="text-gray-300 mb-4 italic">Tasks past their due date</p>

				{/* Active overdue tasks */}
				{activeTodos.length > 0 && (
					<div className="mt-4 pt-4 border-t border-slate-700">
						<h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
							Active Tasks
						</h2>
						<div className="space-y-2">
							{activeTodos.map((item) => (
								<div
									key={item.id}
									onClick={() => setSelectedItemId(item.id)}
									className="bg-slate-700 rounded-md p-3 hover:bg-slate-600 transition-colors cursor-pointer"
								>
									<div className="flex items-start gap-2">
										<button
											onClick={(e) => {
												e.stopPropagation()
												handleToggleComplete(item.id)
											}}
											className="flex-shrink-0 w-5 h-5 mt-0.5 border-2 border-gray-400 rounded hover:border-indigo-500 transition-colors"
											aria-label="Mark as complete"
										/>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 flex-wrap mb-1">
												<h3 className="text-white text-sm font-normal">{item.text}</h3>
												{item.priority !== 'none' && (
													<span
														className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityColor(item.priority as Priority)}`}
													>
														{item.priority}
													</span>
												)}
												{listTitleMap[item.listId] && (
													<span className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-600 text-gray-300">
														{listTitleMap[item.listId]}
													</span>
												)}
											</div>
											{item.dueDate && (
												<p className="text-red-400 text-xs">Due: {formatDueDate(item.dueDate)}</p>
											)}
										</div>
										<button
											onClick={(e) => {
												e.stopPropagation()
												handleDeleteClick(item.id)
											}}
											className="flex-shrink-0 p-1 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
											aria-label="Delete todo"
										>
											<TrashIcon className="w-4 h-4" />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Empty state */}
				{activeTodos.length === 0 && (
					<div className="mt-4 pt-4 border-t border-slate-700 text-center py-6">
						<p className="text-gray-400 text-sm">No overdue tasks. You&apos;re all caught up!</p>
					</div>
				)}
			</div>

			{/* Completed Tasks */}
			{completedTodos.length > 0 && (
				<div>
					<button
						onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
						className="flex text-sm font-semibold text-black uppercase mb-3"
					>
						{isCompletedExpanded ? (
							<ChevronDownIcon className="w-6 h-6" />
						) : (
							<ChevronRightIcon className="w-6 h-6" />
						)}
						<span className="ml-2">Completed Tasks ({completedTodos.length})</span>
					</button>
					{isCompletedExpanded && (
						<div className="space-y-2">
							{completedTodos.map((item) => (
								<div
									key={item.id}
									onClick={() => setSelectedItemId(item.id)}
									className="bg-slate-700 rounded-md p-3 hover:bg-slate-600 transition-colors cursor-pointer"
								>
									<div className="flex items-start gap-2">
										<button
											onClick={(e) => {
												e.stopPropagation()
												handleToggleComplete(item.id)
											}}
											className="flex-shrink-0 w-5 h-5 mt-0.5 bg-green-500 rounded flex items-center justify-center hover:bg-green-600 transition-colors"
											aria-label="Mark as incomplete"
										>
											<CheckIcon className="w-3 h-3 text-white" />
										</button>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 flex-wrap mb-1">
												<h3 className="text-gray-300 text-sm font-normal">{item.text}</h3>
												{item.priority !== 'none' && (
													<span
														className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityColor(item.priority as Priority)}`}
													>
														{item.priority}
													</span>
												)}
												{listTitleMap[item.listId] && (
													<span className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-600 text-gray-300">
														{listTitleMap[item.listId]}
													</span>
												)}
											</div>
											{item.dueDate && (
												<p className="text-gray-400 text-xs">Due: {formatDueDate(item.dueDate)}</p>
											)}
										</div>
										<button
											onClick={(e) => {
												e.stopPropagation()
												handleDeleteClick(item.id)
											}}
											className="flex-shrink-0 p-1 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
											aria-label="Delete todo"
										>
											<TrashIcon className="w-4 h-4" />
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* Delete Confirmation Modal */}
			<ConfirmModal
				isOpen={deleteConfirmOpen}
				onClose={handleDeleteCancel}
				onConfirm={handleDeleteConfirm}
				title="Delete Task"
				message="Are you sure you want to delete this task? This action cannot be undone."
				confirmText="Delete"
				cancelText="Cancel"
				variant="danger"
				isLoading={deleteItemMutation.isPending}
			/>

			{/* Task Item Modal */}
			{selectedItemId && (
				<TaskItemModal
					itemId={selectedItemId}
					onClose={() => setSelectedItemId(null)}
					onUpdate={(updated) => {
						setSelectedItemId(null)
						queryClient.invalidateQueries({ queryKey: listKeys.listsWithItems() })
					}}
				/>
			)}
		</div>
	)
}
