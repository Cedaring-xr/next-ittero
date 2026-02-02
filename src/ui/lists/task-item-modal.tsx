'use client'
import React, { useState, useEffect } from 'react'
import { XCircleIcon, PencilIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useQueryClient } from '@tanstack/react-query'

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

interface TaskItemModalProps {
	itemId: string
	onClose: () => void
	onUpdate: (updatedItem: TodoItem) => void
}

export default function TaskItemModal({ itemId, onClose, onUpdate }: TaskItemModalProps) {
	const queryClient = useQueryClient()
	const [item, setItem] = useState<TodoItem | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [editing, setEditing] = useState(false)
	const [saving, setSaving] = useState(false)

	const [formText, setFormText] = useState('')
	const [formPriority, setFormPriority] = useState<Priority>('none')
	const [formDueDate, setFormDueDate] = useState('')
	const [formDueTime, setFormDueTime] = useState('')
	const [formCompleted, setFormCompleted] = useState(false)

	useEffect(() => {
		async function fetchItem() {
			setLoading(true)
			setError(null)
			try {
				const response = await fetch(`/api/lists/items/${itemId}`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				})

				if (!response.ok) {
					throw new Error('Failed to fetch task item')
				}

				const data = await response.json()
				const fetched: TodoItem = data.item || data
				setItem(fetched)
				setFormText(fetched.text)
				setFormPriority(fetched.priority)
				setFormCompleted(fetched.completed)

				// Parse dueDate into date and time parts
				if (fetched.dueDate) {
					const hasTime = fetched.dueDate.includes('T')
					if (hasTime) {
						const [datePart, timePart] = fetched.dueDate.split('T')
						setFormDueDate(datePart)
						setFormDueTime(timePart.substring(0, 5)) // HH:MM
					} else {
						setFormDueDate(fetched.dueDate)
						setFormDueTime('')
					}
				} else {
					setFormDueDate('')
					setFormDueTime('')
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred')
			} finally {
				setLoading(false)
			}
		}

		fetchItem()
	}, [itemId])

	const handleSave = async () => {
		if (!item) return
		setSaving(true)
		setError(null)

		try {
			// Combine date and time if both are provided
			let dueDateTimeString = ''
			if (formDueDate) {
				if (formDueTime) {
					dueDateTimeString = `${formDueDate}T${formDueTime}:00`
				} else {
					dueDateTimeString = formDueDate
				}
			}

			const payload: Record<string, any> = {}
			if (formText !== item.text) payload.text = formText
			if (formPriority !== item.priority) payload.priority = formPriority
			if (dueDateTimeString !== item.dueDate) payload.dueDate = dueDateTimeString
			if (formCompleted !== item.completed) payload.completed = formCompleted

			const response = await fetch(`/api/lists/items/${itemId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Failed to update task')
			}

			const updated: TodoItem = {
				...item,
				text: formText,
				priority: formPriority,
				dueDate: dueDateTimeString,
				completed: formCompleted
			}

			setItem(updated)
			setEditing(false)

			// Invalidate the items query to refresh the list
			if (item.listId) {
				queryClient.invalidateQueries({ queryKey: ['items', item.listId] })
			}

			onUpdate(updated)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred')
		} finally {
			setSaving(false)
		}
	}

	const handleCancel = () => {
		if (item) {
			setFormText(item.text)
			setFormPriority(item.priority)
			setFormCompleted(item.completed)

			if (item.dueDate) {
				const hasTime = item.dueDate.includes('T')
				if (hasTime) {
					const [datePart, timePart] = item.dueDate.split('T')
					setFormDueDate(datePart)
					setFormDueTime(timePart.substring(0, 5))
				} else {
					setFormDueDate(item.dueDate)
					setFormDueTime('')
				}
			} else {
				setFormDueDate('')
				setFormDueTime('')
			}
		}
		setEditing(false)
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
		if (!dueDate) return 'No due date'

		const hasTime = dueDate.includes('T')
		if (hasTime) {
			const date = new Date(dueDate)
			const dateStr = date.toLocaleDateString()
			const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
			return `${dateStr} at ${timeStr}`
		} else {
			return new Date(dueDate).toLocaleDateString()
		}
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="relative w-full max-w-lg mx-4 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-5 border-b border-slate-700">
					<h3 className="text-lg font-semibold text-white">Task Details</h3>
					<div className="flex items-center gap-2">
						{!editing && !loading && item && (
							<button
								onClick={() => setEditing(true)}
								className="p-1.5 rounded-lg hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
								aria-label="Edit task"
							>
								<PencilIcon className="w-5 h-5" />
							</button>
						)}
						<button
							onClick={onClose}
							className="p-1.5 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-gray-300 transition-colors"
							aria-label="Close modal"
						>
							<XCircleIcon className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Body */}
				<div className="p-5">
					{loading && (
						<div className="flex items-center justify-center py-8">
							<div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-600 border-t-indigo-500"></div>
						</div>
					)}

					{error && (
						<div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-lg text-sm">
							{error}
						</div>
					)}

					{!loading && item && !editing && (
						<div className="space-y-4">
							<div>
								<p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Task</p>
								<p className="text-gray-100">{item.text}</p>
							</div>
							<div>
								<p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Priority</p>
								<span className={`inline-block px-2 py-1 rounded text-sm ${getPriorityColor(item.priority)}`}>
									{item.priority}
								</span>
							</div>
							<div>
								<p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Due Date</p>
								<p className="text-gray-100">{formatDueDate(item.dueDate)}</p>
							</div>
							<div>
								<p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Status</p>
								<p className={`text-sm ${item.completed ? 'text-green-400' : 'text-yellow-400'}`}>
									{item.completed ? 'Completed' : 'Active'}
								</p>
							</div>
						</div>
					)}

					{!loading && item && editing && (
						<div className="space-y-4">
							<div>
								<label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
									Task
								</label>
								<input
									type="text"
									value={formText}
									onChange={(e) => setFormText(e.target.value)}
									className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
								/>
							</div>
							<div>
								<label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
									Priority
								</label>
								<select
									value={formPriority}
									onChange={(e) => setFormPriority(e.target.value as Priority)}
									className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
								>
									<option value="none">None</option>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
									<option value="urgent">Urgent</option>
								</select>
							</div>
							<div>
								<label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
									Due Date
								</label>
								<input
									type="date"
									value={formDueDate}
									onChange={(e) => setFormDueDate(e.target.value)}
									className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
								/>
							</div>
							<div>
								<label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
									Due Time (Optional)
								</label>
								<input
									type="time"
									value={formDueTime}
									onChange={(e) => setFormDueTime(e.target.value)}
									className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
								/>
							</div>
							<div>
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={formCompleted}
										onChange={(e) => setFormCompleted(e.target.checked)}
										className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
									/>
									<span className="text-sm text-gray-300">Mark as completed</span>
								</label>
							</div>

							{/* Edit Actions */}
							<div className="flex justify-end gap-2 pt-2">
								<button
									onClick={handleCancel}
									className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-200 text-sm transition-colors"
								>
									<XMarkIcon className="w-4 h-4" />
									Cancel
								</button>
								<button
									onClick={handleSave}
									disabled={saving}
									className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<CheckCircleIcon className="w-4 h-4" />
									{saving ? 'Saving...' : 'Save'}
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
