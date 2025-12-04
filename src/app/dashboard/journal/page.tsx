'use client'
import React, { useState } from 'react'

interface JournalEntry {
	id: string
	user: string
	name: string
	date: string
	text: string
}

function JournalPage() {
	const [entries, setEntries] = useState<JournalEntry[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchJournalEntries = async () => {
		setLoading(true)
		setError(null)

		try {
			const response = await fetch('/api/journal', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (!response.ok) {
				throw new Error('Failed to fetch journal entries')
			}

			const data = await response.json()
			setEntries(data.entries || [])
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred')
			console.error('Error fetching journal entries:', err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div id="overview-container" className="p-6">
				<h2 className="text-3xl font-bold mb-6 text-black">Journal Overview</h2>

				<div className="mb-6">
					<button
						onClick={fetchJournalEntries}
						disabled={loading}
						className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						{loading ? 'Loading...' : 'View all Journal entries'}
					</button>
				</div>

				{error && <div className="bg-red-500 text-white p-4 rounded-md mb-4">Error: {error}</div>}

				{entries.length > 0 ? (
					<div className="space-y-4">
						<h3 className="text-xl font-semibold text-white mb-4">Entries ({entries.length})</h3>
						{entries.map((entry) => (
							<div
								key={entry.id}
								className="bg-slate-600 p-6 rounded-lg shadow-md border border-slate-500"
							>
								<div className="flex justify-between items-start mb-2">
									<h4 className="text-xl font-semibold text-white">{entry.name}</h4>
									<span className="text-sm text-gray-300">{entry.date}</span>
								</div>
								<p className="text-gray-200 mt-3 whitespace-pre-wrap">{entry.text}</p>
							</div>
						))}
					</div>
				) : (
					!loading && (
						<div className="text-gray-300 text-center py-8">
							No journal entries yet. Click the button above to load entries.
						</div>
					)
				)}
			</div>
		</>
	)
}

export default JournalPage
