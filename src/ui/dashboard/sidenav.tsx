'use client'
import Link from 'next/link'
import NavLinks from '@/ui/dashboard/nav-links'
import AcmeLogo from '@/ui/acme-logo'
import { corinthia } from '@/ui/fonts'
import LogoutForm from '@/ui/dashboard/logout-form'
import clsx from 'clsx'
import {
	UserCircleIcon,
	BuildingOfficeIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	XMarkIcon
} from '@heroicons/react/24/outline'
import { BsPinAngle } from 'react-icons/bs'
import useAuthUser from '@/app/hooks/user-auth-user'
import { usePinnedLists } from '@/contexts/PinnedListsContext'
import { useState } from 'react'
import ConfirmModal from '@/ui/confirm-modal'

export default function SideNav() {
	const user = useAuthUser()
	const [isCollapsed, setIsCollapsed] = useState(false)
	const { pinnedLists, unpinList } = usePinnedLists()
	const [unpinConfirmOpen, setUnpinConfirmOpen] = useState(false)
	const [listToUnpin, setListToUnpin] = useState<{ id: string; title: string } | null>(null)

	const handleUnpinClick = (e: React.MouseEvent, listId: string, listTitle: string) => {
		e.preventDefault()
		e.stopPropagation()
		setListToUnpin({ id: listId, title: listTitle })
		setUnpinConfirmOpen(true)
	}

	const handleUnpinConfirm = async () => {
		if (!listToUnpin) return

		try {
			await unpinList(listToUnpin.id)
			setUnpinConfirmOpen(false)
			setListToUnpin(null)
		} catch (error) {
			console.error('Error unpinning list:', error)
		}
	}

	const handleUnpinCancel = () => {
		setUnpinConfirmOpen(false)
		setListToUnpin(null)
	}

	return (
		<nav aria-label='main navigation'
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

					{/* Pinned Lists Section */}
					{!isCollapsed && pinnedLists.length > 0 && (
						<div className="hidden md:block mt-8">
							<div className="px-3 mb-2">
								<h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
									Pinned Lists
								</h3>
							</div>
							<div data-testid="sidebar-pinned-lists">
								{pinnedLists.map((list) => (
									<Link
										key={list.id}
										href={`/dashboard/lists/${list.id}`}
										className="flex items-center gap-2 bg-slate-800 border-b-2 border-slate-600 px-3 py-2 text-sm text-gray-100 hover:bg-slate-700 hover:text-blue-400 transition-colors group relative"
									>
										<BsPinAngle className="w-5 h-5 flex-shrink-0" />
										<span className="truncate flex-1">{list.title}</span>
										<button
											onClick={(e) => handleUnpinClick(e, list.id, list.title)}
											className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-600 rounded"
											title="Unpin from sidebar"
										>
											<XMarkIcon className="w-4 h-4" />
										</button>
									</Link>
								))}
							</div>
						</div>
					)}

					<ConfirmModal
						isOpen={unpinConfirmOpen}
						onClose={handleUnpinCancel}
						onConfirm={handleUnpinConfirm}
						title="Unpin List"
						message={`Are you sure you want to unpin "${listToUnpin?.title}" from the sidebar?`}
						confirmText="Unpin"
						cancelText="Cancel"
						variant="warning"
					/>

					<div className="hidden h-auto w-full grow md:block"></div>
					{user && user.isAdmin && (
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
					<LogoutForm isCollapsed={isCollapsed} />
				</div>
			</div>
		</nav>
	)
}
