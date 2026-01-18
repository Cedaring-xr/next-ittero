'use client'
import React, { useState, useEffect } from 'react'
import { PlusIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'
import { lusitana } from '@/ui/fonts'

type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

interface TodoItem {
	id: string
	text: string
	listId: string
	priority: Priority
	dueDate: string
	completed: boolean
	createdAt: Date
}

interface ListEntry {
	id: string
	title: string
	description: string
}

export default function TodoItemsPage() {
	const [todos, setTodos] = useState<TodoItem[]>([])
	const [inputValue, setInputValue] = useState('')
	const [priority, setPriority] = useState<Priority>('none')
	const [dueDate, setDueDate] = useState('')

	// Lists state
	const [userLists, setUserLists] = useState<ListEntry[]>([])
	const [selectedList, setSelectedList] = useState<string>('')

	// Form state for API submission
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Fetch user's lists
	const fetchLists = async () => {
		try {
			const response = await fetch('/api/lists', {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch lists')
			}

			setUserLists(data.lists || [])
		} catch (err) {
			console.error('Error fetching lists:', err)
		}
	}

	// Fetch lists on component mount
	useEffect(() => {
		fetchLists()
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		try {
			// Prepare data for API submission
			const todoData = {
				text: inputValue.trim(),
				listId: selectedList,
				priority: priority,
				dueDate: dueDate,
				completed: false
			}

			// Send POST request to API
			const response = await fetch('/api/lists/items', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(todoData)
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create todo item')
			}

			console.log('Todo item created successfully:', data)

			// Add the new todo to local state with data from API response
			const newTodo: TodoItem = {
				id: data.data.id || Date.now().toString(),
				text: todoData.text,
				listId: todoData.listId,
				priority: todoData.priority,
				dueDate: todoData.dueDate,
				completed: false,
				createdAt: new Date(data.data.createdAt || Date.now())
			}
			setTodos([...todos, newTodo])

			// Reset form
			setInputValue('')
			setPriority('none')
			setDueDate('')
			setSelectedList('')
		} catch (err) {
			console.error('Error creating todo:', err)
			setError(err instanceof Error ? err.message : 'Failed to create todo item')
		} finally {
			setIsLoading(false)
		}
	}

	const handleToggleTodo = (id: string) => {
		setTodos(
			todos.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			)
		)
	}

	const handleDeleteTodo = (id: string) => {
		setTodos(todos.filter((todo) => todo.id !== id))
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

	const activeTodos = todos.filter((todo) => !todo.completed)
	const completedTodos = todos.filter((todo) => todo.completed)

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className={`${lusitana.className} text-3xl font-bold mb-6 text-white`}>
				Todo Items
			</h1>

			{/* Add Todo Form */}
			<div className="bg-slate-700 rounded-lg shadow-lg p-6 mb-6">
				<h2 className="text-xl font-semibold text-white mb-4">Add New Todo Item</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Task */}
					<div>
						<label htmlFor="todoTitle" className="block text-sm font-medium text-gray-200 mb-2">
							Task <span className="text-red-400">*</span>
						</label>
						<input
							type="text"
							id="todoTitle"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							placeholder="What needs to be done?"
							className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						/>
					</div>

					{/* List Selection */}
					<div>
						<label htmlFor="listSelect" className="block text-sm font-medium text-gray-200 mb-2">
							List <span className="text-red-400">*</span>
						</label>
						<select
							id="listSelect"
							value={selectedList}
							onChange={(e) => setSelectedList(e.target.value)}
							className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							required
						>
							<option value="">Select a list</option>
							{userLists.map((list) => (
								<option key={list.id} value={list.id}>
									{list.title}
								</option>
							))}
						</select>
						{userLists.length === 0 && (
							<p className="text-xs text-gray-400 mt-1">
								No lists available. Create a list first.
							</p>
						)}
					</div>

					{/* Due Date */}
					<div>
						<label htmlFor="dueDate" className="block text-sm font-medium text-gray-200 mb-2">
							Due Date (Optional)
						</label>
						<input
							type="date"
							id="dueDate"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						/>
					</div>

					{/* Priority */}
					<div>
						<label className="block text-sm font-medium text-gray-200 mb-3">
							Priority
						</label>
						<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
							{(['urgent', 'high', 'medium', 'low', 'none'] as Priority[]).map((p) => (
								<label
									key={p}
									className={`flex items-center justify-center px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
										priority === p
											? 'border-indigo-500 bg-indigo-600/20'
											: 'border-slate-500 bg-slate-600 hover:border-slate-400'
									}`}
								>
									<input
										type="radio"
										name="priority"
										value={p}
										checked={priority === p}
										onChange={(e) => setPriority(e.target.value as Priority)}
										className="sr-only"
									/>
									<span className="text-white capitalize font-medium">{p}</span>
								</label>
							))}
						</div>
					</div>

					{/* Error Message */}
					{error && (
						<div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
							{error}
						</div>
					)}

					{/* Submit Button */}
					<div className="pt-4 border-t border-slate-600">
						<ElegantButton
							type="submit"
							variant="primary"
							size="lg"
							fullWidth
							icon={<PlusIcon className="w-5 h-5" />}
							disabled={!inputValue.trim() || !selectedList || isLoading}
							isLoading={isLoading}
						>
							{isLoading ? 'Creating...' : 'Add Todo Item'}
						</ElegantButton>
					</div>
				</form>
			</div>

			{/* Todo Stats */}
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

			{/* Active Todos */}
			{activeTodos.length > 0 && (
				<div className="mb-6">
					<h2 className="text-xl font-semibold text-white mb-3">Active Tasks</h2>
					<div className="space-y-3">
						{activeTodos.map((todo) => (
							<div
								key={todo.id}
								className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
							>
								<div className="flex items-start gap-3">
									<button
										onClick={() => handleToggleTodo(todo.id)}
										className="flex-shrink-0 w-6 h-6 mt-1 border-2 border-gray-400 rounded hover:border-indigo-500 transition-colors"
										aria-label="Mark as complete"
									/>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-2">
											<h3 className="text-white font-medium">{todo.text}</h3>
											{todo.priority !== 'none' && (
												<span
													className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
														todo.priority
													)}`}
												>
													{todo.priority}
												</span>
											)}
										</div>
										{todo.dueDate && (
											<p className="text-gray-400 text-xs mt-1">
												Due: {new Date(todo.dueDate).toLocaleDateString()}
											</p>
										)}
									</div>
									<button
										onClick={() => handleDeleteTodo(todo.id)}
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
						{completedTodos.map((todo) => (
							<div
								key={todo.id}
								className="bg-slate-700 rounded-lg p-4 opacity-75 hover:opacity-100 transition-opacity"
							>
								<div className="flex items-start gap-3">
									<button
										onClick={() => handleToggleTodo(todo.id)}
										className="flex-shrink-0 w-6 h-6 mt-1 bg-green-500 rounded flex items-center justify-center hover:bg-green-600 transition-colors"
										aria-label="Mark as incomplete"
									>
										<CheckIcon className="w-4 h-4 text-white" />
									</button>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-2">
											<h3 className="text-gray-400 font-medium line-through">{todo.text}</h3>
											{todo.priority !== 'none' && (
												<span
													className={`px-2 py-0.5 rounded-full text-xs font-medium opacity-60 ${getPriorityColor(
														todo.priority
													)}`}
												>
													{todo.priority}
												</span>
											)}
										</div>
										{todo.dueDate && (
											<p className="text-gray-500 text-xs mt-1 line-through">
												Due: {new Date(todo.dueDate).toLocaleDateString()}
											</p>
										)}
									</div>
									<button
										onClick={() => handleDeleteTodo(todo.id)}
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
			{todos.length === 0 && (
				<div className="bg-slate-700 rounded-lg p-12 text-center">
					<p className="text-gray-400 text-lg">No todo items yet.</p>
					<p className="text-gray-500 text-sm mt-2">Add your first task above to get started!</p>
				</div>
			)}
		</div>
	)
}
