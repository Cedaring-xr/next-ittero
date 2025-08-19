import React from 'react'
import { lusitana } from '@/ui/fonts'

function LandingInfo() {
	return (
		<div className={`${lusitana.className} mt-12 sm:max-w-[800px] mx-auto text-xl md:text-2xl md:leading-normal `}>
			<div className="mb-6">
				<p className={`text-xl md:text-2xl md:leading-normal text-center`}>
					<strong>Ittero App is simple but powerful productivity tracking application.</strong>
				</p>
			</div>
			<p className={`${lusitana.className} text-xl md:text-xl md:leading-normal`}>
				<strong>Key Features:</strong>
			</p>
			<ul className="list-disc">
				<li className="text-xl md:text-xl md:leading-normal mt-2 mb-2">
					A personal daily quick journal designed to be fast, easy, and low-pressure. Quick journal focusses
					on short notes, key thoughts, and highlights of a day.
				</li>
				<li className="text-xl md:text-xl md:leading-normal mt-2 mb-2">
					A to-do list broken out into categories. Create categories based on importance or time sensitivity.
					Work, home, family, immediate, or long-term items, the options are up to you on how you want to
					group and display your priorities.
				</li>
				<li className="text-xl md:text-xl md:leading-normal mt-2 mb-2">
					To-do list item tracking. When items are completed they are not deleted forever. They get archived
					for later reference if needed. Completed items should be celebrated not forgotten and unaccessable.
				</li>
				<li className="text-xl md:text-xl md:leading-normal mt-2 mb-2">
					Detailed feedback on how to improve. A monthly report is given on how many and what type of items
					have been acomplished. Suggestions are given on how to write better tasks, and complete more items.
				</li>
				<li className="text-xl md:text-xl md:leading-normal mt-2 mb-2">
					Fully encrypted user data ensure that what you write remains personal to you. We will never monitize
					or sell your data.
				</li>
			</ul>
			<div className="m-6"></div>
		</div>
	)
}

export default LandingInfo
