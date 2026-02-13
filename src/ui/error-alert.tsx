'use client'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'

interface ErrorAlertProps {
	message: string
	onClose: () => void
	autoDismiss?: boolean
	autoDismissDelay?: number
}

export default function ErrorAlert({
	message,
	onClose,
	autoDismiss = true,
	autoDismissDelay = 5000
}: ErrorAlertProps) {
	useEffect(() => {
		if (autoDismiss) {
			const timer = setTimeout(() => {
				onClose()
			}, autoDismissDelay)

			return () => clearTimeout(timer)
		}
	}, [autoDismiss, autoDismissDelay, onClose])

	return (
		<div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top-5 fade-in duration-300">
			<div className="bg-red-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3">
				<div className="flex-shrink-0">
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<div className="flex-1">
					<p className="font-semibold text-sm">{message}</p>
				</div>
				<button
					onClick={onClose}
					className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
					aria-label="Close"
				>
					<XMarkIcon className="w-5 h-5" />
				</button>
			</div>
		</div>
	)
}
