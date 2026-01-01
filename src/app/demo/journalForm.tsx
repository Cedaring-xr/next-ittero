import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdArrowRightAlt } from 'react-icons/md'
import ElegantButton from '@/ui/elegant-button'

interface JournalFormData {
	name: string
	text: string
	feelOverall?: string
	surprising?: string
	accomplished?: string
}

interface JournalData {
	date: string
	entry: string
	isBulletFormat?: boolean
}

function JournalForm() {
	const [sendForm, setSendForm] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [entryMode, setEntryMode] = useState<'bullets' | 'freeform'>('bullets')
	const [journalData, setJournalData] = useState<JournalData[]>([])
	const { register, handleSubmit, reset } = useForm<JournalFormData>()

	// Get today's date and 3 days ago ( has to be in MM-DD-YYYY format for date picker)
	const getTodayDate = () => {
		const today = new Date()
		return today.toISOString().split('T')[0]
	}

	const getMinDate = () => {
		const date = new Date()
		date.setDate(date.getDate() - 3)
		return date.toISOString().split('T')[0]
	}

	// Format date from YYYY-MM-DD to MM-DD-YYYY for display
	const formatDate = (dateString: string) => {
		const [year, month, day] = dateString.split('-')
		return `${month}-${day}-${year}`
	}

	const onSubmit = async (data: JournalFormData) => {
		setLoading(true)
		setError(null)

		try {
			// Simulate a demo submission (no actual API call)
			await new Promise((resolve) => setTimeout(resolve, 1000))

			let entryText = ''
			let isBullet = false

			if (entryMode === 'bullets') {
				// Combine bullet points into formatted entry
				const bullets = []
				if (data.feelOverall) bullets.push(data.feelOverall)
				if (data.surprising) bullets.push(data.surprising)
				if (data.accomplished) bullets.push(data.accomplished)
				entryText = bullets.join('|BULLET|') // Use delimiter to split later
				isBullet = true
			} else {
				entryText = data.text
			}

			const newEntry: JournalData = {
				date: data.name,
				entry: entryText,
				isBulletFormat: isBullet
			}
			setJournalData([...journalData, newEntry])

			// Show success message
			setSendForm(true)

			// Reset form after 3 seconds
			setTimeout(() => {
				setSendForm(false)
				reset()
			}, 3000)
		} catch (err) {
			setError('An error occurred while submitting your entry. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto">
				<div className="min-h-[400px] flex items-start">
					{sendForm ? (
						<div className="w-full bg-green-100 border border-green-400 rounded-md p-6 mt-36">
							<h3 className="text-lg text-green-800">
								<span className="font-bold">Success! </span>
								Your journal entry has been saved successfully.
							</h3>
						</div>
					) : (
						<div className="w-full p-4 m-4">
							{error && (
								<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
									<strong>Error:</strong> {error}
								</div>
							)}
							<div className="my-2">
								<label htmlFor="name" className="mb-2 block text-base font-medium text-white">
									Date
								</label>
								<input
									type="date"
									min={getMinDate()}
									max={getTodayDate()}
									defaultValue={getTodayDate()}
									className="rounded-md border border-gray-300 bg-[#f7f4fb] py-1.5 px-3 text-sm font-medium text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
									{...register('name', { required: true })}
								/>
							</div>
							<div className="my-5">
								<div className="flex items-center justify-between mb-4">
									<label className="block text-base font-medium text-white">Journal Entry</label>
									<div className="flex gap-2 bg-slate-700 rounded-lg p-1">
										<button
											type="button"
											onClick={() => setEntryMode('bullets')}
											className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
												entryMode === 'bullets'
													? 'bg-indigo-600 text-white'
													: 'text-gray-300 hover:text-white'
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
													: 'text-gray-300 hover:text-white'
											}`}
										>
											Free-form
										</button>
									</div>
								</div>

								{entryMode === 'bullets' ? (
									<div className="space-y-2">
										<div>
											<label className="text-sm text-gray-300 mb-1 block">
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
											<label className="text-sm text-gray-300 mb-1 block">
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
											<label className="text-sm text-gray-300 mb-1 block">
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
										{...register('text', { required: true })}
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
			{!journalData ? (
				''
			) : (
				<div id="journal-entries-container">
					{journalData.map((data, index) => (
						<div key={index} className="text-white p-4 border-2 border-purple-400 my-1">
							<div className="text-gray-300 text-sm mb-2">{formatDate(data.date)}</div>
							{data.isBulletFormat ? (
								<ul className="list-disc list-inside space-y-1">
									{data.entry.split('|BULLET|').map((bullet, i) => (
										<li key={i} className="text-gray-200">
											{bullet}
										</li>
									))}
								</ul>
							) : (
								<div className="text-gray-200">{data.entry}</div>
							)}
						</div>
					))}
				</div>
			)}
		</>
	)
}

export default JournalForm
