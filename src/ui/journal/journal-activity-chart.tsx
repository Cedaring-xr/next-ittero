'use client'
import React from 'react'
import { useJournalStats } from '@/app/hooks/use-journal-queries'

export default function JournalActivityChart() {
	const { stats, isLoading } = useJournalStats()

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8 mb-6">
				<div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-indigo-600"></div>
			</div>
		)
	}

	return (
		<div className="bg-slate-800 rounded-lg p-6 mb-6">
			{/* Summary Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-slate-700 rounded-lg p-4 text-center">
					<p className="text-3xl font-bold text-rose-400">{stats.entriesThisMonth}</p>
					<p className="text-sm text-gray-200 mt-1">This Month</p>
				</div>
				<div className="bg-slate-700 rounded-lg p-4 text-center">
					<p className="text-3xl font-bold text-indigo-400">{stats.entriesThisWeek}</p>
					<p className="text-sm text-gray-200 mt-1">This Week</p>
				</div>
				<div className="bg-slate-700 rounded-lg p-4 text-center">
					<p className="text-3xl font-bold text-orange-400">{stats.currentStreak}</p>
					<p className="text-sm text-gray-200 mt-1">Day Streak</p>
				</div>
				<div className="bg-slate-700 rounded-lg p-4 text-center">
					<p className="text-3xl font-bold text-emerald-400">{stats.totalEntries}</p>
					<p className="text-sm text-gray-200 mt-1">Total Entries</p>
				</div>
			</div>

			{/* Activity Heatmap */}
			<div>
				<h5 className="text-lg font-semibold text-white mb-4">{stats.currentMonth} Activity</h5>
				<div className="flex flex-wrap gap-1.5">
					{stats.activityData.map((dayData, i) => {
						const day = i + 1
						return (
							<div
								key={day}
								className="group relative flex flex-col items-center"
								style={{ width: '24px' }}
							>
								<div
									className={`w-5 h-5 rounded-sm border ${
										dayData.hasEntry
											? 'bg-purple-500 border-purple-400'
											: 'bg-slate-900 border-slate-600'
									} transition-all hover:scale-110`}
								></div>
								<span className="text-xs text-gray-200 mt-1">{day}</span>
								{dayData.hasEntry && (
									<div className="absolute -top-8 hidden group-hover:block bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white whitespace-nowrap z-10">
										{dayData.date}
									</div>
								)}
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
