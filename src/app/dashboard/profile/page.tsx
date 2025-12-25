'use client'
import { lusitana } from '@/ui/fonts'
import UpdateEmailForm from '@/ui/profile-settings/update-email-form'
import UpdatePasswordForm from '@/ui/profile-settings/update-password-form'
import UpdateProfileForm from '@/ui/profile-settings/update-profile-form'
import useAuthUser from '@/app/hooks/user-auth-user'
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon'
import CogIcon from '@heroicons/react/24/outline/CogIcon'
import Link from 'next/link'

export default function Profile() {
	const user = useAuthUser()
	return (
		<main>
			<div className="flex justify-between bg-gradient-to-br from-[#1e3a5f] to-slate-900 text-white px-6 py-4 -mx-6 -mt-6 mb-6 w-[calc(100%+3rem)]">
				<div className="flex ml-4">
					<CogIcon className="h-[30px] w-[30px]" /> <h2 className="md:text-xl ml-2">Profile Settings</h2>
				</div>
				<div className="flex items-center mr-4 gap-4">
					<div className="flex items-center">
						<UserCircleIcon className="w-6 mr-1" />
						<h2>{user?.name}</h2>
					</div>
				</div>
			</div>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<UpdateProfileForm />
				<UpdatePasswordForm />
			</div>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
				<UpdateEmailForm />
			</div>
		</main>
	)
}
