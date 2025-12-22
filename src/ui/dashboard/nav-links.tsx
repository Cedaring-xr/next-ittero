'use client'
import {
	UserGroupIcon,
	HomeIcon,
	DocumentDuplicateIcon,
	BookOpenIcon,
	PresentationChartBarIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.

export default function NavLinks() {
	const links = [
		{ name: 'Home', href: '/dashboard', icon: HomeIcon },
		{
			name: 'Lists',
			href: '/dashboard/lists',
			icon: DocumentDuplicateIcon
		},
		{
			name: 'Journal',
			href: '/dashboard/journal',
			icon: BookOpenIcon
		},
		{ name: 'Feedback', href: '/dashboard/feedback', icon: UserGroupIcon },
		{
			name: 'Stats',
			href: '/dashboard/stats',
			icon: PresentationChartBarIcon
		}
	]

	const pathname = usePathname()

	return (
		<>
			{links.map((link) => {
				const LinkIcon = link.icon
				return (
					<Link
						key={link.name}
						href={link.href}
						className={clsx(
							'flex h-[48px] grow items-center justify-center gap-2 bg-slate-800 border-b-2 border-slate-600 p-3 text-sm text-gray-100 font-medium hover:bg-slate-700 hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3 md:text-lg',
							{
								'bg-slate-700 text-blue-400': pathname === link.href
							}
						)}
					>
						<LinkIcon className="w-6" />
						<p className="hidden md:block">{link.name}</p>
					</Link>
				)
			})}
		</>
	)
}
