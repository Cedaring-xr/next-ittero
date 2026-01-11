'use client'
import UpdateEmailForm from '@/ui/profile-settings/update-email-form'
import UpdatePasswordForm from '@/ui/profile-settings/update-password-form'
import UpdateProfileForm from '@/ui/profile-settings/update-profile-form'
import ThemeSettingsForm from '@/ui/profile-settings/theme-settings-form'
import DateTimeSettingsForm from '@/ui/profile-settings/datetime-settings-form'
import NotificationSettingsForm from '@/ui/profile-settings/notification-settings-form'
import DeleteAccountForm from '@/ui/profile-settings/delete-account-form'
import useAuthUser from '@/app/hooks/user-auth-user'
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon'
import CogIcon from '@heroicons/react/24/outline/CogIcon'

export default function Profile() {
	const user = useAuthUser()
	return (
		<main>
			<div className="flex justify-between bg-gradient-to-br from-[#1e3a5f] to-slate-900 text-white px-6 py-4 -mx-6 -mt-6 mb-6 w-[calc(100%+3rem)]">
				<div className="flex ml-4">
					<CogIcon className="h-[30px] w-[30px]" /> <h2 data-testid="page-title" className="md:text-xl ml-2">Profile Settings</h2>
				</div>
				<div className="flex items-center mr-4 gap-4">
					<div className="flex items-center">
						<UserCircleIcon className="w-6 mr-1" />
						<h2>{user?.name}</h2>
					</div>
				</div>
			</div>
			{/* Account Information */}
			<div className="mb-6">
				<h3 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<UpdateProfileForm />
					<UpdatePasswordForm />
				</div>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
				<UpdateEmailForm />
			</div>

			{/* Preferences */}
			<div className="mb-6">
				<h3 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h3>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<div className="lg:col-span-2">
						<ThemeSettingsForm />
					</div>
					<div className="lg:col-span-2">
						<DateTimeSettingsForm />
					</div>
				</div>
			</div>

			{/* Notifications */}
			<div className="mb-6">
				<h3 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h3>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<div className="lg:col-span-2">
						<NotificationSettingsForm />
					</div>
				</div>
			</div>

			{/* Danger Zone */}
			<div className="mb-6">
				<h3 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h3>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<div className="lg:col-span-2">
						<DeleteAccountForm />
					</div>
				</div>
			</div>
		</main>
	)
}
