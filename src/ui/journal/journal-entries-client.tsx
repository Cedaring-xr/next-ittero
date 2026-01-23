'use client'
import Link from 'next/link'
import React, { useState, useEffect, useCallback } from 'react'
import { MdRefresh } from 'react-icons/md'
import { HiOutlineBookOpen } from 'react-icons/hi'
import Pagination from '@/ui/pagination'

interface JournalEntry {
	id: string
	user: string
	date: string
	text: string
	tag?: string
}

export default function JournalEntriesClient() {
	const [entries, setEntries] = useState<JournalEntry[]>([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [nextToken, setNextToken] = useState<string | null>(null)

	const fetchJournalEntries = useCallback(async (isLoadMore = false) => {
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
	}, [nextToken])

	// Auto-fetch entries on component mount
	useEffect(() => {
		fetchJournalEntries()
	}, [fetchJournalEntries])

	const handleLoadMore = () => {
		fetchJournalEntries(true)
	}

	return (
		<>
			<h3 className="text-black text-3xl mt-4 ml-4">Journal Entries</h3>
			<div className="font-lusitana font-bold p-6">
				<div className="mb-6">
					<Link className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md" href="/dashboard/journal/newJournal">Create new Entry</Link>
				</div>

				{error && <div className="bg-red-500 text-white p-4 rounded-md mb-4">Error: {error}</div>}

				{loading && entries.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12">
						<div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
						<p className="text-gray-600 text-lg">Loading your journal entries...</p>
					</div>
				) : entries.length > 0 ? (
					<div>
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
						{entries.map((entry, index) => (
							<div
								key={index}
								className="block mt-6 mb-2 p-4 bg-slate-800 border-4 border-slate-700 hover:border-indigo-500 hover:shadow-lg transition-all"
							>
								<div className="flex justify-between items-start">
									<span className="text-white text-sm">{entry.date}</span>
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
					<div className="flex flex-col items-center justify-center py-12 bg-slate-100 rounded-lg">
						<HiOutlineBookOpen className="h-16 w-16 text-gray-400 mb-4" />
						<p className="text-gray-700 text-xl mb-2">No Journal Entries Yet</p>
						<p className="text-gray-700 mb-6">Get started by creating your first entry</p>
							<Link className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md" href="/dashboard/journal/newJournal">Create new Entry</Link>
					</div>
				)}
			</div>
		</>
	)
}
