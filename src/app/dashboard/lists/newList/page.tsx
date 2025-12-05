'use client'
import React, { useState } from 'react'
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'
import { lusitana } from '@/ui/fonts'

interface TodoItem {
	id: string
	text: string
	completed: boolean
}

export default function NewListPage() {
	const [listName, setListName] = useState('')
	const [listDescription, setListDescription] = useState('')
	const [category, setCategory] = useState('General')
	const [items, setItems] = useState<TodoItem[]>([])
	const [currentItem, setCurrentItem] = useState('')
	const [showNewCategory, setShowNewCategory] = useState(false)
	const [newCategory, setNewCategory] = useState('')

	const handleAddItem = () => {
		if (currentItem.trim()) {
			const newItem: TodoItem = {
				id: Date.now().toString(),
				text: currentItem.trim(),
				completed: false
			}
			setItems([...items, newItem])
			setCurrentItem('')
		}
	}

	const handleRemoveItem = (id: string) => {
		setItems(items.filter((item) => item.id !== id))
	}

	const handleToggleItem = (id: string) => {
		setItems(
			items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
		)
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddItem()
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// TODO: Connect to API
		console.log('Form submitted:', { listName, listDescription, category, items })
	}

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className={`${lusitana.className} text-3xl font-bold mb-6 text-white`}>
				Create New List
			</h1>

			<form onSubmit={handleSubmit} className="bg-slate-700 rounded-lg shadow-lg p-6 space-y-6">
				{/* List Name */}
				<div>
					<label htmlFor="listName" className="block text-sm font-medium text-gray-200 mb-2">
						List Name <span className="text-red-400">*</span>
					</label>
					<input
						type="text"
						id="listName"
						value={listName}
						onChange={(e) => setListName(e.target.value)}
						placeholder="e.g., Grocery Shopping, Weekend Tasks"
						className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						required
					/>
				</div>

				{/* List Description */}
				<div>
					<label htmlFor="listDescription" className="block text-sm font-medium text-gray-200 mb-2">
						Description (Optional)
					</label>
					<textarea
						id="listDescription"
						value={listDescription}
						onChange={(e) => setListDescription(e.target.value)}
						placeholder="What is this list for?"
						rows={2}
						className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
					/>
				</div>

				{/* Category Selection */}
				<div>
					<label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-2">
						Category
					</label>
					<div className="flex gap-2">
						<select
							id="category"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="flex-1 px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						>
							<option value="General">General</option>
							<option value="Work">Work</option>
							<option value="Personal">Personal</option>
							<option value="Shopping">Shopping</option>
							<option value="Home">Home</option>
						</select>
						<ElegantButton
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setShowNewCategory(!showNewCategory)}
						>
							{showNewCategory ? 'Cancel' : 'New Category'}
						</ElegantButton>
					</div>

					{/* New Category Input */}
					{showNewCategory && (
						<div className="mt-3 flex gap-2">
							<input
								type="text"
								value={newCategory}
								onChange={(e) => setNewCategory(e.target.value)}
								placeholder="Enter new category name"
								className="flex-1 px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
							/>
							<ElegantButton
								type="button"
								variant="primary"
								size="sm"
								onClick={() => {
									if (newCategory.trim()) {
										setCategory(newCategory.trim())
										setNewCategory('')
										setShowNewCategory(false)
									}
								}}
							>
								Add
							</ElegantButton>
						</div>
					)}
				</div>

				{/* Todo Items */}
				<div>
					<label className="block text-sm font-medium text-gray-200 mb-2">List Items</label>

					{/* Add Item Input */}
					<div className="flex gap-2 mb-4">
						<input
							type="text"
							value={currentItem}
							onChange={(e) => setCurrentItem(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Add an item..."
							className="flex-1 px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						/>
						<ElegantButton
							type="button"
							variant="primary"
							icon={<PlusIcon className="w-5 h-5" />}
							onClick={handleAddItem}
							disabled={!currentItem.trim()}
						>
							Add
						</ElegantButton>
					</div>

					{/* Items List */}
					{items.length > 0 ? (
						<div className="space-y-2 bg-slate-600 rounded-lg p-4 max-h-96 overflow-y-auto">
							{items.map((item) => (
								<div
									key={item.id}
									className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-650 transition-colors"
								>
									<input
										type="checkbox"
										checked={item.completed}
										onChange={() => handleToggleItem(item.id)}
										className="w-5 h-5 rounded border-slate-400 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-700 cursor-pointer"
									/>
									<span
										className={`flex-1 text-white ${
											item.completed ? 'line-through text-gray-400' : ''
										}`}
									>
										{item.text}
									</span>
									<button
										type="button"
										onClick={() => handleRemoveItem(item.id)}
										className="text-red-400 hover:text-red-300 transition-colors"
									>
										<TrashIcon className="w-5 h-5" />
									</button>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8 text-gray-400 bg-slate-600 rounded-lg">
							No items added yet. Start adding items above!
						</div>
					)}

					<p className="text-sm text-gray-400 mt-2">
						{items.length} item{items.length !== 1 ? 's' : ''} added
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4 pt-4 border-t border-slate-600">
					<ElegantButton type="submit" variant="primary" size="lg" fullWidth disabled={!listName.trim()}>
						Create List
					</ElegantButton>
					<ElegantButton type="button" variant="outline" size="lg" onClick={() => window.history.back()}>
						Cancel
					</ElegantButton>
				</div>
			</form>
		</div>
	)
}
