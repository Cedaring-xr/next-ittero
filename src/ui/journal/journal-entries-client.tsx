'use client'
import Link from 'next/link'
import React, { useState, useEffect, useCallback } from 'react'
import { MdRefresh } from 'react-icons/md'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { TrashIcon } from '@heroicons/react/24/outline'
import Pagination from '@/ui/pagination'
import JournalEntryModal from '@/ui/journal/journal-entry-modal'
import ConfirmModal from '@/ui/confirm-modal'

interface JournalEntry {
	entry_id: string
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
	const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)
	const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
	const [deleting, setDeleting] = useState(false)
	const [totalCount, setTotalCount] = useState<number | null>(null)

	const fetchJournalEntries = useCallback(
		async (isLoadMore = false, tokenToUse: string | null = null) => {
			if (isLoadMore) {
				setLoadingMore(true)
			} else {
				setLoading(true)
			}
			setError(null)

			try {
				// Build URL with pagination parameters
				let url = '/api/journal?limit=10'
				if (isLoadMore && tokenToUse) {
					url += `&nextToken=${encodeURIComponent(tokenToUse)}`
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
		},
		[]
	)

	const fetchTotalCount = useCallback(async () => {
		try {
			const response = await fetch('/api/journal/count', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			})
			if (response.ok) {
				const data = await response.json()
				setTotalCount(data.count)
			}
		} catch (err) {
			console.error('Error fetching journal count:', err)
		}
	}, [])

	// Auto-fetch entries and total count on component mount
	useEffect(() => {
		fetchJournalEntries()
		fetchTotalCount()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleLoadMore = () => {
		fetchJournalEntries(true, nextToken)
	}

	const handleModalUpdate = (updated: { date: string; text: string; tag?: string }) => {
		setEntries((prev) =>
			prev.map((e) =>
				e.entry_id === selectedEntryId
					? { ...e, date: updated.date, text: updated.text, tag: updated.tag }
					: e
			)
		)
	}

	const handleDeleteClick = (e: React.MouseEvent, entryId: string) => {
		e.stopPropagation()
		setEntryToDelete(entryId)
	}

	const handleDeleteConfirm = async () => {
		if (!entryToDelete) return
		setDeleting(true)

		try {
			const response = await fetch(`/api/journal/${entryToDelete}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' }
			})

			if (!response.ok) {
				throw new Error('Failed to delete journal entry')
			}

			setEntries((prev) => prev.filter((e) => e.entry_id !== entryToDelete))
			setTotalCount((prev) => (prev !== null ? prev - 1 : null))
			setEntryToDelete(null)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete entry')
			setEntryToDelete(null)
		} finally {
			setDeleting(false)
		}
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
							<h3 className="text-xl font-semibold text-black">
								Total Journal Entries ({totalCount !== null ? totalCount : entries.length})
							</h3>
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
								onClick={() => setSelectedEntryId(entry.entry_id)}
								className="block mt-6 mb-2 p-4 bg-slate-800 border-4 border-slate-700 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer"
							>
								<div className="flex justify-between items-start">
									<span className="text-white text-sm">{entry.date}</span>
									<div className="flex items-center gap-2">
										{entry.tag && (
											<span className="text-emerald-500 border-2 border-emerald-700 p-1 rounded-md">
												{entry.tag}
											</span>
										)}
										<button
											onClick={(e) => handleDeleteClick(e, entry.entry_id)}
											className="p-1.5 rounded hover:bg-slate-700 text-gray-400 hover:text-red-400 transition-colors"
											aria-label="Delete entry"
										>
											<TrashIcon className="w-4 h-4" />
										</button>
									</div>
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

			{selectedEntryId && (
				<JournalEntryModal
					entryId={selectedEntryId}
					onClose={() => setSelectedEntryId(null)}
					onUpdate={handleModalUpdate}
				/>
			)}

			<ConfirmModal
				isOpen={!!entryToDelete}
				onClose={() => setEntryToDelete(null)}
				onConfirm={handleDeleteConfirm}
				title="Delete Journal Entry"
				message="Are you sure you want to delete this journal entry? This action cannot be undone."
				confirmText="Delete"
				variant="danger"
				isLoading={deleting}
			/>
		</>
	)
}
