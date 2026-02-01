import {
	HiOutlineClipboardList,
	HiDocumentText,
	HiOutlinePencil,
	HiOutlinePresentationChartBar,
	HiOutlineClipboardCheck,
	HiOutlineBookOpen,
	HiOutlineAnnotation
} from 'react-icons/hi'
import Link from 'next/link'
import { getAuthenticatedUser } from '@/utils/amplify-server-utils'
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon'
import CogIcon from '@heroicons/react/24/outline/CogIcon'

export default async function Dashboard() {
	const user = await getAuthenticatedUser()

	return (
		<>
			<div className="flex justify-between bg-gradient-to-br from-[#1e3a5f] to-slate-900 text-white px-6 py-4 -mx-6 -mt-6 mb-6 w-[calc(100%+3rem)]">
				<div className="flex ml-4">
					<HiDocumentText className="h-[30px] w-[30px]" /> <h1 className="md:text-xl ml-2">Your Dashboard</h1>
				</div>
				<div className="flex items-center mr-4 gap-4">
					<div className="flex items-center">
						<UserCircleIcon className="w-6 mr-1" />
						<h2 data-testid="user-display-name">{user?.name || user?.username}</h2>
					</div>
					<div className="h-6 w-px bg-slate-400"></div>
					<Link
						id="profile-settings"
						href="/dashboard/profile"
						className="hover:text-[#39CCCC] transition-colors p-1 hover:bg-slate-800 rounded"
						aria-label="Profile settings"
					>
						<CogIcon className="w-6 h-6" />
					</Link>
				</div>
			</div>
			<div className="font-lusitana font-bold grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
				<Link href="/dashboard/lists/newList">
					<div className="relative">
						<svg
							className="absolute -top-2 left-0 w-full h-2"
							viewBox="0 0 100 8"
							preserveAspectRatio="none"
						>
							<defs>
								<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
									<stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 0.9 }} />
									<stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
								</linearGradient>
							</defs>
							<rect width="100" height="8" fill="url(#grad1)" />
							<path d="M 0 4 Q 25 0, 50 4 T 100 4" stroke="#60a5fa" strokeWidth="0.5" fill="none" />
						</svg>
						<div
							className="text-gray-100 h-[80px] bg-slate-800 border-2 border-slate-600 pt-4 pl-4 flex transition-colors hover:bg-slate-700 hover:text-blue-400"
							style={{ boxShadow: '0 6px 14px rgba(0, 0, 0, 0.18), 0 2px 4px rgba(0, 0, 0, 0.12)' }}
						>
							<HiOutlineClipboardCheck className="h-[30px] w-[30px]" />
							<h3 className="text-lg mt-1 ml-3">Create New List</h3>
						</div>
					</div>
				</Link>
				<Link href="/dashboard/lists">
					<div className="relative">
						<svg
							className="absolute -top-2 left-0 w-full h-2"
							viewBox="0 0 100 8"
							preserveAspectRatio="none"
						>
							<defs>
								<linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.8 }} />
									<stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 0.9 }} />
									<stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.8 }} />
								</linearGradient>
							</defs>
							<rect width="100" height="8" fill="url(#grad2)" />
							<circle cx="10" cy="4" r="1" fill="#a78bfa" />
							<circle cx="30" cy="4" r="1" fill="#a78bfa" />
							<circle cx="50" cy="4" r="1" fill="#a78bfa" />
							<circle cx="70" cy="4" r="1" fill="#a78bfa" />
							<circle cx="90" cy="4" r="1" fill="#a78bfa" />
						</svg>
						<div
							className="text-gray-100 h-[80px] bg-slate-800 border-2 border-slate-600 pt-4 pl-4 flex transition-colors hover:bg-slate-700 hover:text-blue-400"
							style={{ boxShadow: '0 6px 14px rgba(0, 0, 0, 0.18), 0 2px 4px rgba(0, 0, 0, 0.12)' }}
						>
							<HiOutlineClipboardList className="h-[30px] w-[30px]" />
							<h3 className="text-lg mt-1 ml-3">View Active Lists</h3>
						</div>
					</div>
				</Link>
				<div className="md:col-span-2 border-t-2 border-slate-600 my-4"></div>
				<Link href="/dashboard/journal/newJournal">
					<div className="relative">
						<svg
							className="absolute -top-2 left-0 w-full h-2"
							viewBox="0 0 100 8"
							preserveAspectRatio="none"
						>
							<defs>
								<linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
									<stop offset="50%" style={{ stopColor: '#14b8a6', stopOpacity: 0.9 }} />
									<stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
								</linearGradient>
							</defs>
							<rect width="100" height="8" fill="url(#grad3)" />
							<path
								d="M 5 6 L 20 2 M 25 6 L 40 2 M 45 6 L 60 2 M 65 6 L 80 2 M 85 6 L 95 3"
								stroke="#34d399"
								strokeWidth="0.8"
								strokeLinecap="round"
							/>
						</svg>
						<div
							className="text-gray-100 h-[80px] bg-slate-800 border-2 border-slate-600 pt-4 pl-4 flex transition-colors hover:bg-slate-700 hover:text-blue-400"
							style={{ boxShadow: '0 6px 14px rgba(0, 0, 0, 0.18), 0 2px 4px rgba(0, 0, 0, 0.12)' }}
						>
							<HiOutlinePencil className="h-[30px] w-[30px]" />
							<h3 className="text-lg mt-1 ml-3">Write Quick Journal</h3>
						</div>
					</div>
				</Link>
				<Link href="/dashboard/journal">
					<div className="relative">
						<svg
							className="absolute -top-2 left-0 w-full h-2"
							viewBox="0 0 100 8"
							preserveAspectRatio="none"
						>
							<defs>
								<linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 0.8 }} />
									<stop offset="50%" style={{ stopColor: '#eab308', stopOpacity: 0.9 }} />
									<stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 0.8 }} />
								</linearGradient>
							</defs>
							<rect width="100" height="8" fill="url(#grad4)" />
							<path
								d="M 0 4 L 15 2 L 30 6 L 45 3 L 60 5 L 75 2 L 90 6 L 100 4"
								stroke="#fbbf24"
								strokeWidth="0.6"
								fill="none"
							/>
						</svg>
						<div
							className="text-gray-100 h-[80px] bg-slate-800 border-2 border-slate-600 pt-4 pl-4 flex transition-colors hover:bg-slate-700 hover:text-blue-400"
							style={{ boxShadow: '0 6px 14px rgba(0, 0, 0, 0.18), 0 2px 4px rgba(0, 0, 0, 0.12)' }}
						>
							<HiOutlineBookOpen className="h-[30px] w-[30px]" />
							<h3 className="text-lg mt-1 ml-3">View Journal Entries</h3>
						</div>
					</div>
				</Link>
				<div className="md:col-span-2 border-t-2 border-slate-600 my-4"></div>
				<Link href="/dashboard/stats">
					<div className="relative">
						<svg
							className="absolute -top-2 left-0 w-full h-2"
							viewBox="0 0 100 8"
							preserveAspectRatio="none"
						>
							<defs>
								<linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 0.8 }} />
									<stop offset="50%" style={{ stopColor: '#a855f7', stopOpacity: 0.9 }} />
									<stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 0.8 }} />
								</linearGradient>
							</defs>
							<rect width="100" height="8" fill="url(#grad5)" />
							<rect x="10" y="5" width="3" height="3" fill="#f472b6" />
							<rect x="20" y="3" width="3" height="5" fill="#f472b6" />
							<rect x="30" y="1" width="3" height="7" fill="#f472b6" />
							<rect x="45" y="4" width="3" height="4" fill="#f472b6" />
							<rect x="60" y="2" width="3" height="6" fill="#f472b6" />
							<rect x="75" y="3" width="3" height="5" fill="#f472b6" />
							<rect x="90" y="5" width="3" height="3" fill="#f472b6" />
						</svg>
						<div
							className="text-gray-100 h-[80px] bg-slate-800 border-2 border-slate-600 pt-4 pl-4 flex transition-colors hover:bg-slate-700 hover:text-blue-400"
							style={{ boxShadow: '0 6px 14px rgba(0, 0, 0, 0.18), 0 2px 4px rgba(0, 0, 0, 0.12)' }}
						>
							<HiOutlinePresentationChartBar className="h-[30px] w-[30px]" />
							<h3 className="text-lg mt-1 ml-3">Stats & Review</h3>
						</div>
					</div>
				</Link>
				<Link href="/dashboard/feedback">
					<div className="relative">
						<svg
							className="absolute -top-2 left-0 w-full h-2"
							viewBox="0 0 100 8"
							preserveAspectRatio="none"
						>
							<defs>
								<linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }} />
									<stop offset="50%" style={{ stopColor: '#0ea5e9', stopOpacity: 0.9 }} />
									<stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }} />
								</linearGradient>
							</defs>
							<rect width="100" height="8" fill="url(#grad6)" />
							<path d="M 10 4 Q 15 1, 20 4 T 30 4" stroke="#22d3ee" strokeWidth="1" fill="none" />
							<path d="M 40 4 Q 45 1, 50 4 T 60 4" stroke="#22d3ee" strokeWidth="1" fill="none" />
							<path d="M 70 4 Q 75 1, 80 4 T 90 4" stroke="#22d3ee" strokeWidth="1" fill="none" />
						</svg>
						<div
							className="text-gray-100 h-[80px] bg-slate-800 border-2 border-slate-600 pt-4 pl-4 flex transition-colors hover:bg-slate-700 hover:text-blue-400"
							style={{ boxShadow: '0 6px 14px rgba(0, 0, 0, 0.18), 0 2px 4px rgba(0, 0, 0, 0.12)' }}
						>
							<HiOutlineAnnotation className="h-[30px] w-[30px]" />
							<h3 className="text-lg mt-1 ml-3">User Feedback</h3>
						</div>
					</div>
				</Link>
			</div>
		</>
	)
}
