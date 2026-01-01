'use client'
import Link from 'next/link'
import { ArrowLeftIcon, BookOpenIcon, ChartBarIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { lusitana } from '@/ui/fonts'
import ElegantButton from '@/ui/elegant-button'
import Banner from '@/ui/info/banner'
import JournalForm from './journalForm'
import ListsForm from './listsForm'

export default function DemoPage() {
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
						<ElegantButton
							className="border-[2px] border-slate-700 hover:border-purple-500 transition-all"
							variant="secondary"
							size="md"
							icon={<ArrowLeftIcon className="w-5 h-5" />}
						>
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
					<div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6 md:p-8">
						<div className="flex items-center gap-3 mb-4">
							<BookOpenIcon className="w-10 h-10 text-purple-400" />
							<h3 className="text-2xl md:text-3xl font-semibold text-white">Journal</h3>
						</div>
						<p className="text-gray-300 mb-6 text-lg">
							Bullet Journals are for quick daily feedback or highlights. The main goal is making short
							entries in order to make daily entries more consistent.
						</p>
						<div className="bg-slate-900 border border-slate-600 rounded p-6">
							<div id="QJ-intro"></div>
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
								<JournalForm />
							</div>
						</div>
					</div>
					{/* Lists Feature */}
					<div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6 md:p-8">
						<div className="flex items-center gap-3 mb-4">
							<ListBulletIcon className="w-10 h-10 text-purple-400" />
							<h3 className="text-2xl md:text-3xl font-semibold text-white">Lists</h3>
						</div>
						<ListsForm />
					</div>
					{/* Stats Feature */}
					<div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6 md:p-8">
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
						Sign up now to create your account and start organizing your tasks with Ittero!
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
