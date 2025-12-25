'use client'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'

export default function ThemeSettingsForm() {
	return (
		<div className="rounded-md bg-slate-800 border-2 border-slate-700 p-4 md:p-6">
			<h3 className="text-lg font-semibold text-white mb-4">Theme Settings</h3>

			<div className="mb-4">
				<label className="mb-2 block text-sm font-medium text-white">
					Color Scheme
				</label>
				<div className="flex gap-4 mt-2">
					<button
						type="button"
						className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-indigo-500 bg-indigo-500/20 text-white hover:bg-indigo-500/30 transition-colors"
					>
						<SunIcon className="h-5 w-5" />
						Light
					</button>
					<button
						type="button"
						className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-slate-600 text-gray-300 hover:border-indigo-500 hover:bg-indigo-500/20 transition-colors"
					>
						<MoonIcon className="h-5 w-5" />
						Dark
					</button>
					<button
						type="button"
						className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-slate-600 text-gray-300 hover:border-indigo-500 hover:bg-indigo-500/20 transition-colors"
					>
						Auto
					</button>
				</div>
			</div>

			<div className="mb-4">
				<label className="mb-2 block text-sm font-medium text-white">
					Accent Color
				</label>
				<div className="flex gap-2 mt-2">
					<button
						type="button"
						className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-white shadow-md"
						title="Indigo"
					/>
					<button
						type="button"
						className="w-10 h-10 rounded-full bg-blue-500 border-2 border-slate-600 hover:border-white shadow-md"
						title="Blue"
					/>
					<button
						type="button"
						className="w-10 h-10 rounded-full bg-purple-500 border-2 border-slate-600 hover:border-white shadow-md"
						title="Purple"
					/>
					<button
						type="button"
						className="w-10 h-10 rounded-full bg-green-500 border-2 border-slate-600 hover:border-white shadow-md"
						title="Green"
					/>
					<button
						type="button"
						className="w-10 h-10 rounded-full bg-rose-500 border-2 border-slate-600 hover:border-white shadow-md"
						title="Rose"
					/>
				</div>
			</div>

			<div className="mt-6 flex justify-end gap-4">
				<ElegantButton variant="primary" size="md" disabled>
					Save Theme
				</ElegantButton>
			</div>
		</div>
	)
}
