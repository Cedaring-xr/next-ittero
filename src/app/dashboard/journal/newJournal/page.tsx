'use client'
import Link from 'next/link'
import JournalEntryForm from './journal-entry-form'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NewJournal() {
	return (
		<main className="max-w-5xl mx-auto">
			<div className="flex mb-6 justify-between">
				<h1 className="font-lusitana text-2xl md:text-3xl font-bold text-black mb-2">
					Quick Journal Entry
				</h1>
				<Link
					href="/dashboard/journal"
					className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md transition-all duration-200 mb-6"
				>
					<ArrowLeftIcon className="h-5 w-5" />
					<span>Back to Journal</span>
				</Link>
				
			</div>
			
			<div className="bg-slate-900 border border-slate-600 rounded p-6 mb-6">
				<p className="text-gray-100 text-sm md:text-md mb-8">
					Bullet Journals are for quick daily feedback or highlights. The main goal is making short entries in
					order to make daily entries more consistent.
				</p>
				<h3 className="text-white font-semibold mb-2">Tips:</h3>
				<ul className="list-disc list-inside text-gray-300 space-y-1">
					<li>Spend less than 2 minutes writing</li>
					<li>Note how the day felt overall</li>
					<li>Note anything surprising or new that you learned</li>
					<li>Note one successful thing that was accomplished</li>
					<li>Note any challenges or road-blocks</li>
				</ul>
			</div>
			<JournalEntryForm />
		</main>
	)
}
