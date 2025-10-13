'use client'
import {
	HiOutlineClipboardList,
	HiDocumentText,
	HiOutlinePencil,
	HiOutlineSearch,
	HiOutlinePresentationChartBar,
	HiOutlineClipboardCheck,
	HiOutlineBookOpen
} from 'react-icons/hi'
import Link from 'next/link'
import useAuthUser from '@/app/hooks/user-auth-user'
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon'
import { lusitana } from '@/ui/fonts'

export default function Dashboard() {
	const user = useAuthUser()
	return (
		<>
			<div className="flex justify-between rounded-lg bg-emerald-600 text-white px-2 py-4 w-full">
				<div className="flex ml-4">
					<HiDocumentText className="h-[30px] w-[30px]" /> <h2>Your Dashboard</h2>
				</div>
				<div className="flex mr-4">
					<UserCircleIcon className="w-6 mr-1" />
					<h2>{user?.name}</h2>
				</div>
			</div>
			<div className="h-[30px] md:h-[100px]"></div>
			<div className={`${lusitana.className} font-bold grid grid-cols-1 md:grid-cols-2 gap-4 p-6`}>
				<Link href="/dashboard/lists/newList">
					<div className="bg-gray-50 text-gray-900 rounded-lg h-[100px] hover:border-2 hover:border-indigo-700 pt-6 pl-4 flex hover:text-indigo-700">
						<HiOutlineClipboardList className="h-[40px] w-[40px]" />
						<h3 className="md:text-xl mt-2">Create New List</h3>
					</div>
				</Link>
				<Link href="/dashboard/lists">
					<div className="bg-gray-50 text-gray-900 rounded-lg h-[100px] hover:border-2 hover:border-indigo-700 pt-6 pl-4 flex hover:text-indigo-700">
						<HiOutlineClipboardCheck className="h-[40px] w-[40px]" />
						<h3 className="md:text-xl mt-2">View Active Lists</h3>
					</div>
				</Link>
				<div className="md:col-span-2 bg-indigo-700 h-[5px] mx-6 md:my-8 rounded-xl"></div>
				<Link href="/dashboard/journal/newJournal">
					<div className="bg-gray-50 text-gray-900 rounded-lg h-[100px] hover:border-2 hover:border-indigo-700 pt-6 pl-4 flex hover:text-indigo-700">
						<HiOutlinePencil className="h-[40px] w-[40px]" />
						<h3 className="md:text-xl mt-2">Write Quick Journal</h3>
					</div>
				</Link>
				<Link href="/dashboard/journal">
					<div className="bg-gray-50 text-gray-900 rounded-lg h-[100px] hover:border-2 hover:border-indigo-700 pt-6 pl-4 flex hover:text-indigo-700">
						<HiOutlineBookOpen className="h-[40px] w-[40px]" />
						<h3 className="md:text-xl mt-2">View Journal Entries</h3>
					</div>
				</Link>
				<div className="md:col-span-2 bg-indigo-700 h-[5px] mx-6 md:my-8 rounded-xl"></div>
				<Link href="/stats">
					<div className="bg-gray-50 text-gray-900 rounded-lg h-[100px] hover:border-2 hover:border-indigo-700 pt-6 pl-4 flex hover:text-indigo-700">
						<HiOutlinePresentationChartBar className="h-[40px] w-[40px]" />
						<h3 className="md:text-xl mt-2">Stats & Feedback</h3>
					</div>
				</Link>
				<Link href="/faq">
					<div className="bg-gray-50 text-gray-900 rounded-lg h-[100px] hover:border-2 hover:border-indigo-700 pt-6 pl-4 flex hover:text-indigo-700">
						<HiOutlineSearch className="h-[40px] w-[40px]" />
						<h3 className="md:text-xl mt-2">Stats & Feedback</h3>
					</div>
				</Link>
			</div>
		</>
	)
}
