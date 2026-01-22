import UpdateEmailForm from '@/ui/profile-settings/update-email-form'
import UpdatePasswordForm from '@/ui/profile-settings/update-password-form'
import UpdateProfileForm from '@/ui/profile-settings/update-profile-form'
import ThemeSettingsForm from '@/ui/profile-settings/theme-settings-form'
import DateTimeSettingsForm from '@/ui/profile-settings/datetime-settings-form'
import NotificationSettingsForm from '@/ui/profile-settings/notification-settings-form'
import DeleteAccountForm from '@/ui/profile-settings/delete-account-form'
import { getAuthenticatedUser } from '@/utils/amplify-server-utils'
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon'
import CogIcon from '@heroicons/react/24/outline/CogIcon'

export default async function Feedback() {
  const user = await getAuthenticatedUser()

  return (
    <main>
      <div className="flex justify-between bg-gradient-to-br from-[#1e3a5f] to-slate-900 text-white px-6 py-4 -mx-6 -mt-6 mb-6 w-[calc(100%+3rem)]">
        <div className="flex ml-4">
           <h1 data-testid="page-title" className="md:text-xl ml-2">Feedback</h1>
        </div>
        <div className="flex items-center mr-4 gap-4">
          <div className="flex items-center">
            <UserCircleIcon className="w-6 mr-1" />
            <h2>{user?.name || user?.username}</h2>
          </div>
        </div>
      </div>
      
    </main>
  )
}
