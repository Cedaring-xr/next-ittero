'use client'
import Link from 'next/link'
import JournalEntryForm from './journal-entry-form'
import Banner from '@/ui/info/banner'
import ElegantButton from '@/ui/elegant-button'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import router from 'next/router'

export default function NewJournal() {

	const handleBack = () => {
		router.push('/dashboard/journal')
	}

	return (
		<main className="max-w-5xl mx-auto">
			<div className="flex mb-6 justify-between">
				<h1 className="font-lusitana text-2xl md:text-3xl font-bold text-black mb-2">
					Quick Journal Entry
				</h1>
				<ElegantButton
				variant="primary"
				size="sm"
				icon={<ArrowLeftIcon className="h-5 w-5" />}
				onClick={handleBack}
				className="mb-6"
			>
				Back to Lists
			</ElegantButton>
				
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
