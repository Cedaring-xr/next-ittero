'use client'
import dynamic from 'next/dynamic'
import { lusitana } from '@/ui/fonts'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdArrowRightAlt } from 'react-icons/md'
import { MdNotificationsActive } from 'react-icons/md'
import Link from 'next/link'

const Banner = dynamic(() => import('@/ui/info/banner'), { ssr: false })

export type FormData = {
	date: string
	text: string
	feelOverall?: string
	surprising?: string
	accomplished?: string
}

export default function NewJournal() {
	const [sendForm, setSendForm] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [entryMode, setEntryMode] = useState<'bullets' | 'freeform'>('freeform')
	const { register, handleSubmit, reset } = useForm<FormData>()

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

	async function onSubmit(data: FormData) {
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
					text: entryText
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
		<>
			<div id="journal container">
				<h2 className={`${lusitana.className} text-[24px] md:text-[42px] text-center font-bold`}>
					Quick Journal Entry
				</h2>
				<div id="QJ-intro">
					<Banner
						message="A quick journal is a simplified style of journaling that is meant to be fast, easy, and
                                 low-pressure. Instead of writing long, detailed entries, a quick journal focuses on jotting down
                                 short notes, key thoughts, or highlights from your day."
						title="How Quick Journal Works"
						color="teal-banner"
					/>
				</div>
				<div className="banner-2">
					<h5>Tips:</h5>
					<ul className="list-disc">
						<li>Spend less than 2 minutes writing</li>
						<li>Note how the day felt overall</li>
						<li>Note anything suprising or new that you learned</li>
						<li>Note one successful thing that was acomplised</li>
						<li>Note any challenges or road-blocks</li>
					</ul>
					<div className="invisible">
						<p>toggle for free form or template</p>

						<select name="date" id="date">
							date dropdown
						</select>
					</div>
				</div>
				<div id="entry-form-container">
					<form onSubmit={handleSubmit(onSubmit)}>
						{sendForm ? (
							<div className="h-[350px] mt-24 bg-green-100 border border-green-400 rounded-md p-6">
								<h3 className="serif-font text-xl text-green-800">
									<span className="font-bold">Success! </span>
									<br />
									Your journal entry has been saved successfully.
								</h3>
							</div>
						) : (
							<div className="border-[1px] border-black p-4 m-4">
								{error && (
									<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
										<strong>Error:</strong> {error}
									</div>
								)}
								<div className="my-2">
									<label htmlFor="name" className="mb-2 block text-base font-medium">
										Date
									</label>
									<input
										type="date"
										min={getMinDate()}
										max={getTodayDate()}
										defaultValue={getTodayDate()}
										className="w-full rounded-md border border-gray-300 bg-[#f7f4fb] pt-2 px-4 text-base font-medium text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
										{...register('date', { required: true })}
									/>
								</div>
								<div className="mb-5">
									<div className="flex items-center justify-between mb-4">
										<label className="block text-base font-medium text-black">Journal Entry</label>
										<div className="flex gap-2 bg-gray-200 rounded-lg p-1">
											<button
												type="button"
												onClick={() => setEntryMode('bullets')}
												className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
													entryMode === 'bullets'
														? 'bg-[#c524a8] text-white'
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
														? 'bg-[#c524a8] text-white'
														: 'text-gray-700 hover:text-black'
												}`}
											>
												Free-form
											</button>
										</div>
									</div>

									{entryMode === 'bullets' ? (
										<div className="space-y-3">
											<div>
												<label className="text-sm text-gray-700 mb-1 block font-medium">
													How did the day feel overall?
												</label>
												<input
													type="text"
													placeholder="Quick, short description"
													className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
													{...register('feelOverall')}
												/>
											</div>
											<div>
												<label className="text-sm text-gray-700 mb-1 block font-medium">
													Anything surprising or new that you learned?
												</label>
												<input
													type="text"
													placeholder="What stands out for the day"
													className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
													{...register('surprising')}
												/>
											</div>
											<div>
												<label className="text-sm text-gray-700 mb-1 block font-medium">
													One successful thing accomplished
												</label>
												<input
													type="text"
													placeholder="Little wins are important"
													className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
													{...register('accomplished')}
												/>
											</div>
										</div>
									) : (
										<textarea
											rows={4}
											placeholder="Write your journal entry here..."
											className="w-full resize-none rounded-md border border-gray-300 bg-white pt-2 px-6 text-base font-medium text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
											{...register('text', { required: entryMode === 'freeform' })}
										></textarea>
									)}
								</div>
								<div>
									<button
										className="hover:shadow-form text-xl headline-font text-black border-[1px] border-black disabled:opacity-50 disabled:cursor-not-allowed"
										type="submit"
										disabled={loading}
									>
										<div id="button-wrapper" className="button-wrap-shadow">
											<div className="button-gradient button-clip button-shadow">
												<div className="button-clip bg-[#f7f4fb] px-4 py-0 items-center flex hover:bg-[#121313] hover:text-[#89f7fe]">
													{loading ? 'Saving...' : 'Submit'}
													<MdArrowRightAlt className="text-4xl ml-2"> </MdArrowRightAlt>
												</div>
											</div>
										</div>
									</button>
								</div>
							</div>
						)}
					</form>
				</div>
				<div className="flex gap-6 m-8 mt-20">
					<button className="hover:shadow-form text-xl  headline-font text-black border-[1px] border-black">
						<Link href="/dashboard/journal">
							<div id="button-wrapper" className="button-wrap-shadow">
								<div className="button-gradient button-clip button-shadow">
									<div className="button-clip bg-[#f7f4fb] px-4 py-0 items-center flex hover:bg-[#121313] hover:text-[#89f7fe] font-bold">
										View Past Entries
										<MdArrowRightAlt className="text-4xl ml-2"> </MdArrowRightAlt>
									</div>
								</div>
							</div>
						</Link>
					</button>
					<button className="hover:shadow-form text-xl  headline-font text-black border-[1px] border-black">
						<div id="button-wrapper" className="button-wrap-shadow">
							<div className="button-gradient button-clip button-shadow">
								<div className="button-clip bg-[#f7f4fb] px-4 py-0 items-center flex hover:bg-[#121313] hover:text-[#89f7fe] font-bold">
									Set Up Notifications
									<MdNotificationsActive className="text-4xl ml-2"></MdNotificationsActive>
								</div>
							</div>
						</div>
					</button>
				</div>
			</div>
		</>
	)
}
