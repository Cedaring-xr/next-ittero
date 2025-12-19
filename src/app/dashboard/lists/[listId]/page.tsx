'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { lusitana } from '@/ui/fonts'
import {
	ArrowLeftIcon,
	CheckIcon,
	TrashIcon,
	PlusIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	ChevronRightIcon
} from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'
import Modal from '@/ui/modal'
import ConfirmModal from '@/ui/confirm-modal'

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

export default function ListDetailPage() {
	const router = useRouter()
	const params = useParams()
	const listId = params.listId as string

	const [list, setList] = useState<ListEntry | null>(null)
	const [items, setItems] = useState<TodoItem[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [newItemText, setNewItemText] = useState('')
	const [newItemPriority, setNewItemPriority] = useState<Priority>('none')
	const [newItemDueDate, setNewItemDueDate] = useState('')
	const [newItemDueTime, setNewItemDueTime] = useState('')
	const [isCreating, setIsCreating] = useState(false)
	const [createError, setCreateError] = useState<string | null>(null)
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
	const [itemToDelete, setItemToDelete] = useState<string | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)
	const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('priority')
	const [isCompletedExpanded, setIsCompletedExpanded] = useState(false)

	// Format timestamp to DD-MM-YYYY
	const formatDate = (timestamp: string) => {
		const date = new Date(timestamp)
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear()
		return `${day}-${month}-${year}`
	}

	// Format due date/time for display
	const formatDueDate = (dueDate: string) => {
		if (!dueDate) return ''

		// Check if the dueDate includes time (contains 'T' separator)
		const hasTime = dueDate.includes('T')

		if (hasTime) {
			const date = new Date(dueDate)
			const dateStr = date.toLocaleDateString()
			const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
			return `${dateStr} at ${timeStr}`
		} else {
			// Just date, no time
			return new Date(dueDate).toLocaleDateString()
		}
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

	// Fetch list details
	const fetchListDetails = useCallback(async () => {
		try {
			const response = await fetch(`/api/lists/${listId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch list details')
			}

			setList(data.list)
		} catch (err) {
			console.error('Error fetching list details:', err)
			setError(err instanceof Error ? err.message : 'Failed to fetch list')
		}
	}, [listId])

	// Fetch todo items for this list
	const fetchListItems = useCallback(async () => {
		try {
			const response = await fetch(`/api/lists/items?listId=${listId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch list items')
			}

			setItems(data.items || [])
		} catch (err) {
			console.error('Error fetching list items:', err)
			setError(err instanceof Error ? err.message : 'Failed to fetch items')
		}
	}, [listId])

	// Fetch data on component mount
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			setError(null)
			await Promise.all([fetchListDetails(), fetchListItems()])
			setIsLoading(false)
		}

		if (listId) {
			fetchData()
		}
	}, [listId, fetchListDetails, fetchListItems])

	const handleToggleComplete = async (itemId: string) => {
		const item = items.find((i) => i.id === itemId)
		if (!item) return

		try {
			const response = await fetch(`/api/lists/items/${itemId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					completed: !item.completed
				})
			})

			if (!response.ok) {
				throw new Error('Failed to update item')
			}

			// Update local state
			setItems(items.map((i) => (i.id === itemId ? { ...i, completed: !i.completed } : i)))
		} catch (err) {
			console.error('Error toggling item:', err)
			setError(err instanceof Error ? err.message : 'Failed to update item')
		}
	}

	const handleDeleteClick = (itemId: string) => {
		setItemToDelete(itemId)
		setDeleteConfirmOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!itemToDelete) return

		setIsDeleting(true)
		try {
			const response = await fetch(`/api/lists/items/${itemToDelete}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (!response.ok) {
				throw new Error('Failed to delete item')
			}

			// Remove from local state
			setItems(items.filter((i) => i.id !== itemToDelete))

			// Close modal and reset
			setDeleteConfirmOpen(false)
			setItemToDelete(null)
		} catch (err) {
			console.error('Error deleting item:', err)
			setError(err instanceof Error ? err.message : 'Failed to delete item')
		} finally {
			setIsDeleting(false)
		}
	}

	const handleDeleteCancel = () => {
		setDeleteConfirmOpen(false)
		setItemToDelete(null)
	}

	const handleAddItem = () => {
		setIsModalOpen(true)
		setCreateError(null)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setNewItemText('')
		setNewItemPriority('none')
		setNewItemDueDate('')
		setNewItemDueTime('')
		setCreateError(null)
	}

	const handleCreateItem = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsCreating(true)
		setCreateError(null)

		try {
			// Combine date and time if both are provided
			let dueDateTimeString = ''
			if (newItemDueDate) {
				if (newItemDueTime) {
					// Combine date and time into ISO string
					dueDateTimeString = `${newItemDueDate}T${newItemDueTime}:00`
				} else {
					// Just date, no time
					dueDateTimeString = newItemDueDate
				}
			}

			const todoData = {
				text: newItemText.trim(),
				listId: listId,
				priority: newItemPriority,
				dueDate: dueDateTimeString,
				completed: false
			}

			const response = await fetch('/api/lists/items', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(todoData)
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create todo item')
			}

			// Add the new item to the local state
			const newItem: TodoItem = {
				id: data.data.id || Date.now().toString(),
				text: todoData.text,
				listId: todoData.listId,
				priority: todoData.priority,
				dueDate: todoData.dueDate,
				completed: false,
				createdAt: data.data.createdAt || new Date().toISOString(),
				updatedAt: data.data.updatedAt || new Date().toISOString()
			}

			setItems([...items, newItem])

			// Close modal and reset form
			handleCloseModal()
		} catch (err) {
			console.error('Error creating todo:', err)
			setCreateError(err instanceof Error ? err.message : 'Failed to create todo item')
		} finally {
			setIsCreating(false)
		}
	}

	const handleBack = () => {
		router.push('/dashboard/lists')
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-white text-xl">Loading...</p>
			</div>
		)
	}

	if (error || !list) {
		return (
			<div className="flex flex-col items-center justify-center h-screen gap-4">
				<p className="text-red-400 text-xl">{error || 'List not found'}</p>
				<ElegantButton variant="outline" onClick={handleBack}>
					Back to Lists
				</ElegantButton>
			</div>
		)
	}

	// Helper function to get priority value for sorting
	const getPriorityValue = (priority: Priority): number => {
		const priorityMap = { urgent: 0, high: 1, medium: 2, low: 3, none: 4 }
		return priorityMap[priority]
	}

	// Sort active todos based on selected sort option
	const getSortedActiveTodos = () => {
		const active = items.filter((item) => !item.completed)

		if (sortBy === 'dueDate') {
			return [...active].sort((a, b) => {
				// Items without due date go to the end
				if (!a.dueDate && !b.dueDate) return 0
				if (!a.dueDate) return 1
				if (!b.dueDate) return -1
				return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
			})
		}

		if (sortBy === 'priority') {
			return [...active].sort((a, b) => {
				return getPriorityValue(a.priority) - getPriorityValue(b.priority)
			})
		}

		return active
	}

	const activeTodos = getSortedActiveTodos()
	const completedTodos = items.filter((item) => item.completed)

	return (
		<div className="max-w-6xl mx-auto p-6">
			{/* Back Button */}
			<ElegantButton
				variant="outline"
				size="sm"
				icon={<ArrowLeftIcon className="h-5 w-5" />}
				onClick={handleBack}
				className="mb-6"
			>
				Back to Lists
			</ElegantButton>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-3 mb-4">
				<div className="bg-slate-700 rounded-md p-3 text-center">
					<p className="text-gray-400 text-xs uppercase tracking-wide">Active Tasks</p>
					<p className="text-xl font-semibold text-indigo-400 mt-1">{activeTodos.length}</p>
				</div>
				<div className="bg-slate-700 rounded-md p-3 text-center">
					<p className="text-gray-400 text-xs uppercase tracking-wide">Completed</p>
					<p className="text-xl font-semibold text-green-400 mt-1">{completedTodos.length}</p>
				</div>
			</div>

			{/* Add Item Button */}
			<div className="mb-6 flex justify-center">
				<ElegantButton
					variant="primary"
					size="lg"
					icon={<PlusIcon className="h-5 w-5" />}
					onClick={handleAddItem}
				>
					Add New Task
				</ElegantButton>
			</div>

			{/* List Container with Header and Active Tasks */}
			<div className="bg-slate-800 rounded-lg p-6 mb-6">
				{/* List Header */}
				<div className="flex justify-between items-start mb-4">
					<h1 className={`${lusitana.className} text-3xl font-bold text-white`}>{list.title}</h1>
					{list.category && (
						<div className="border-emerald-500 border-[2px] px-3 py-1 rounded-md text-white">
							{list.category}
						</div>
					)}
				</div>

				{list.description && <p className="text-gray-300 mb-4 italic">{list.description}</p>}

				<div className="flex justify-between items-center text-sm text-gray-400 mb-4">
					<p>Created: {formatDate(list.createdAt)}</p>
					<p>Updated: {formatDate(list.updatedAt)}</p>
				</div>

				{list.tags && list.tags.length > 0 && (
					<div className="mb-6 flex flex-wrap gap-2">
						{list.tags.map((tag, index) => (
							<span key={index} className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
								{tag}
							</span>
						))}
					</div>
				)}

				{/* Active Tasks inside List Container */}
				{activeTodos.length > 0 && (
					<div className="mt-4 pt-4 border-t border-slate-700">
						<div className="flex items-center justify-between mb-3">
							<h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
								Active Tasks
							</h2>
							<div className="flex items-center gap-2">
								<label htmlFor="sortBy" className="text-xs text-gray-400">
									Sort by:
								</label>
								<select
									id="sortBy"
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority')}
									className="text-xs bg-slate-700 border border-slate-600 text-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
								>
									<option value="priority">Priority</option>
									<option value="dueDate">Due Date</option>
								</select>
							</div>
						</div>
						<div className="space-y-2">
							{activeTodos.map((item) => (
								<div
									key={item.id}
									className="bg-slate-700 rounded-md p-3 hover:bg-slate-600 transition-colors"
								>
									<div className="flex items-start gap-2">
										<button
											onClick={() => handleToggleComplete(item.id)}
											className="flex-shrink-0 w-5 h-5 mt-0.5 border-2 border-gray-400 rounded hover:border-indigo-500 transition-colors"
											aria-label="Mark as complete"
										/>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="text-white text-sm font-normal">{item.text}</h3>
												{item.priority !== 'none' && (
													<span
														className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityColor(
															item.priority
														)}`}
													>
														{item.priority}
													</span>
												)}
											</div>
											{item.dueDate && (
												<p className="text-gray-400 text-xs">
													Due: {formatDueDate(item.dueDate)}
												</p>
											)}
										</div>
										<button
											onClick={() => handleDeleteClick(item.id)}
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

				{/* Empty State for Active Tasks */}
				{activeTodos.length === 0 && (
					<div className="mt-4 pt-4 border-t border-slate-700 text-center py-6">
						<p className="text-gray-400 text-sm">No active items in this list yet.</p>
						<p className="text-gray-500 text-xs mt-1">Click &quot;Add New Item&quot; to get started!</p>
					</div>
				)}
			</div>

			{/* Completed Todos */}
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
									className="bg-slate-700 rounded-md p-3 hover:bg-slate-600 transition-colors"
								>
									<div className="flex items-start gap-2">
										<button
											onClick={() => handleToggleComplete(item.id)}
											className="flex-shrink-0 w-5 h-5 mt-0.5 bg-green-500 rounded flex items-center justify-center hover:bg-green-600 transition-colors"
											aria-label="Mark as incomplete"
										>
											<CheckIcon className="w-3 h-3 text-white" />
										</button>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="text-gray-300 text-sm font-normal">{item.text}</h3>
												{item.priority !== 'none' && (
													<span
														className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityColor(
															item.priority
														)}`}
													>
														{item.priority}
													</span>
												)}
											</div>
											{item.dueDate && (
												<p className="text-gray-400 text-xs">
													Due: {formatDueDate(item.dueDate)}
												</p>
											)}
										</div>
										<button
											onClick={() => handleDeleteClick(item.id)}
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

			{/* Create Item Modal */}
			<Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Task">
				<form onSubmit={handleCreateItem} className="space-y-4">
					{/* Task Input */}
					<div>
						<label htmlFor="taskText" className="block text-sm font-medium text-gray-200 mb-2">
							Task <span className="text-red-400">*</span>
						</label>
						<input
							type="text"
							id="taskText"
							value={newItemText}
							onChange={(e) => setNewItemText(e.target.value)}
							placeholder="What needs to be done?"
							className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							required
						/>
					</div>

					{/* Due Date */}
					<div>
						<label htmlFor="dueDate" className="block text-sm font-medium text-gray-200 mb-2">
							Due Date (Optional)
						</label>
						<input
							type="date"
							id="dueDate"
							value={newItemDueDate}
							onChange={(e) => setNewItemDueDate(e.target.value)}
							className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						/>
					</div>

					{/* Due Time */}
					{newItemDueDate ? (
						<div>
							<label htmlFor="dueTime" className="block text-sm font-medium text-gray-200 mb-2">
								Due Time (Optional)
							</label>
							<input
								type="time"
								id="dueTime"
								value={newItemDueTime}
								onChange={(e) => setNewItemDueTime(e.target.value)}
								disabled={!newItemDueDate}
								className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
							/>
							{!newItemDueDate && (
								<p className="text-xs text-gray-500 mt-1">Select a due date first to set a time</p>
							)}
						</div>
					) : (
						''
					)}

					{/* Priority */}
					<div>
						<label className="block text-sm font-medium text-gray-200 mb-3">Priority</label>
						<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
							{(['urgent', 'high', 'medium', 'low', 'none'] as Priority[]).map((p) => (
								<label
									key={p}
									className={`flex items-center justify-center px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
										newItemPriority === p
											? 'border-indigo-500 bg-indigo-600/20'
											: 'border-slate-600 bg-slate-700 hover:border-slate-500'
									}`}
								>
									<input
										type="radio"
										name="priority"
										value={p}
										checked={newItemPriority === p}
										onChange={(e) => setNewItemPriority(e.target.value as Priority)}
										className="sr-only"
									/>
									<span className="text-white capitalize font-medium">{p}</span>
								</label>
							))}
						</div>
					</div>

					{/* Error Message */}
					{createError && (
						<div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
							{createError}
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex gap-3 pt-4 border-t border-slate-700">
						<button
							type="button"
							onClick={handleCloseModal}
							className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
							disabled={isCreating}
						>
							Cancel
						</button>
						<ElegantButton
							type="submit"
							variant="primary"
							size="lg"
							icon={<PlusIcon className="w-5 h-5" />}
							disabled={!newItemText.trim() || isCreating}
							isLoading={isCreating}
							className="flex-1"
						>
							{isCreating ? 'Creating...' : 'Add Task'}
						</ElegantButton>
					</div>
				</form>
			</Modal>

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
				isLoading={isDeleting}
			/>
		</div>
	)
}
