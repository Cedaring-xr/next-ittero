'use client'
import Modal from './modal'

interface ConfirmModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title?: string
	message: string
	confirmText?: string
	cancelText?: string
	variant?: 'danger' | 'warning' | 'info'
	isLoading?: boolean
}

export default function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title = 'Confirm Action',
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	variant = 'danger',
	isLoading = false
}: ConfirmModalProps) {
	const variantStyles = {
		danger: {
			button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
			icon: (
				<svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			)
		},
		warning: {
			button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
			icon: (
				<svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			)
		},
		info: {
			button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
			icon: (
				<svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			)
		}
	}

	const style = variantStyles[variant]

	return (
		<Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
			<div className="flex items-start gap-4">
				<div className="flex-shrink-0">{style.icon}</div>
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
					<p className="text-gray-300 text-sm mb-6">{message}</p>

					<div className="flex gap-3 justify-end">
						<button
							onClick={onClose}
							disabled={isLoading}
							className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{cancelText}
						</button>
						<button
							onClick={onConfirm}
							disabled={isLoading}
							className={`px-4 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${style.button}`}
						>
							{isLoading ? 'Processing...' : confirmText}
						</button>
					</div>
				</div>
			</div>
		</Modal>
	)
}
