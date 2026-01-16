import Link from 'next/link'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { UserCircleIcon, CogIcon } from '@heroicons/react/24/outline'
import { getAuthenticatedUser } from '@/utils/amplify-server-utils'
import JournalEntriesClient from '@/ui/journal/journal-entries-client'

export default async function JournalPage() {
	const user = await getAuthenticatedUser()

	return (
		<>
			<div className="flex justify-between bg-gradient-to-br from-[#1e3a5f] to-slate-900 text-white px-6 py-4 -mx-6 -mt-6 mb-6 w-[calc(100%+3rem)]">
				<div className="flex ml-4">
					<HiOutlineBookOpen className="h-[30px] w-[30px]" />
					<h2 data-testid="page-title" className="md:text-xl ml-2">Your Journal</h2>
				</div>
				<div className="flex items-center mr-4 gap-4">
					<div className="flex items-center">
						<UserCircleIcon className="w-6 mr-1" />
						<h2>{user?.username}</h2>
					</div>
					<div className="h-6 w-px bg-slate-400"></div>
					<Link
						id="profile-settings"
						href="/dashboard/profile"
						className="hover:text-[#39CCCC] transition-colors p-1 hover:bg-slate-800 rounded"
					>
						<CogIcon className="w-6 h-6" />
					</Link>
				</div>
			</div>
			<JournalEntriesClient />
		</>
	)
}
