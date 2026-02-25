'use client'
import React from 'react'
import { XCircleIcon, PencilIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ViewEditModalProps {
	title: string
	loading: boolean
	error: string | null
	editing: boolean
	saving: boolean
	hasData: boolean
	onEdit: () => void
	onClose: () => void
	onSave: () => void
	onCancel: () => void
	viewContent: React.ReactNode
	editContent: React.ReactNode
}

export default function ViewEditModal({
	title,
	loading,
	error,
	editing,
	saving,
	hasData,
	onEdit,
	onClose,
	onSave,
	onCancel,
	viewContent,
	editContent,
}: ViewEditModalProps) {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="relative w-full max-w-lg mx-4 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-5 border-b border-slate-700">
					<h3 className="text-lg font-semibold text-white">{title}</h3>
					<div className="flex items-center gap-2">
						{!editing && !loading && hasData && (
							<button
								onClick={onEdit}
								className="p-1.5 rounded-lg hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
								aria-label="Edit"
							>
								<PencilIcon className="w-5 h-5" />
							</button>
						)}
						<button
							onClick={onClose}
							className="p-1.5 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-gray-300 transition-colors"
							aria-label="Close modal"
						>
							<XCircleIcon className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Body */}
				<div className="p-5">
					{loading && (
						<div className="flex items-center justify-center py-8">
							<div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-600 border-t-indigo-500"></div>
						</div>
					)}

					{error && (
						<div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-lg text-sm">
							{error}
						</div>
					)}

					{!loading && !editing && viewContent}

					{!loading && editing && (
						<div className="space-y-4">
							{editContent}
							<div className="flex justify-end gap-2 pt-2">
								<button
									onClick={onCancel}
									className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-200 text-sm transition-colors"
								>
									<XMarkIcon className="w-4 h-4" />
									Cancel
								</button>
								<button
									onClick={onSave}
									disabled={saving}
									className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<CheckCircleIcon className="w-4 h-4" />
									{saving ? 'Saving...' : 'Save'}
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
