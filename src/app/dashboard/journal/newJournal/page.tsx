'use client'
import dynamic from 'next/dynamic'
import { lusitana } from '@/ui/fonts'
import JournalEntryForm from './journal-entry-form'

const Banner = dynamic(() => import('@/ui/info/banner'), { ssr: false })

export default function NewJournal() {

	return (
		<div className="max-w-5xl mx-auto">
			<div className="mb-6">
				<h2 className={`${lusitana.className} text-2xl md:text-3xl font-bold text-black mb-2`}>
					Quick Journal Entry
				</h2>
				<p className="text-gray-600 text-sm">
					Bullet Journals are for quick daily feedback or highlights. The main goal is making short entries in
					order to make daily entries more consistent.
				</p>
			</div>
			<div id="QJ-intro">
				<Banner
					message="A quick journal is a simplified style of journaling that is meant to be fast, easy, and
                                 low-pressure. Instead of writing long, detailed entries, a quick journal focuses on jotting down
                                 short notes, key thoughts, or highlights from your day."
					title="How Quick Journal Works"
					color="teal-banner"
				/>
			</div>
			<div className="bg-slate-900 border border-slate-600 rounded p-6 mb-6">
				<h5 className="text-white font-semibold mb-2">Tips:</h5>
				<ul className="list-disc list-inside text-gray-300 space-y-1">
					<li>Spend less than 2 minutes writing</li>
					<li>Note how the day felt overall</li>
					<li>Note anything surprising or new that you learned</li>
					<li>Note one successful thing that was accomplished</li>
					<li>Note any challenges or road-blocks</li>
				</ul>
			</div>
			<JournalEntryForm />
		</div>
	)
}
