'use client'
import { ClockIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'

export default function DateTimeSettingsForm() {
	return (
		<div className="rounded-md bg-slate-800 border-2 border-slate-700 p-4 md:p-6">
			<h3 className="text-lg font-semibold text-white mb-4">Date & Time Settings</h3>

			<div className="mb-4">
				<label htmlFor="timezone" className="mb-2 block text-sm font-medium text-white">
					Timezone
				</label>
				<div className="relative mt-2 rounded-md">
					<div className="relative">
						<select
							id="timezone"
							name="timezone"
							className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
							defaultValue="America/New_York"
						>
							<option value="America/New_York">Eastern Time (ET)</option>
							<option value="America/Chicago">Central Time (CT)</option>
							<option value="America/Denver">Mountain Time (MT)</option>
							<option value="America/Los_Angeles">Pacific Time (PT)</option>
							<option value="Europe/London">London (GMT)</option>
							<option value="Europe/Paris">Paris (CET)</option>
							<option value="Asia/Tokyo">Tokyo (JST)</option>
							<option value="Australia/Sydney">Sydney (AEDT)</option>
						</select>
						<GlobeAltIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
					</div>
				</div>
			</div>

			<div className="mb-4">
				<label htmlFor="date_format" className="mb-2 block text-sm font-medium text-white">
					Date Format
				</label>
				<div className="relative mt-2 rounded-md">
					<div className="relative">
						<select
							id="date_format"
							name="date_format"
							className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
							defaultValue="MM/DD/YYYY"
						>
							<option value="MM/DD/YYYY">MM/DD/YYYY (12/24/2025)</option>
							<option value="DD/MM/YYYY">DD/MM/YYYY (24/12/2025)</option>
							<option value="YYYY-MM-DD">YYYY-MM-DD (2025-12-24)</option>
							<option value="MMMM D, YYYY">MMMM D, YYYY (December 24, 2025)</option>
						</select>
						<ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
					</div>
				</div>
			</div>

			<div className="mb-4">
				<label htmlFor="time_format" className="mb-2 block text-sm font-medium text-white">
					Time Format
				</label>
				<div className="relative mt-2 rounded-md">
					<div className="relative">
						<select
							id="time_format"
							name="time_format"
							className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
							defaultValue="12"
						>
							<option value="12">12-hour (3:45 PM)</option>
							<option value="24">24-hour (15:45)</option>
						</select>
						<ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
					</div>
				</div>
			</div>

			<div className="mt-6 flex justify-end gap-4">
				<ElegantButton variant="primary" size="md" disabled>
					Save Settings
				</ElegantButton>
			</div>
		</div>
	)
}
