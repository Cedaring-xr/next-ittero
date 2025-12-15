'use client'
import React, { useState } from 'react'
import { PlusIcon, CheckIcon, TrashIcon, FolderPlusIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'
import { lusitana } from '@/ui/fonts'

type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

interface TodoItem {
	id: string
	text: string
	description: string
	category: string
	priority: Priority
	completed: boolean
	createdAt: Date
}

export default function TodoItemsPage() {
	const [todos, setTodos] = useState<TodoItem[]>([])
	const [inputValue, setInputValue] = useState('')
	const [description, setDescription] = useState('')
	const [priority, setPriority] = useState<Priority>('none')
	const [categories, setCategories] = useState<string[]>(['Work', 'Personal', 'Shopping', 'Health'])
	const [selectedCategory, setSelectedCategory] = useState<string>('')
	const [newCategory, setNewCategory] = useState('')
	const [isCreatingCategory, setIsCreatingCategory] = useState(false)

	const handleAddCategory = () => {
		if (newCategory.trim() && !categories.includes(newCategory.trim())) {
			setCategories([...categories, newCategory.trim()])
			setSelectedCategory(newCategory.trim())
			setNewCategory('')
			setIsCreatingCategory(false)
		}
	}

	const handleAddTodo = () => {
		if (inputValue.trim()) {
			const newTodo: TodoItem = {
				id: Date.now().toString(),
				text: inputValue.trim(),
				description: description.trim(),
				category: selectedCategory,
				priority: priority,
				completed: false,
				createdAt: new Date()
			}
			setTodos([...todos, newTodo])
			setInputValue('')
			setDescription('')
			setPriority('none')
			setSelectedCategory('')
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

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddTodo()
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
				<div className="space-y-4">
					{/* Todo Title */}
					<div>
						<label htmlFor="todoTitle" className="block text-sm font-medium text-gray-200 mb-2">
							Task Title <span className="text-red-400">*</span>
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

					{/* Description */}
					<div>
						<label htmlFor="todoDescription" className="block text-sm font-medium text-gray-200 mb-2">
							Description (Optional)
						</label>
						<textarea
							id="todoDescription"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Add more details about this task..."
							rows={3}
							className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
						/>
					</div>

					{/* Category Selection */}
					<div>
						<label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-2">
							Category (Optional)
						</label>
						{!isCreatingCategory ? (
							<div className="flex gap-2">
								<select
									id="category"
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="flex-1 px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
								>
									<option value="">Select a category</option>
									{categories.map((cat) => (
										<option key={cat} value={cat}>
											{cat}
										</option>
									))}
								</select>
								<ElegantButton
									type="button"
									variant="secondary"
									size="sm"
									icon={<FolderPlusIcon className="w-5 h-5" />}
									onClick={() => setIsCreatingCategory(true)}
								>
									New
								</ElegantButton>
							</div>
						) : (
							<div className="flex gap-2">
								<input
									type="text"
									value={newCategory}
									onChange={(e) => setNewCategory(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault()
											handleAddCategory()
										}
									}}
									placeholder="Enter new category name"
									className="flex-1 px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
									autoFocus
								/>
								<ElegantButton
									type="button"
									variant="primary"
									size="sm"
									onClick={handleAddCategory}
									disabled={!newCategory.trim()}
								>
									Add
								</ElegantButton>
								<ElegantButton
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setIsCreatingCategory(false)
										setNewCategory('')
									}}
								>
									Cancel
								</ElegantButton>
							</div>
						)}
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

					{/* Submit Button */}
					<div className="pt-4 border-t border-slate-600">
						<ElegantButton
							type="button"
							variant="primary"
							size="lg"
							fullWidth
							icon={<PlusIcon className="w-5 h-5" />}
							onClick={handleAddTodo}
							disabled={!inputValue.trim()}
						>
							Add Todo Item
						</ElegantButton>
					</div>
				</div>
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
											{todo.category && (
												<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-gray-300">
													{todo.category}
												</span>
											)}
										</div>
										{todo.description && (
											<p className="text-gray-300 text-sm mt-1">{todo.description}</p>
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
											{todo.category && (
												<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-gray-400 opacity-60">
													{todo.category}
												</span>
											)}
										</div>
										{todo.description && (
											<p className="text-gray-500 text-sm mt-1 line-through">{todo.description}</p>
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
