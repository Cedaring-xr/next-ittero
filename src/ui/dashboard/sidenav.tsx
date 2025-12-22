'use client'
import Link from 'next/link'
import NavLinks from '@/ui/dashboard/nav-links'
import AcmeLogo from '@/ui/acme-logo'
import { corinthia } from '@/ui/fonts'
import LogoutForm from '@/ui/dashboard/logout-form'
import clsx from 'clsx'
import { UserCircleIcon, BuildingOfficeIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import useAuthUser from '@/app/hooks/user-auth-user'
import { useState } from 'react'

export default function SideNav() {
	const user = useAuthUser()
	const [isCollapsed, setIsCollapsed] = useState(false)

	return (
		<div
			className={clsx(
				'flex h-full flex-col transition-all duration-300 relative',
				isCollapsed ? 'w-16' : 'w-full md:w-56'
			)}
		>
			<div className="flex h-full flex-col bg-gradient-to-br from-[#1e3a5f] to-slate-900">
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="hidden md:flex items-center justify-center absolute top-0 right-0 w-8 h-8 bg-slate-800 border-2 border-slate-600 rounded text-gray-100 hover:bg-slate-700 hover:text-blue-400 transition-colors z-10"
					aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				>
					{isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
				</button>
				<Link
					className={clsx(
						'flex justify-start bg-indigo-800 border-b-2 border-slate-600 h-24 md:h-28',
						isCollapsed ? 'items-center pt-12' : 'items-end'
					)}
					href="/"
				>
					<div>
						{isCollapsed ? (
							<div className={`${corinthia.className} text-[76px] text-white leading-none ml-2`}>
								<h1>I</h1>
							</div>
						) : (
							<AcmeLogo />
						)}
					</div>
				</Link>
				<div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0">
					<NavLinks isCollapsed={isCollapsed} />
					<div className="hidden h-auto w-full grow md:block"></div>
					{user && user.isAdmin && (
						<Link
							href="/dashboard/admins"
							className={clsx(
								'flex h-[48px] grow items-center text-gray-100 justify-center gap-2 bg-slate-800 border-t-2 border-slate-600 p-3 text-sm font-medium hover:bg-slate-700 hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3 md:text-lg',
								isCollapsed ? 'md:justify-center' : ''
							)}
						>
							<BuildingOfficeIcon className="w-6" />
							{!isCollapsed && <p className="hidden md:block">Admin Area</p>}
						</Link>
					)}
					<Link
						href="/dashboard/profile"
						className={clsx(
							'flex h-[48px] grow items-center text-gray-100 justify-center gap-2 bg-slate-800 border-t-2 border-slate-600 p-3 text-sm font-medium hover:bg-slate-700 hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3 md:text-lg',
							isCollapsed ? 'md:justify-center' : ''
						)}
					>
						<UserCircleIcon className="w-6" />
						{!isCollapsed && <p className="hidden md:block">Profile</p>}
					</Link>
					<LogoutForm isCollapsed={isCollapsed} />
				</div>
			</div>
		</div>
	)
}
