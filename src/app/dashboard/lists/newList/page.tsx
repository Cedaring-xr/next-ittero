'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'
import { useCreateList } from '@/app/hooks/use-lists-queries'

export default function NewListPage() {
	const [listName, setListName] = useState('')
	const [listDescription, setListDescription] = useState('')
	const [category, setCategory] = useState('')
	const [tags, setTags] = useState<string[]>([])
	const [currentTag, setCurrentTag] = useState('')
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()
	const createListMutation = useCreateList()

	const handleAddTag = () => {
		if (currentTag.trim() && !tags.includes(currentTag.trim())) {
			setTags([...tags, currentTag.trim()])
			setCurrentTag('')
		}
	}

	const handleRemoveTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove))
	}

	const handleTagKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddTag()
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		try {
			await createListMutation.mutateAsync({
				title: listName,
				description: listDescription,
				category: category,
				tags: tags
			})

			console.log('List created successfully')
			// Redirect back to lists page on success
			router.push('/dashboard/lists')
		} catch (err) {
			console.error('Error creating list:', err)
			setError(err instanceof Error ? err.message : 'Failed to create list')
		}
	}

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="font-lusitana text-3xl font-bold mb-6 text-slate-900">Create New List</h1>

			<form onSubmit={handleSubmit} className="bg-slate-700 rounded-lg shadow-lg p-6 space-y-6">
				{/* List Name */}
				<div>
					<label htmlFor="listName" className="block text-sm font-medium text-gray-200 mb-2">
						List Name <span className="text-red-400">*</span>
					</label>
					<input
						type="text"
						id="listTitle"
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

				{/* Category */}
				<div>
					<label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-2">
						Category (Optional)
					</label>
					<input
						type="text"
						id="category"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						placeholder="e.g., Work, Personal, Shopping"
						maxLength={100}
						className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
					<p className="text-xs text-gray-200 mt-1">{category.length}/100 characters</p>
				</div>

				{/* Tags */}
				<div>
					<label className="block text-sm font-medium text-gray-200 mb-2">Tags (Optional)</label>

					{/* Add Tag Input */}
					<div className="flex gap-2 mb-3">
						<input
							type="text"
							value={currentTag}
							onChange={(e) => setCurrentTag(e.target.value)}
							onKeyPress={handleTagKeyPress}
							placeholder="Add a tag..."
							className="flex-1 px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						/>
						<ElegantButton
							type="button"
							variant="primary"
							size="sm"
							icon={<PlusIcon className="w-5 h-5" />}
							onClick={handleAddTag}
							disabled={!currentTag.trim()}
						>
							Add
						</ElegantButton>
					</div>

					{/* Tags Display */}
					{tags.length > 0 && (
						<div className="flex flex-wrap gap-2 p-3 bg-slate-600 rounded-lg">
							{tags.map((tag, index) => (
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
					<p className="text-xs text-gray-200 mt-1">
						{tags.length} tag{tags.length !== 1 ? 's' : ''} added
					</p>
				</div>

				{/* Error Message */}
				{error && (
					<div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">{error}</div>
				)}

				{/* Action Buttons */}
				<div className="flex gap-4 pt-4 border-t border-slate-600">
					<ElegantButton
						type="submit"
						variant="primary"
						size="lg"
						fullWidth
						disabled={!listName.trim() || createListMutation.isPending}
						isLoading={createListMutation.isPending}
					>
						{createListMutation.isPending ? 'Creating...' : 'Create List'}
					</ElegantButton>
					<ElegantButton
						type="button"
						variant="secondary"
						size="lg"
						onClick={() => window.history.back()}
						disabled={createListMutation.isPending}
					>
						Cancel
					</ElegantButton>
				</div>
			</form>
		</div>
	)
}
