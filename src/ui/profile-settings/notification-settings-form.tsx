'use client'
import { BellIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'

export default function NotificationSettingsForm() {
	return (
		<div className="rounded-md bg-slate-800 border-2 border-slate-700 p-4 md:p-6">
			<h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<label htmlFor="email_notifications" className="text-sm font-medium text-white">
							Email Notifications
						</label>
						<p className="text-xs text-gray-400">Receive updates via email</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input type="checkbox" id="email_notifications" className="sr-only peer" defaultChecked />
						<div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
					</label>
				</div>

				<div className="flex items-center justify-between">
					<div>
						<label htmlFor="list_reminders" className="text-sm font-medium text-white">
							List Reminders
						</label>
						<p className="text-xs text-gray-400">Get reminded about upcoming list items</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input type="checkbox" id="list_reminders" className="sr-only peer" defaultChecked />
						<div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
					</label>
				</div>

				<div className="flex items-center justify-between">
					<div>
						<label htmlFor="journal_prompts" className="text-sm font-medium text-white">
							Journal Prompts
						</label>
						<p className="text-xs text-gray-400">Daily journal writing prompts</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input type="checkbox" id="journal_prompts" className="sr-only peer" />
						<div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
					</label>
				</div>

				<div className="flex items-center justify-between">
					<div>
						<label htmlFor="weekly_summary" className="text-sm font-medium text-white">
							Weekly Summary
						</label>
						<p className="text-xs text-gray-400">Receive weekly activity summary</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input type="checkbox" id="weekly_summary" className="sr-only peer" />
						<div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
					</label>
				</div>

				<div className="flex items-center justify-between">
					<div>
						<label htmlFor="product_updates" className="text-sm font-medium text-white">
							Product Updates
						</label>
						<p className="text-xs text-gray-400">News about new features and updates</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input type="checkbox" id="product_updates" className="sr-only peer" defaultChecked />
						<div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
					</label>
				</div>
			</div>

			<div className="mt-6 flex justify-end gap-4">
				<ElegantButton variant="primary" size="md" disabled>
					Save Preferences
				</ElegantButton>
			</div>
		</div>
	)
}
