'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdArrowRightAlt } from 'react-icons/md'
import ElegantButton from '@/ui/elegant-button'

export type JournalFormData = {
	date: string
	text: string
	tag?: string
	feelOverall?: string
	surprising?: string
	accomplished?: string
}

export default function JournalEntryForm() {
	const [sendForm, setSendForm] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [entryMode, setEntryMode] = useState<'bullets' | 'freeform'>('freeform')
	const { register, handleSubmit, reset } = useForm<JournalFormData>()

	// Get today's date in YYYY-MM-DD format
	const getTodayDate = () => {
		const today = new Date()
		return today.toISOString().split('T')[0]
	}

	// Get date 3 days ago in YYYY-MM-DD format
	const getMinDate = () => {
		const date = new Date()
		date.setDate(date.getDate() - 3)
		return date.toISOString().split('T')[0]
	}

	async function onSubmit(data: JournalFormData) {
		setLoading(true)
		setError(null)

		try {
			// Prepare text based on entry mode
			let entryText = ''
			if (entryMode === 'bullets') {
				// Combine bullet points into formatted entry
				const bullets = []
				if (data.feelOverall) bullets.push(`How the day felt: ${data.feelOverall}`)
				if (data.surprising) bullets.push(`What was surprising: ${data.surprising}`)
				if (data.accomplished) bullets.push(`What was accomplished: ${data.accomplished}`)
				entryText = bullets.join('\n')
			} else {
				entryText = data.text
			}

			// Send POST request to Next.js API route (which proxies to AWS API Gateway)
			// This avoids CORS issues since the server-side route can call AWS directly
			const response = await fetch('/api/journal', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					date: data.date,
					text: entryText,
					...(data.tag && { tag: data.tag.trim() })
				})
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Failed to create journal entry')
			}

			const result = await response.json()
			console.log('Journal entry created:', result)

			// Show success message
			setSendForm(true)

			// Reset form
			reset()

			// Hide success message after 5 seconds
			setTimeout(() => {
				setSendForm(false)
			}, 5000)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred')
			console.error('Error creating journal entry:', err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="min-h-[400px] flex items-start">
				{sendForm ? (
					<div className="w-full bg-green-100 border border-green-400 rounded-md p-6 mt-36">
						<h3 className="text-lg text-green-800">
							<span className="font-bold">Success! </span>
							Your journal entry has been saved successfully.
						</h3>
					</div>
				) : (
					<div className="w-full p-4">
						{error && (
							<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
								<strong>Error:</strong> {error}
							</div>
						)}
						<div className="flex justify-between">
							<div className="my-2">
								<label htmlFor="date" className="mb-2 block text-base font-medium text-black">
									Date
								</label>
								<input
									type="date"
									min={getMinDate()}
									max={getTodayDate()}
									defaultValue={getTodayDate()}
									className="rounded-md border border-gray-300 bg-[#f7f4fb] py-1.5 px-3 text-sm font-medium text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
									{...register('date', { required: true })}
								/>
							</div>
							<div className="my-2">
								<label htmlFor="tag" className="mb-2 block text-base font-medium text-black">
									Tag <span className="text-gray-500 text-sm font-normal">(optional)</span>
								</label>
								<input
									type="text"
									placeholder="e.g., highlight, low point"
									maxLength={30}
									className="rounded-md border border-gray-300 bg-[#f7f4fb] py-1.5 px-3 text-sm font-medium text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
									{...register('tag', { maxLength: 30 })}
								/>
							</div>
						</div>
						<div className="mb-5">
							<div className="flex items-center justify-between mb-4">
								<label className="block text-base font-medium text-black">Journal Entry</label>
								<div className="flex gap-2 bg-slate-200 rounded-lg p-1">
									<button
										type="button"
										onClick={() => setEntryMode('bullets')}
										className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
											entryMode === 'bullets'
												? 'bg-indigo-600 text-white'
												: 'text-gray-700 hover:text-black'
										}`}
									>
										Bullet Points
									</button>
									<button
										type="button"
										onClick={() => setEntryMode('freeform')}
										className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
											entryMode === 'freeform'
												? 'bg-indigo-600 text-white'
												: 'text-gray-700 hover:text-black'
										}`}
									>
										Free-form
									</button>
								</div>
							</div>

							{entryMode === 'bullets' ? (
								<div className="space-y-2">
									<div>
										<label className="text-sm text-gray-700 mb-1 block">
											How did the day feel overall?
										</label>
										<input
											type="text"
											placeholder="Quick, short description"
											className="w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
											{...register('feelOverall')}
										/>
									</div>
									<div>
										<label className="text-sm text-gray-700 mb-1 block">
											Anything surprising or new that you learned?
										</label>
										<input
											type="text"
											placeholder="What stands out for the day"
											className="w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
											{...register('surprising')}
										/>
									</div>
									<div>
										<label className="text-sm text-gray-700 mb-1 block">
											One successful thing accomplished
										</label>
										<input
											type="text"
											placeholder="Little wins are important"
											className="w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
											{...register('accomplished')}
										/>
									</div>
								</div>
							) : (
								<textarea
									rows={5}
									placeholder="Write your journal entry here..."
									className="w-full resize-none rounded-md border border-gray-300 bg-white pt-2 px-6 text-base font-medium text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
									{...register('text', { required: entryMode === 'freeform' })}
								></textarea>
							)}
						</div>
						<div className="flex justify-start">
							<ElegantButton
								className="border-[2px] border-slate-700 hover:border-purple-500 transition-all"
								variant="secondary"
								size="md"
								type="submit"
								disabled={loading}
								isLoading={loading}
								icon={<MdArrowRightAlt className="w-5 h-5" />}
								iconPosition="right"
							>
								{loading ? 'Saving...' : 'Submit Entry'}
							</ElegantButton>
						</div>
					</div>
				)}
			</div>
		</form>
	)
}
