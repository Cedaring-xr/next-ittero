'use client'
import Link from 'next/link'
import NavLinks from '@/ui/dashboard/nav-links'
import AcmeLogo from '@/ui/acme-logo'
import LogoutForm from '@/ui/dashboard/logout-form'
import clsx from 'clsx'
import { UserCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import useAuthUser from '@/app/hooks/user-auth-user'

export default function SideNav() {
	const user = useAuthUser()
	return (
		<div className="flex h-full flex-col">
			<div className="flex h-full flex-col bg-gradient-to-br from-[#1e3a5f] to-slate-900">
				<Link
					className="flex h-24 items-end justify-start bg-indigo-800 border-b-2 border-slate-600 md:h-28"
					href="/"
				>
					<div className="text-white overflow-hidden">
						<AcmeLogo />
					</div>
				</Link>
				<div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0">
					<NavLinks />
					<div className="hidden h-auto w-full grow md:block"></div>
					{user && user.isAdmin && (
						<Link
							href="/dashboard/admins"
							className={clsx(
								'flex h-[48px] grow items-center text-gray-100 justify-center gap-2 bg-slate-800 border-t-2 border-slate-600 p-3 text-sm font-medium hover:bg-slate-700 hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3 md:text-lg'
							)}
						>
							<BuildingOfficeIcon className="w-6" />
							<p className="hidden md:block">Admin Area</p>
						</Link>
					)}
					<Link
						href="/dashboard/profile"
						className={clsx(
							'flex h-[48px] grow items-center text-gray-100 justify-center gap-2 bg-slate-800 border-t-2 border-slate-600 p-3 text-sm font-medium hover:bg-slate-700 hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3 md:text-lg'
						)}
					>
						<UserCircleIcon className="w-6" />
						<p className="hidden md:block">Profile</p>
					</Link>
					<LogoutForm />
				</div>
			</div>
		</div>
	)
}
