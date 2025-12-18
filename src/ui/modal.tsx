'use client'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	title?: string
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export default function Modal({ isOpen, onClose, children, title, maxWidth = '2xl' }: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null)

	// Close modal on Escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose()
			}
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [isOpen, onClose])

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}

		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	// Close modal when clicking outside
	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	if (!isOpen) return null

	const maxWidthClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl'
	}

	const modalContent = (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			onClick={handleBackdropClick}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
		>
			<div
				ref={modalRef}
				className={`bg-slate-800 rounded-lg shadow-xl ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-y-auto`}
			>
				<div className="p-6">
					{title && (
						<div className="flex justify-between items-center mb-6">
							<h2 id="modal-title" className="text-2xl font-bold text-white">
								{title}
							</h2>
							<button
								onClick={onClose}
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="Close modal"
							>
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
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					)}
					{children}
				</div>
			</div>
		</div>
	)

	// Use portal to render modal at document body level
	return createPortal(modalContent, document.body)
}
