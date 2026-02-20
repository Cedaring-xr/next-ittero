import Link from 'next/link'
import AcmeLogo from '../../../../src/ui/acme-logo'
import clsx from 'clsx'
import {
	UserCircleIcon,
	BuildingOfficeIcon,
	ChevronLeftIcon,
	ChevronRightIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { LogoutFormWrapper } from './LogoutForm.story'

// Mock NavLinks component
function MockNavLinks({ isCollapsed }: { isCollapsed: boolean }) {
	const links = [
		{ name: 'Home', href: '/dashboard' },
		{ name: 'Lists', href: '/dashboard/lists' },
		{ name: 'Journal', href: '/dashboard/journal' },
		{ name: 'Feedback', href: '/dashboard/feedback' },
		{ name: 'Stats', href: '/dashboard/stats' }
	]

	return (
		<>
			{links.map((link) => (
				<Link
					key={link.name}
					href={link.href}
					className={clsx(
						'flex h-[48px] grow items-center justify-center gap-2 bg-slate-800 border-b-2 border-slate-600 p-3 text-sm text-gray-100 font-medium hover:bg-slate-700 hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3 md:text-lg',
						isCollapsed ? 'md:justify-center' : ''
					)}
				>
					{!isCollapsed && <p className="hidden md:block">{link.name}</p>}
				</Link>
			))}
		</>
	)
}

interface SideNavWrapperProps {
	isAdmin?: boolean
	pinnedLists?: Array<{ id: string; title: string; isSystem: boolean; isVirtual: boolean }>
}

// Mock version of SideNav without hooks and contexts
export function SideNavWrapper({ isAdmin = false, pinnedLists = [] }: SideNavWrapperProps) {
	const [isCollapsed, setIsCollapsed] = useState(false)

	return (
		<nav
			aria-label="main navigation"
			className={clsx(
				'flex h-full flex-col transition-all duration-300 relative',
				isCollapsed ? 'w-16' : 'w-full md:w-56'
			)}
		>
			<div className="flex h-full flex-col bg-gradient-to-br from-[#1e3a5f] to-slate-900">
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					data-testid="sidebar-collapse-btn"
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
							<div className="font-corinthia text-[76px] text-white leading-none ml-2">
								<h1>I</h1>
							</div>
						) : (
							<AcmeLogo />
						)}
					</div>
				</Link>
				<div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0">
					<MockNavLinks isCollapsed={isCollapsed} />

					{/* Pinned Lists Section */}
					{!isCollapsed && pinnedLists.length > 0 && (
						<div className="hidden md:block mt-8">
							<div className="px-3 mb-2 flex items-center justify-between">
								<h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
									Pinned Lists
								</h3>
								<span className="text-xs text-gray-400">{pinnedLists.length}/7</span>
							</div>
							<div data-testid="sidebar-pinned-lists">
								{pinnedLists.map((list) => (
									<Link
										key={list.id}
										href={list.isVirtual ? `/dashboard/lists/overdue` : `/dashboard/lists/${list.id}`}
										className="flex items-center gap-2 bg-slate-800 border-b-2 border-slate-600 px-3 py-2 text-sm text-gray-100 hover:bg-slate-700 hover:text-blue-400 transition-colors group relative"
									>
										<span className="truncate flex-1">{list.title}</span>
									</Link>
								))}
							</div>
						</div>
					)}

					<div className="hidden h-auto w-full grow md:block"></div>
					{isAdmin && (
						<Link
							href="/dashboard/admins"
							data-testid="sidebar-admin-btn"
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
						data-testid="sidebar-profile-btn"
						className={clsx(
							'flex h-[48px] grow items-center text-gray-100 justify-center gap-2 bg-slate-800 border-t-2 border-slate-600 p-3 text-sm font-medium hover:bg-slate-700 hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3 md:text-lg',
							isCollapsed ? 'md:justify-center' : ''
						)}
					>
						<UserCircleIcon className="w-6" />
						{!isCollapsed && <p className="hidden md:block">Profile</p>}
					</Link>
					<LogoutFormWrapper isCollapsed={isCollapsed} />
				</div>
			</div>
		</nav>
	)
}
