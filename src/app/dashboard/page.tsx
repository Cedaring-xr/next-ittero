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
import CogIcon from '@heroicons/react/24/outline/CogIcon'
import { lusitana } from '@/ui/fonts'

export default function Dashboard() {
	const user = useAuthUser()
	return (
		<>
			<div className="flex justify-between bg-gradient-to-br from-[#1e3a5f] to-slate-900 text-white px-2 py-4 w-full">
				<div className="flex ml-4">
					<HiDocumentText className="h-[30px] w-[30px]" /> <h2 className="md:text-xl ml-2">Your Dashboard</h2>
				</div>
				<div className="flex items-center mr-4 gap-4">
					<div className="flex items-center">
						<UserCircleIcon className="w-6 mr-1" />
						<h2>{user?.name}</h2>
					</div>
					<div className="h-6 w-px bg-slate-400"></div>
					<Link
						href="/dashboard/settings"
						className="hover:text-[#39CCCC] transition-colors p-1 hover:bg-slate-800 rounded"
					>
						<CogIcon className="w-6 h-6" />
					</Link>
				</div>
			</div>
			<div className="h-[30px] md:h-[100px]"></div>
			<div className={`${lusitana.className} font-bold grid grid-cols-1 md:grid-cols-2 gap-4 p-6`}>
				<Link href="/dashboard/lists/newList">
					<div
						className="text-white h-[80px] rounded-2xl hover:border-[#39CCCC] hover:text-[#001F3F] pt-4 pl-4 flex transition-colors"
						style={{
							backgroundColor: 'rgba(71, 85, 105, 0.85)',
							backdropFilter: 'blur(12px)',
							WebkitBackdropFilter: 'blur(12px)',
							border: '1px solid rgba(241, 245, 249, 0.18)'
						}}
					>
						<HiOutlineClipboardList className="h-[30px] w-[30px]" />
						<h3 className="text-lg mt-1 ml-3">Create New List</h3>
					</div>
				</Link>
				<Link href="/dashboard/lists">
					<div
						className="text-white h-[80px] rounded-2xl hover:border-[#39CCCC] hover:text-[#001F3F] pt-4 pl-4 flex transition-colors"
						style={{
							backgroundColor: 'rgba(71, 85, 105, 0.85)',
							backdropFilter: 'blur(12px)',
							WebkitBackdropFilter: 'blur(12px)',
							border: '1px solid rgba(241, 245, 249, 0.18)'
						}}
					>
						<HiOutlineClipboardCheck className="h-[30px] w-[30px]" />
						<h3 className="text-lg mt-1 ml-3">View Active Lists</h3>
					</div>
				</Link>
				<div className="md:col-span-2 bg-[#39CCCC] h-[5px] mx-6 md:my-8"></div>
				<Link href="/dashboard/journal/newJournal">
					<div
						className="text-white h-[80px] rounded-2xl hover:border-[#39CCCC] hover:text-[#001F3F] pt-4 pl-4 flex transition-colors"
						style={{
							backgroundColor: 'rgba(71, 85, 105, 0.85)',
							backdropFilter: 'blur(12px)',
							WebkitBackdropFilter: 'blur(12px)',
							border: '1px solid rgba(241, 245, 249, 0.18)'
						}}
					>
						<HiOutlinePencil className="h-[30px] w-[30px]" />
						<h3 className="text-lg mt-1 ml-3">Write Quick Journal</h3>
					</div>
				</Link>
				<Link href="/dashboard/journal">
					<div
						className="text-white h-[80px] rounded-2xl hover:border-[#39CCCC] hover:text-[#001F3F] pt-4 pl-4 flex transition-colors"
						style={{
							backgroundColor: 'rgba(71, 85, 105, 0.85)',
							backdropFilter: 'blur(12px)',
							WebkitBackdropFilter: 'blur(12px)',
							border: '1px solid rgba(241, 245, 249, 0.18)'
						}}
					>
						<HiOutlineBookOpen className="h-[30px] w-[30px]" />
						<h3 className="text-lg mt-1 ml-3">View Journal Entries</h3>
					</div>
				</Link>
				<div className="md:col-span-2 bg-[#39CCCC] h-[5px] mx-6 md:my-8"></div>
				<Link href="/stats">
					<div
						className="text-white h-[80px] rounded-2xl hover:border-[#39CCCC] hover:text-[#001F3F] pt-4 pl-4 flex transition-colors"
						style={{
							backgroundColor: 'rgba(71, 85, 105, 0.85)',
							backdropFilter: 'blur(12px)',
							WebkitBackdropFilter: 'blur(12px)',
							border: '1px solid rgba(241, 245, 249, 0.18)'
						}}
					>
						<HiOutlinePresentationChartBar className="h-[30px] w-[30px]" />
						<h3 className="text-lg mt-1 ml-3">Stats & Feedback</h3>
					</div>
				</Link>
				<Link href="/faq">
					<div
						className="text-white h-[80px] rounded-2xl hover:border-[#39CCCC] hover:text-[#001F3F] pt-4 pl-4 flex transition-colors"
						style={{
							backgroundColor: 'rgba(71, 85, 105, 0.85)',
							backdropFilter: 'blur(12px)',
							WebkitBackdropFilter: 'blur(12px)',
							border: '1px solid rgba(241, 245, 249, 0.18)'
						}}
					>
						<HiOutlineSearch className="h-[30px] w-[30px]" />
						<h3 className="text-lg mt-1 ml-3">Stats & Feedback</h3>
					</div>
				</Link>
			</div>
		</>
	)
}
