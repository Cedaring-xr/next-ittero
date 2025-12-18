'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { lusitana } from '@/ui/fonts'
import { ArrowLeftIcon, CheckIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'

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

	// Format timestamp to DD-MM-YYYY
	const formatDate = (timestamp: string) => {
		const date = new Date(timestamp)
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear()
		return `${day}-${month}-${year}`
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

	const handleDeleteItem = async (itemId: string) => {
		try {
			const response = await fetch(`/api/lists/items/${itemId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (!response.ok) {
				throw new Error('Failed to delete item')
			}

			// Remove from local state
			setItems(items.filter((i) => i.id !== itemId))
		} catch (err) {
			console.error('Error deleting item:', err)
			setError(err instanceof Error ? err.message : 'Failed to delete item')
		}
	}

	const handleAddItem = () => {
		router.push('/dashboard/lists/items')
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

	const activeTodos = items.filter((item) => !item.completed)
	const completedTodos = items.filter((item) => item.completed)

	return (
		<div className="max-w-6xl mx-auto p-6">
			{/* Header */}
			<div className="mb-6">
				<ElegantButton
					variant="outline"
					size="sm"
					icon={<ArrowLeftIcon className="h-5 w-5" />}
					onClick={handleBack}
					className="mb-4"
				>
					Back to Lists
				</ElegantButton>

				<div className="bg-slate-800 rounded-lg p-6">
					<div className="flex justify-between items-start mb-4">
						<h1 className={`${lusitana.className} text-3xl font-bold text-white`}>{list.title}</h1>
						{list.category && (
							<div className="border-emerald-500 border-[2px] px-3 py-1 rounded-md text-white">
								{list.category}
							</div>
						)}
					</div>

					{list.description && <p className="text-gray-300 mb-4 italic">{list.description}</p>}

					<div className="flex justify-between items-center text-sm text-gray-400">
						<p>Created: {formatDate(list.createdAt)}</p>
						<p>Updated: {formatDate(list.updatedAt)}</p>
					</div>

					{list.tags && list.tags.length > 0 && (
						<div className="mt-4 flex flex-wrap gap-2">
							{list.tags.map((tag, index) => (
								<span key={index} className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
									{tag}
								</span>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-4 mb-6">
				<div className="bg-slate-700 rounded-lg p-4 text-center">
					<p className="text-gray-400 text-sm">Active Tasks</p>
					<p className="text-3xl font-bold text-indigo-400">{activeTodos.length}</p>
				</div>
				<div className="bg-slate-700 rounded-lg p-4 text-center">
					<p className="text-gray-400 text-sm">Completed</p>
					<p className="text-3xl font-bold text-green-400">{completedTodos.length}</p>
				</div>
			</div>

			{/* Add Item Button */}
			<div className="mb-6">
				<ElegantButton
					variant="primary"
					size="lg"
					icon={<PlusIcon className="h-5 w-5" />}
					onClick={handleAddItem}
					fullWidth
				>
					Add New Item
				</ElegantButton>
			</div>

			{/* Active Todos */}
			{activeTodos.length > 0 && (
				<div className="mb-6">
					<h2 className="text-xl font-semibold text-white mb-3">Active Tasks</h2>
					<div className="space-y-3">
						{activeTodos.map((item) => (
							<div
								key={item.id}
								className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
							>
								<div className="flex items-start gap-3">
									<button
										onClick={() => handleToggleComplete(item.id)}
										className="flex-shrink-0 w-6 h-6 mt-1 border-2 border-gray-400 rounded hover:border-indigo-500 transition-colors"
										aria-label="Mark as complete"
									/>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-2">
											<h3 className="text-white font-medium">{item.text}</h3>
											{item.priority !== 'none' && (
												<span
													className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
														item.priority
													)}`}
												>
													{item.priority}
												</span>
											)}
										</div>
										{item.dueDate && (
											<p className="text-gray-400 text-xs mt-1">
												Due: {new Date(item.dueDate).toLocaleDateString()}
											</p>
										)}
									</div>
									<button
										onClick={() => handleDeleteItem(item.id)}
										className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
										aria-label="Delete todo"
									>
										<TrashIcon className="w-5 h-5" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Completed Todos */}
			{completedTodos.length > 0 && (
				<div>
					<h2 className="text-xl font-semibold text-white mb-3">Completed Tasks</h2>
					<div className="space-y-3">
						{completedTodos.map((item) => (
							<div
								key={item.id}
								className="bg-slate-700 rounded-lg p-4 opacity-75 hover:opacity-100 transition-opacity"
							>
								<div className="flex items-start gap-3">
									<button
										onClick={() => handleToggleComplete(item.id)}
										className="flex-shrink-0 w-6 h-6 mt-1 bg-green-500 rounded flex items-center justify-center hover:bg-green-600 transition-colors"
										aria-label="Mark as incomplete"
									>
										<CheckIcon className="w-4 h-4 text-white" />
									</button>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-2">
											<h3 className="text-gray-400 font-medium line-through">{item.text}</h3>
											{item.priority !== 'none' && (
												<span
													className={`px-2 py-0.5 rounded-full text-xs font-medium opacity-60 ${getPriorityColor(
														item.priority
													)}`}
												>
													{item.priority}
												</span>
											)}
										</div>
										{item.dueDate && (
											<p className="text-gray-500 text-xs mt-1 line-through">
												Due: {new Date(item.dueDate).toLocaleDateString()}
											</p>
										)}
									</div>
									<button
										onClick={() => handleDeleteItem(item.id)}
										className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
										aria-label="Delete todo"
									>
										<TrashIcon className="w-5 h-5" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Empty State */}
			{items.length === 0 && (
				<div className="bg-slate-700 rounded-lg p-12 text-center">
					<p className="text-gray-400 text-lg">No items in this list yet.</p>
					<p className="text-gray-500 text-sm mt-2">Click &quot;Add New Item&quot; to get started!</p>
				</div>
			)}
		</div>
	)
}
