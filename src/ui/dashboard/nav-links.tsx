'use client'
import { UserGroupIcon, HomeIcon, DocumentDuplicateIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useAuthUser from '@/app/hooks/user-auth-user'

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.

export default function NavLinks() {
	const user = useAuthUser()
	const links = [
		{ name: 'Home', href: '/dashboard', icon: HomeIcon },
		{
			name: 'Lists',
			href: '/dashboard/lists',
			icon: DocumentDuplicateIcon
		},
		{ name: 'Feedback', href: '/dashboard/feedback', icon: UserGroupIcon }
	]

	const pathname = usePathname()

	if (user && user.isAdmin) {
		links.push({
			name: 'Admin Area',
			href: '/dashboard/admins',
			icon: BuildingOfficeIcon
		})
	}

	return (
		<>
			{links.map((link) => {
				const LinkIcon = link.icon
				return (
					<Link
						key={link.name}
						href={link.href}
						className={clsx(
							'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm text-gray-900 font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
							{
								'bg-sky-100 text-blue-600': pathname === link.href
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
