'use client'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import ElegantButton from '@/ui/elegant-button'
import { useState } from 'react'

export default function DeleteAccountForm() {
	const [showConfirm, setShowConfirm] = useState(false)

	return (
		<div className="rounded-md bg-slate-800 border-2 border-red-700 p-4 md:p-6">
			<div className="flex items-center gap-2 mb-4">
				<ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
				<h3 className="text-lg font-semibold text-white">Danger Zone</h3>
			</div>

			<div className="mb-4">
				<p className="text-sm text-gray-300 mb-2">
					Permanently delete your account and all associated data. This action cannot be undone.
				</p>
				<ul className="text-xs text-gray-400 list-disc list-inside space-y-1 ml-2">
					<li>All journal entries will be permanently deleted</li>
					<li>All lists and items will be permanently deleted</li>
					<li>Your profile and settings will be removed</li>
					<li>This action is irreversible</li>
				</ul>
			</div>

			{!showConfirm ? (
				<div className="mt-6 flex justify-end gap-4">
					<ElegantButton
						variant="danger"
						size="md"
						onClick={() => setShowConfirm(true)}
					>
						Delete Account
					</ElegantButton>
				</div>
			) : (
				<div className="mt-4 p-4 bg-red-900/20 border-2 border-red-700 rounded-md">
					<p className="text-sm text-white mb-4 font-semibold">
						Are you absolutely sure you want to delete your account?
					</p>
					<div className="mb-4">
						<label htmlFor="confirm_text" className="mb-2 block text-sm font-medium text-white">
							Type &quot;DELETE&quot; to confirm
						</label>
						<input
							id="confirm_text"
							type="text"
							placeholder="Type DELETE"
							className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
						/>
					</div>
					<div className="flex justify-end gap-4">
						<ElegantButton
							variant="secondary"
							size="md"
							onClick={() => setShowConfirm(false)}
						>
							Cancel
						</ElegantButton>
						<ElegantButton
							variant="danger"
							size="md"
							disabled
						>
							Permanently Delete Account
						</ElegantButton>
					</div>
				</div>
			)}
		</div>
	)
}
