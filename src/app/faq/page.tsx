import React from 'react'
import Link from 'next/link'
import { HiOutlineClipboardList } from 'react-icons/hi'

export default function FAQpage() {
	return (
		<>
			<>
				<div className="font-lusitana font-bold flex flex-col p-6 gap-6">
					<Link href="/">
						<div className="bg-gray-50 text-gray-900 rounded-lg h-[100px] hover:border-2 hover:border-indigo-700 pt-6 pl-4 flex hover:text-indigo-700">
							<h3 className="md:text-xl mt-2">Home</h3>
						</div>
					</Link>
					<div className="bg-gray-50 text-gray-900 rounded-lg  hover:border-2 hover:border-indigo-700 pt-6 pl-4 flex flex-col hover:text-indigo-700">
						<h3 className="text-xl bold mb-4">Frequently Asked Questions</h3>
						<div className="flex flex-col">
							<ul>
								<li>What does it take to create an account</li>
								<li>What happens to my information</li>
								<li>How will I be contacted for notifications</li>
							</ul>
						</div>
					</div>
				</div>
			</>
		</>
	)
}
