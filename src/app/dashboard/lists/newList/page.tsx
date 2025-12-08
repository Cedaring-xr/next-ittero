'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ElegantButton from '@/ui/elegant-button'
import { lusitana } from '@/ui/fonts'

export default function NewListPage() {
	const [listName, setListName] = useState('')
	const [listDescription, setListDescription] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch('/api/lists', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: listName,
					description: listDescription
				})
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create list')
			}

			console.log('List created successfully:', data)
			// Redirect back to lists page on success
			router.push('/dashboard/lists')
		} catch (err) {
			console.error('Error creating list:', err)
			setError(err instanceof Error ? err.message : 'Failed to create list')
			setIsLoading(false)
		}
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

				{/* Error Message */}
				{error && (
					<div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
						{error}
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex gap-4 pt-4 border-t border-slate-600">
					<ElegantButton
						type="submit"
						variant="primary"
						size="lg"
						fullWidth
						disabled={!listName.trim() || isLoading}
						isLoading={isLoading}
					>
						{isLoading ? 'Creating...' : 'Create List'}
					</ElegantButton>
					<ElegantButton
						type="button"
						variant="outline"
						size="lg"
						onClick={() => window.history.back()}
						disabled={isLoading}
					>
						Cancel
					</ElegantButton>
				</div>
			</form>
		</div>
	)
}
