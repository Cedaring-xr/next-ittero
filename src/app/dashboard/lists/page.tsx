import { lusitana } from '@/ui/fonts'
import Link from 'next/link'
import React from 'react'
import { HiOutlineClipboardList } from 'react-icons/hi'

function page() {
	return (
		<>
			<div className={`${lusitana.className} font-bold grid grid-cols-1 md:grid-cols-2 gap-4 p-6`}>
				<Link href="/todo-list">
					<div className="bg-gray-50 text-gray-900 rounded-lg h-[100px] hover:border-2 hover:border-indigo-700 pt-6 pl-4 flex hover:text-indigo-700">
						<HiOutlineClipboardList className="h-[40px] w-[40px]" />
						<h3 className="md:text-xl mt-2">Create New List</h3>
					</div>
				</Link>
				<div className="bg-gray-50 text-gray-900 rounded-lg  hover:border-2 hover:border-indigo-700 pt-6 pl-4 flex flex-col hover:text-indigo-700">
					<h3>Current Active lists</h3>
					<div className="flex flex-col">
						<ul>
							<li>placeholder list 1</li>
							<li>placeholder list 2</li>
							<li>placeholder list 3</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	)
}

export default page
