import React from 'react'

interface PaginationProps {
	hasMore: boolean
	loading: boolean
	onLoadMore: () => void
	currentCount: number
	buttonText?: string
}

export default function Pagination({
	hasMore,
	loading,
	onLoadMore,
	currentCount,
	buttonText = 'Load More'
}: PaginationProps) {
	if (!hasMore && currentCount === 0) {
		return null
	}

	return (
		<div className="mt-8 flex flex-col items-center gap-4">
			{currentCount > 0 && (
				<p className="text-gray-800">Showing {currentCount} entries</p>
			)}
			{hasMore && (
				<button
					onClick={onLoadMore}
					disabled={loading}
					className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
				>
					{loading ? 'Loading...' : buttonText}
				</button>
			)}
		</div>
	)
}
