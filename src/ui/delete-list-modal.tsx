'use client'
import Modal from './modal'

interface DeleteListModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: (mode: 'cascade' | 'reassign') => void
	itemCount: number
	isLoading?: boolean
}

export default function DeleteListModal({
	isOpen,
	onClose,
	onConfirm,
	itemCount,
	isLoading = false
}: DeleteListModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
			<div className="flex items-start gap-4">
				<div className="flex-shrink-0">
					<svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-white mb-2">Delete List</h3>
					<p className="text-gray-300 text-sm mb-4">
						This list contains <span className="font-semibold text-white">{itemCount}</span>{' '}
						{itemCount === 1 ? 'task' : 'tasks'}. What would you like to do with{' '}
						{itemCount === 1 ? 'it' : 'them'}?
					</p>

					<div className="space-y-3 mb-6">
						{/* Option 1: Cascade Delete (Default) */}
						<button
							onClick={() => onConfirm('cascade')}
							disabled={isLoading}
							className="w-full text-left p-4 bg-slate-800 hover:bg-slate-700 border-2 border-red-600 hover:border-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
						>
							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 mt-1">
									<svg
										className="w-5 h-5 text-red-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<p className="font-semibold text-white">Delete List and All Tasks</p>
										<span className="px-2 py-0.5 text-xs font-semibold bg-red-600 text-white rounded">
											DEFAULT
										</span>
									</div>
									<p className="text-sm text-gray-400 mt-1">
										Permanently delete the list and all {itemCount} {itemCount === 1 ? 'task' : 'tasks'}.
										This action cannot be undone.
									</p>
								</div>
							</div>
						</button>

						{/* Option 2: Move to Unassigned */}
						<button
							onClick={() => onConfirm('reassign')}
							disabled={isLoading}
							className="w-full text-left p-4 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-blue-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 mt-1">
									<svg
										className="w-5 h-5 text-blue-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<p className="font-semibold text-white">Move Tasks to &quot;Unassigned Tasks&quot;</p>
									<p className="text-sm text-gray-400 mt-1">
										Delete the list but keep all {itemCount} {itemCount === 1 ? 'task' : 'tasks'} in the
										&quot;Unassigned Tasks&quot; list. You can organize them later.
									</p>
								</div>
							</div>
						</button>
					</div>

					<div className="flex gap-3 justify-end">
						<button
							onClick={onClose}
							disabled={isLoading}
							className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</Modal>
	)
}
