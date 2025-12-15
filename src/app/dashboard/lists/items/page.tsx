'use client'
import React, { useState } from 'react'
import { PlusIcon, CheckIcon, TrashIcon, FolderPlusIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'
import { lusitana } from '@/ui/fonts'

type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

interface TodoItem {
	id: string
	text: string
	description: string
	category: string
	priority: Priority
	tags: string[]
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

	// Tags state
	const [knownTags, setKnownTags] = useState<string[]>(['urgent-task', 'low-priority', 'recurring', 'important', 'quick-win'])
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [currentTag, setCurrentTag] = useState('')

	// Form state for API submission
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleAddCategory = () => {
		if (newCategory.trim() && !categories.includes(newCategory.trim())) {
			setCategories([...categories, newCategory.trim()])
			setSelectedCategory(newCategory.trim())
			setNewCategory('')
			setIsCreatingCategory(false)
		}
	}

	const handleAddTag = () => {
		const tagValue = currentTag.trim()
		if (tagValue && !selectedTags.includes(tagValue)) {
			setSelectedTags([...selectedTags, tagValue])
			// Add to known tags if it's new
			if (!knownTags.includes(tagValue)) {
				setKnownTags([...knownTags, tagValue])
			}
			setCurrentTag('')
		}
	}

	const handleRemoveTag = (tagToRemove: string) => {
		setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
	}

	const handleSelectKnownTag = (tag: string) => {
		if (!selectedTags.includes(tag)) {
			setSelectedTags([...selectedTags, tag])
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		try {
			// Prepare data for API submission
			const todoData = {
				text: inputValue.trim(),
				description: description.trim(),
				category: selectedCategory,
				priority: priority,
				tags: selectedTags,
				completed: false
			}

			// Send POST request to API
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

			console.log('Todo item created successfully:', data)

			// Add the new todo to local state with data from API response
			const newTodo: TodoItem = {
				id: data.data.id || Date.now().toString(),
				text: todoData.text,
				description: todoData.description,
				category: todoData.category,
				priority: todoData.priority,
				tags: todoData.tags,
				completed: false,
				createdAt: new Date(data.data.createdAt || Date.now())
			}
			setTodos([...todos, newTodo])

			// Reset form
			setInputValue('')
			setDescription('')
			setPriority('none')
			setSelectedCategory('')
			setSelectedTags([])
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

					{/* Tags */}
					<div>
						<label className="block text-sm font-medium text-gray-200 mb-2">
							Tags (Optional)
						</label>

						{/* Known Tags - Quick Select */}
						{knownTags.length > 0 && (
							<div className="mb-3">
								<p className="text-xs text-gray-400 mb-2">Quick Select:</p>
								<div className="flex flex-wrap gap-2">
									{knownTags.map((tag) => (
										<button
											key={tag}
											type="button"
											onClick={() => handleSelectKnownTag(tag)}
											disabled={selectedTags.includes(tag)}
											className={`px-3 py-1 rounded-full text-sm transition-colors ${
												selectedTags.includes(tag)
													? 'bg-indigo-600 text-white cursor-not-allowed opacity-50'
													: 'bg-slate-600 text-gray-300 hover:bg-indigo-600 hover:text-white'
											}`}
										>
											{tag}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Add Tag Input */}
						<div className="flex gap-2 mb-3">
							<input
								type="text"
								value={currentTag}
								onChange={(e) => setCurrentTag(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault()
										handleAddTag()
									}
								}}
								placeholder="Add a tag or create new..."
								className="flex-1 px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							/>
							<ElegantButton
								type="button"
								variant="primary"
								size="sm"
								icon={<TagIcon className="w-5 h-5" />}
								onClick={handleAddTag}
								disabled={!currentTag.trim()}
							>
								Add
							</ElegantButton>
						</div>

						{/* Selected Tags Display */}
						{selectedTags.length > 0 && (
							<div className="flex flex-wrap gap-2 p-3 bg-slate-600 rounded-lg">
								{selectedTags.map((tag, index) => (
									<span
										key={index}
										className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-full text-sm"
									>
										{tag}
										<button
											type="button"
											onClick={() => handleRemoveTag(tag)}
											className="hover:bg-indigo-700 rounded-full p-0.5 transition-colors"
										>
											<XMarkIcon className="w-4 h-4" />
										</button>
									</span>
								))}
							</div>
						)}
						<p className="text-xs text-gray-400 mt-1">
							{selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} added
						</p>
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
							disabled={!inputValue.trim() || isLoading}
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
											{todo.category && (
												<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-gray-300">
													{todo.category}
												</span>
											)}
										</div>
										{todo.description && (
											<p className="text-gray-300 text-sm mt-1">{todo.description}</p>
										)}
										{todo.tags && todo.tags.length > 0 && (
											<div className="flex flex-wrap gap-1.5 mt-2">
												{todo.tags.map((tag, idx) => (
													<span
														key={idx}
														className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-600/80 text-white"
													>
														<TagIcon className="w-3 h-3 mr-1" />
														{tag}
													</span>
												))}
											</div>
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
										{todo.tags && todo.tags.length > 0 && (
											<div className="flex flex-wrap gap-1.5 mt-2 opacity-60">
												{todo.tags.map((tag, idx) => (
													<span
														key={idx}
														className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-600/60 text-gray-300 line-through"
													>
														<TagIcon className="w-3 h-3 mr-1" />
														{tag}
													</span>
												))}
											</div>
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
