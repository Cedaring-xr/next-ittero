"use client"
import { HiClipboardList, HiDocumentText, HiOutlinePencil, HiSearch, HiPresentationChartBar } from "react-icons/hi";
import Link from 'next/link'
import useAuthUser from '@/app/hooks/user-auth-user'
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";

export default function Dashboard() {
	const user = useAuthUser()
	return (
		<>
			<div className="flex justify-between gap-6 md:gap-12 my-4 rounded-lg bg-emerald-300 text-gray-900 px-2 py-4 w-full">
					<div className="flex ml-4">
						<HiDocumentText className="h-[30px] w-[30px]" /> <h2>Your Dashboard</h2>
					</div>
					<div className="flex mr-4">
						<UserCircleIcon className="w-6 mr-1" /><h2>{user?.name}</h2>
					</div>
			</div>
			<div className="flex justify-left gap-6 my-4 rounded-lg bg-gray-50 text-gray-900 px-2 py-4 md:w-2/5">
				<Link href="/todo-list" className="flex">
					<HiClipboardList className="h-[30px] w-[30px]" /><p>Create a List</p>
				</Link>
			</div>
			<div>
				<p>Active lists</p>
				<div>placeholder: api call to pull active lists</div>
			</div>
			<div>
				<p>completed lists</p>
				<div>placeholder: api call to pull completed lists</div>
			</div>
			<div className="flex justify-left gap-6 my-4 rounded-lg bg-gray-50 text-gray-900 px-2 py-4 md:w-2/5">
				<Link href="/journal" className="flex">
					<HiOutlinePencil className="h-[30px] w-[30px]" /> <p>Write Quick Journal</p>
				</Link>
			</div>
			<div>
				<p>View previous Journals</p>
				<div>placeholder: api call to pull previous journals</div>
			</div>
			<div className="flex justify-left gap-6 my-4 rounded-lg bg-gray-50 text-gray-900 px-2 py-4 md:w-2/5">
				<Link href="/stats" className="flex">
					<HiPresentationChartBar className="h-[30px] w-[30px]" />
					<p>Stats and Feedback</p>
				</Link>
			</div>
			<div className="flex justify-left gap-6 my-4 rounded-lg bg-gray-50 text-gray-900 px-2 py-4 md:w-2/5">
				<HiSearch className="h-[30px] w-[30px]" /><p>How To</p>
			</div>
		</>
	)
}
