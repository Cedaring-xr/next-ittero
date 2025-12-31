'use client'
import Link from 'next/link'
import { ArrowLeftIcon, ListBulletIcon, BookOpenIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { lusitana } from '@/ui/fonts'
import ElegantButton from '@/ui/elegant-button'
import { MdArrowRightAlt } from 'react-icons/md'
import Banner from '@/ui/info/banner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface JournalFormData {
	name: string
	text: string
}

export default function DemoPage() {
	const [sendForm, setSendForm] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [entryMode, setEntryMode] = useState<'bullets' | 'freeform'>('bullets')
	const { register, handleSubmit, reset } = useForm<JournalFormData>()

	// Get today's date and 3 days ago in YYYY-MM-DD format
	const getTodayDate = () => {
		const today = new Date()
		return today.toISOString().split('T')[0]
	}

	const getMinDate = () => {
		const date = new Date()
		date.setDate(date.getDate() - 3)
		return date.toISOString().split('T')[0]
	}

	const onSubmit = async (data: JournalFormData) => {
		setLoading(true)
		setError(null)

		try {
			// Simulate a demo submission (no actual API call)
			await new Promise((resolve) => setTimeout(resolve, 1000))

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
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
			{/* Header */}
			<div className="bg-gradient-to-r from-[#1e3a5f] to-slate-900 border-b-2 border-slate-600 px-6 py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div>
						<h1 className={`${lusitana.className} text-2xl md:text-3xl text-white font-bold`}>
							Ittero Demo
						</h1>
						<p className="text-gray-300 text-sm mt-1">Explore features without signing up</p>
					</div>
					<Link href="/">
						<ElegantButton variant="secondary" size="md" icon={<ArrowLeftIcon className="w-5 h-5" />}>
							Back to Home
						</ElegantButton>
					</Link>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
				{/* Introduction */}
				<div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6 md:p-8 mb-8 text-center">
					<h2 className="text-xl md:text-2xl font-bold text-white mb-3">
						Welcome to the Ittero Interactive Demo
					</h2>
					<p className="text-gray-300 text-lg">
						Explore the core features below. Sign up to unlock full functionality and save your data!
					</p>
				</div>

				{/* Feature Sections */}
				<div className="space-y-8 mb-8">
					{/* Journal Feature */}
					<div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6 md:p-8 hover:border-purple-500 transition-all">
						<div className="flex items-center gap-3 mb-4">
							<BookOpenIcon className="w-10 h-10 text-purple-400" />
							<h3 className="text-2xl md:text-3xl font-semibold text-white">Journal</h3>
						</div>
						<p className="text-gray-300 mb-6 text-lg">
							Bullet Journals are for quick daily feedback or highlights. The main goal is making short
							entries in order to make daily entries more consistent.
						</p>
						<div className="bg-slate-900 border border-slate-600 rounded p-6 mb-6">
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
								<h5 className="text-white font-semibold mb-2">Tips:</h5>
								<ul className="list-disc list-inside text-gray-300 space-y-1">
									<li>Spend less than 2 minutes writing</li>
									<li>Note how the day felt overall</li>
									<li>Note anything surprising or new that you learned</li>
									<li>Note one successful thing that was accomplished</li>
									<li>Note any challenges or road-blocks</li>
								</ul>
							</div>
							<div id="entry-form-container">
								<form onSubmit={handleSubmit(onSubmit)}>
									{sendForm ? (
										<div className="h-[250px] mt-24 bg-green-100 border border-green-400 rounded-md p-6">
											<h3 className="serif-font text-xl text-green-800">
												<span className="font-bold">Success! </span>
												<br />
												Your journal entry has been saved successfully.
											</h3>
										</div>
									) : (
										<div className=" p-4 m-4">
											{error && (
												<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
													<strong>Error:</strong> {error}
												</div>
											)}
											<div className="my-2">
												<label
													htmlFor="name"
													className="mb-2 block text-base font-medium text-white"
												>
													Date
												</label>
												<input
													type="date"
													min={getMinDate()}
													max={getTodayDate()}
													defaultValue={getTodayDate()}
													className=" rounded-md border border-gray-300 bg-[#f7f4fb] pt-2 px-4 text-base font-medium text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
													{...register('name', { required: true })}
												/>
											</div>
											<div className="my-5">
												<div className="flex items-center justify-between mb-4">
													<label className="block text-base font-medium text-white">
														Journal Entry
													</label>
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
															Freeform
														</button>
													</div>
												</div>

												{entryMode === 'bullets' ? (
													<div className="space-y-3">
														<div>
															<label className="text-sm text-gray-300 mb-1 block">
																How did the day feel overall?
															</label>
															<input
																type="text"
																placeholder="Describe the overall feeling..."
																className="w-full rounded-md border border-gray-300 bg-white pt-2 px-4 text-base text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
															/>
														</div>
														<div>
															<label className="text-sm text-gray-300 mb-1 block">
																Anything surprising or new that you learned?
															</label>
															<input
																type="text"
																placeholder="New insights or surprises..."
																className="w-full rounded-md border border-gray-300 bg-white pt-2 px-4 text-base text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
															/>
														</div>
														<div>
															<label className="text-sm text-gray-300 mb-1 block">
																One successful thing accomplished
															</label>
															<input
																type="text"
																placeholder="Your accomplishment..."
																className="w-full rounded-md border border-gray-300 bg-white pt-2 px-4 text-base text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
															/>
														</div>
													</div>
												) : (
													<textarea
														rows={8}
														placeholder="Write your journal entry here..."
														className="w-full resize-none rounded-md border border-gray-300 bg-white pt-2 px-6 text-base font-medium text-gray-700 outline-none focus:border-2 focus:border-[#c524a8] focus:shadow-md"
														{...register('text', { required: true })}
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
																<MdArrowRightAlt className="text-4xl ml-2">
																	{' '}
																</MdArrowRightAlt>
															</div>
														</div>
													</div>
												</button>
											</div>
										</div>
									)}
								</form>
							</div>
						</div>
					</div>

					{/* Lists Feature */}
					<div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6 md:p-8 hover:border-indigo-500 transition-all">
						<div className="flex items-center gap-3 mb-4">
							<ListBulletIcon className="w-10 h-10 text-indigo-400" />
							<h3 className="text-2xl md:text-3xl font-semibold text-white">Lists</h3>
						</div>
						<p className="text-gray-300 mb-6 text-lg">
							Create and manage organized lists for tasks, projects, and goals.
						</p>
						<div className="bg-slate-900 border border-slate-600 rounded p-6 mb-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
								<span className="text-gray-300 text-base">Sample Task 1</span>
							</div>
							<div className="flex items-center gap-3 mb-3">
								<div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
								<span className="text-gray-300 text-base">Sample Task 2</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-5 h-5 bg-indigo-500 border-2 border-indigo-500 rounded flex items-center justify-center">
									<svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<span className="text-gray-400 line-through text-base">Completed Task</span>
							</div>
						</div>
					</div>

					{/* Stats Feature */}
					<div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6 md:p-8 hover:border-green-500 transition-all">
						<div className="flex items-center gap-3 mb-4">
							<ChartBarIcon className="w-10 h-10 text-green-400" />
							<h3 className="text-2xl md:text-3xl font-semibold text-white">Stats</h3>
						</div>
						<p className="text-gray-300 mb-6 text-lg">
							Track your productivity and view insights about your activity.
						</p>
						<div className="bg-slate-900 border border-slate-600 rounded p-6 mb-6">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
								<div className="text-center">
									<p className="text-4xl font-bold text-indigo-400">24</p>
									<p className="text-sm text-gray-400 mt-1">Tasks Completed</p>
								</div>
								<div className="text-center">
									<p className="text-4xl font-bold text-purple-400">8</p>
									<p className="text-sm text-gray-400 mt-1">Journal Entries</p>
								</div>
								<div className="text-center">
									<p className="text-4xl font-bold text-green-400">12</p>
									<p className="text-sm text-gray-400 mt-1">Active Lists</p>
								</div>
								<div className="text-center">
									<p className="text-4xl font-bold text-yellow-400">89%</p>
									<p className="text-sm text-gray-400 mt-1">Completion Rate</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Call to Action */}
				<div className="bg-gradient-to-r from-indigo-600 to-purple-600 border-2 border-indigo-500 rounded-lg p-8 text-center">
					<h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
					<p className="text-gray-100 text-lg mb-6">
						Sign up now to create your account and start organizing your life with Ittero!
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/auth/signup"
							className="inline-flex items-center justify-center gap-2.5 px-8 py-2 text-lg font-semibold rounded-lg transition-all duration-200 bg-white text-indigo-700 hover:bg-gray-100 hover:scale-105 hover:shadow-2xl active:scale-100 shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
						>
							Create Free Account
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
