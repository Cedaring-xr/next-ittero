'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { MdRefresh } from 'react-icons/md'
import Pagination from '@/ui/pagination'

interface JournalEntry {
	id: string
	user: string
	date: string
	text: string
	tag?: string
}

function JournalPage() {
	const [entries, setEntries] = useState<JournalEntry[]>([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [nextToken, setNextToken] = useState<string | null>(null)

	const fetchJournalEntries = async (isLoadMore = false) => {
		if (isLoadMore) {
			setLoadingMore(true)
		} else {
			setLoading(true)
		}
		setError(null)

		try {
			// Build URL with pagination parameters
			let url = '/api/journal?limit=10'
			if (isLoadMore && nextToken) {
				url += `&nextToken=${encodeURIComponent(nextToken)}`
			}

			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (!response.ok) {
				throw new Error('Failed to fetch journal entries')
			}

			const data = await response.json()
			const fetchedEntries = data.entries || []

			// Sort entries in reverse chronological order (newest first)
			const sortedEntries = fetchedEntries.sort((a: JournalEntry, b: JournalEntry) => {
				return new Date(b.date).getTime() - new Date(a.date).getTime()
			})

			// Update entries - append if loading more, replace if refreshing
			if (isLoadMore) {
				setEntries((prevEntries) => [...prevEntries, ...sortedEntries])
			} else {
				setEntries(sortedEntries)
			}

			// Update nextToken for pagination
			setNextToken(data.nextToken || null)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred')
			console.error('Error fetching journal entries:', err)
		} finally {
			setLoading(false)
			setLoadingMore(false)
		}
	}

	// Auto-fetch entries on component mount
	useEffect(() => {
		fetchJournalEntries()
	}, [])

	const handleLoadMore = () => {
		fetchJournalEntries(true)
	}

	return (
		<>
			<div id="overview-container" className="p-6">
				<h2 className="text-3xl font-bold mb-6 text-black">Journal Overview</h2>

				<div className="mb-6">
					<button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
						<Link href="/dashboard/journal/newJournal">Create new Entry</Link>
					</button>
				</div>

				{error && <div className="bg-red-500 text-white p-4 rounded-md mb-4">Error: {error}</div>}

				{entries.length > 0 ? (
					<div className="space-y-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-semibold text-black">Entries ({entries.length})</h3>
							<button
								onClick={() => fetchJournalEntries(false)}
								disabled={loading}
								className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
								aria-label="Refresh entries"
							>
								<MdRefresh className={`w-6 h-6 text-white ${loading ? 'animate-spin' : ''}`} />
							</button>
						</div>
						{entries.map((entry) => (
							<div
								key={entry.id}
								className="bg-slate-600 p-6 rounded-lg shadow-md border border-slate-500"
							>
								<div className="flex justify-between items-start mb-2">
									<span className="text-sm text-gray-300">{entry.date}</span>
									{entry.tag && (
										<span className="text-emerald-500 border-2 border-emerald-700 p-1 rounded-md">
											{entry.tag}
										</span>
									)}
								</div>
								<p className="text-gray-200 mt-3 whitespace-pre-wrap">{entry.text}</p>
							</div>
						))}
						<Pagination
							hasMore={!!nextToken}
							loading={loadingMore}
							onLoadMore={handleLoadMore}
							currentCount={entries.length}
						/>
					</div>
				) : (
					!loading && (
						<div className="text-black text-center py-8">
							No journal entries yet. Create your first entry to get started!
						</div>
					)
				)}
			</div>
		</>
	)
}

export default JournalPage
