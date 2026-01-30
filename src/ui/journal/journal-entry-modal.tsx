'use client'
import React, { useState, useEffect } from 'react'
import { XCircleIcon, PencilIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface FullEntry {
	entry_id: string
	date: string
	text: string
	tag?: string
	user_id?: string
	createdAt?: string
}

interface JournalEntryModalProps {
	entryId: string
	onClose: () => void
	onUpdate: (updatedEntry: FullEntry) => void
}

export default function JournalEntryModal({ entryId, onClose, onUpdate }: JournalEntryModalProps) {
	const [entry, setEntry] = useState<FullEntry | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [editing, setEditing] = useState(false)
	const [saving, setSaving] = useState(false)

	const [formDate, setFormDate] = useState('')
	const [formText, setFormText] = useState('')
	const [formTag, setFormTag] = useState('')

	useEffect(() => {
		async function fetchEntry() {
			setLoading(true)
			setError(null)
			try {
				const response = await fetch(`/api/journal/${entryId}`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				})

				if (!response.ok) {
					throw new Error('Failed to fetch journal entry')
				}

				const data = await response.json()
				const fetched: FullEntry = data.entry || data
				setEntry(fetched)
				setFormDate(fetched.date)
				setFormText(fetched.text)
				setFormTag(fetched.tag || '')
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred')
			} finally {
				setLoading(false)
			}
		}

		fetchEntry()
	}, [entryId])

	const handleSave = async () => {
		if (!entry) return
		setSaving(true)
		setError(null)

		try {
			const payload: Record<string, string> = {}
			if (formDate !== entry.date) payload.date = formDate
			if (formText !== entry.text) payload.text = formText
			if (formTag !== (entry.tag || '')) payload.tag = formTag

			const response = await fetch(`/api/journal/${entryId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Failed to update entry')
			}

			const updated: FullEntry = {
				...entry,
				date: formDate,
				text: formText,
				tag: formTag || undefined
			}

			setEntry(updated)
			setEditing(false)
			onUpdate(updated)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred')
		} finally {
			setSaving(false)
		}
	}

	const handleCancel = () => {
		if (entry) {
			setFormDate(entry.date)
			setFormText(entry.text)
			setFormTag(entry.tag || '')
		}
		setEditing(false)
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="relative w-full max-w-lg mx-4 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-5 border-b border-slate-700">
					<h3 className="text-lg font-semibold text-white">Journal Entry</h3>
					<div className="flex items-center gap-2">
						{!editing && !loading && entry && (
							<button
								onClick={() => setEditing(true)}
								className="p-1.5 rounded-lg hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
								aria-label="Edit entry"
							>
								<PencilIcon className="w-5 h-5" />
							</button>
						)}
						<button
							onClick={onClose}
							className="p-1.5 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-gray-300 transition-colors"
							aria-label="Close modal"
						>
							<XCircleIcon className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Body */}
				<div className="p-5">
					{loading && (
						<div className="flex items-center justify-center py-8">
							<div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-600 border-t-indigo-500"></div>
						</div>
					)}

					{error && (
						<div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-lg text-sm">
							{error}
						</div>
					)}

					{!loading && entry && !editing && (
						<div className="space-y-4">
							<div>
								<p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date</p>
								<p className="text-gray-100">{entry.date}</p>
							</div>
							{entry.tag && (
								<div>
									<p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tag</p>
									<span className="inline-block text-emerald-400 border border-emerald-700 px-2 py-0.5 rounded text-sm">
										{entry.tag}
									</span>
								</div>
							)}
							<div>
								<p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Entry</p>
								<p className="text-gray-200 whitespace-pre-wrap">{entry.text}</p>
							</div>
						</div>
					)}

					{!loading && entry && editing && (
						<div className="space-y-4">
							<div>
								<label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
									Date
								</label>
								<input
									type="date"
									value={formDate}
									onChange={(e) => setFormDate(e.target.value)}
									className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
								/>
							</div>
							<div>
								<label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
									Tag
								</label>
								<input
									type="text"
									value={formTag}
									onChange={(e) => setFormTag(e.target.value)}
									maxLength={30}
									placeholder="Optional tag"
									className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
								/>
							</div>
							<div>
								<label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
									Entry
								</label>
								<textarea
									value={formText}
									onChange={(e) => setFormText(e.target.value)}
									rows={6}
									className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
								/>
							</div>

							{/* Edit Actions */}
							<div className="flex justify-end gap-2 pt-2">
								<button
									onClick={handleCancel}
									className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-200 text-sm transition-colors"
								>
									<XMarkIcon className="w-4 h-4" />
									Cancel
								</button>
								<button
									onClick={handleSave}
									disabled={saving}
									className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<CheckCircleIcon className="w-4 h-4" />
									{saving ? 'Saving...' : 'Save'}
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
