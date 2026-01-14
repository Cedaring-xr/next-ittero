'use client'
import useAuthUser from '@/app/hooks/user-auth-user'
import ElegantButton from '@/ui/elegant-button'
import { PlusIcon, ChartBarIcon, BellIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React, { useState } from 'react'
import { lusitana } from '@/ui/fonts'
import { HiOutlinePresentationChartBar, HiOutlineBookOpen, HiOutlineClipboardList } from 'react-icons/hi'
import { useListsStats } from '@/app/hooks/use-stats-queries'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function Stats() {
	const [notificationCount, setNotificationCount] = useState(0)

	const user = useAuthUser()
	const { stats, isLoading } = useListsStats()

	// Placeholder data for journal entry times - will be replaced with real data later
	const entryTimesData = [
		{ date: '12/02', time: 7.25 },
		{ date: '12/03', time: 7.5 },
		{ date: '12/04', time: 7.0 },
		{ date: '12/05', time: 7.75 },
		{ date: '12/09', time: 19.5 },
		{ date: '12/10', time: 20.0 },
		{ date: '12/11', time: 21.25 },
		{ date: '12/15', time: 10.0 },
		{ date: '12/16', time: 10.5 },
		{ date: '12/17', time: 10.25 },
		{ date: '12/18', time: 9.75 },
		{ date: '12/23', time: 22.5 },
		{ date: '12/24', time: 22.25 },
		{ date: '12/27', time: 7.5 },
		{ date: '12/28', time: 7.75 },
		{ date: '12/29', time: 8.0 },
		{ date: '12/30', time: 8.25 }
	]

	// Format time for tooltip display
	const formatTime = (value: number) => {
		const hours = Math.floor(value)
		const minutes = Math.round((value - hours) * 60)
		const period = hours >= 12 ? 'PM' : 'AM'
		const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
		return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
	}

	const handleCalculateJournalStats = () => {
		// fetch resources needed to calculate stats
		// run calculation functions
		// push results to state variables
	}

	const handleShowOldJournalStats = () => {}

	const handleShowOldListStats = () => {}

	const handleShowJournalNotifications = () => {}

	const handleShowListNotifications = () => {}

	const handleNotificationsClick = () => {
		// TODO: Open notifications panel/modal
		console.log('Notifications clicked')
	}

	return (
		<>
			<div className="flex justify-between bg-gradient-to-br from-[#1e3a5f] to-slate-900 text-white px-2 py-4 w-full mb-6">
				<div className="flex ml-4">
					<HiOutlinePresentationChartBar className="h-[30px] w-[30px]" />
					<h2 className="md:text-xl ml-2">{user?.name ? `${user?.name}'s Usage Statistics` : ''}</h2>
				</div>
				<div className="flex items-center mr-4">
					<button
						onClick={handleNotificationsClick}
						className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors flex"
						aria-label="Notifications"
					>
						<BellIcon className="w-6 h-6" />
						{/* Optional: Add notification badge */}

						{notificationCount > 0 ? (
							<div>
								<span className="absolute top-1 right-8 w-2 h-2 bg-red-500 rounded-full"></span>
								<span>{`(${notificationCount})`}</span>
							</div>
						) : (
							''
						)}
					</button>
				</div>
			</div>
			<div id="overview-container" className="p-6 max-w-6xl mx-auto">
				{/* Journal Stats Section */}
				<div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
					<div className="flex items-center gap-3 mb-6">
						<HiOutlineBookOpen className="h-8 w-8 text-indigo-400" />
						<h3 className={`${lusitana.className} text-2xl font-bold text-white`}>
							Journal Entry Statistics
						</h3>
					</div>
					<p className="text-gray-100 text-sm mb-6">
						View and analyze your journal writing patterns and insights.
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<ElegantButton
							variant="primary"
							size="lg"
							icon={<ChartBarIcon className="h-5 w-5" />}
							onClick={handleCalculateJournalStats}
						>
							Run Journal Stats
						</ElegantButton>
						<ElegantButton
							variant="secondary"
							size="lg"
							icon={<PlusIcon className="h-5 w-5" />}
							onClick={handleShowOldJournalStats}
						>
							View Previous Timeframes
						</ElegantButton>
					</div>
					<div className="flex flex-col sm:flex-row gap-4 my-4">
						<ElegantButton variant="secondary" size="lg" onClick={handleShowJournalNotifications}>
							View Notifications
						</ElegantButton>
					</div>

					{/* Journal Stats Summary */}
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
						<div className="bg-slate-700 rounded-lg p-4 text-center">
							<p className="text-3xl font-bold text-purple-400">17</p>
							<p className="text-sm text-gray-400 mt-1">Total Entries</p>
						</div>
						<div className="bg-slate-700 rounded-lg p-4 text-center">
							<p className="text-3xl font-bold text-indigo-400">5</p>
							<p className="text-sm text-gray-400 mt-1">This Week</p>
						</div>
						<div className="bg-slate-700 rounded-lg p-4 text-center">
							<p className="text-3xl font-bold text-blue-400">4</p>
							<p className="text-sm text-gray-400 mt-1">Day Streak</p>
						</div>
					</div>

					{/* Charts Grid */}
					<div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Entry Times Line Chart */}
						<div className="lg:col-span-2">
							<h5 className="text-lg font-semibold text-white mb-4">Entry Times - Last 30 Days</h5>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={entryTimesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
									<CartesianGrid strokeDasharray="3 3" stroke="#475569" />
									<XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
									<YAxis
										stroke="#94a3b8"
										domain={[0, 24]}
										ticks={[0, 6, 12, 18, 24]}
										tickFormatter={formatTime}
										style={{ fontSize: '12px' }}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: '#1e293b',
											border: '1px solid #475569',
											borderRadius: '0.5rem',
											color: '#f1f5f9'
										}}
										labelStyle={{ color: '#cbd5e1' }}
										formatter={(value) => [formatTime(value as number), 'Time']}
									/>
									<Line
										type="monotone"
										dataKey="time"
										stroke="#a855f7"
										strokeWidth={2}
										dot={{ fill: '#a855f7', r: 4 }}
										activeDot={{ r: 6 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>

						{/* Activity Heatmap */}
						<div className="lg:col-span-1">
							<h5 className="text-lg font-semibold text-white mb-4">December Activity</h5>
							<div className="flex flex-wrap gap-1.5">
								{Array.from({ length: 31 }, (_, i) => {
									const day = i + 1
									const dateStr = `12/${day.toString().padStart(2, '0')}`
									const hasEntry = entryTimesData.some((entry) => entry.date === dateStr)

									return (
										<div
											key={day}
											className="group relative flex flex-col items-center"
											style={{ width: '24px' }}
										>
											<div
												className={`w-5 h-5 rounded-sm border ${
													hasEntry
														? 'bg-purple-500 border-purple-400'
														: 'bg-slate-800 border-slate-600'
												} transition-all hover:scale-110`}
											></div>
											<span className="text-xs text-gray-500 mt-1">{day}</span>
											{hasEntry && (
												<div className="absolute -top-8 hidden group-hover:block bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-white whitespace-nowrap z-10">
													{dateStr}
												</div>
											)}
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</div>

				{/* Lists and Tasks Stats Section */}
				<div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
					<div className="flex items-center gap-3 mb-6">
						<HiOutlineClipboardList className="h-8 w-8 text-emerald-400" />
						<h3 className={`${lusitana.className} text-2xl font-bold text-white`}>
							Lists & Tasks Statistics
						</h3>
					</div>
					<p className="text-gray-400 text-sm mb-6">Track your productivity and task completion metrics.</p>

					{/* Stats Display */}
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-emerald-400"></div>
						</div>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							{/* Total Lists */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Total Lists</p>
								<p className="text-3xl font-bold text-white">{stats.totalLists}</p>
							</div>

							{/* Total Tasks */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Total Tasks</p>
								<p className="text-3xl font-bold text-white">{stats.totalTasks}</p>
							</div>

							{/* Completed Tasks */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Completed</p>
								<p className="text-3xl font-bold text-green-400">{stats.completedTasks}</p>
							</div>

							{/* Active Tasks */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Active</p>
								<p className="text-3xl font-bold text-indigo-400">{stats.activeTasks}</p>
							</div>

							{/* Completion Rate */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Completion Rate</p>
								<p className="text-3xl font-bold text-emerald-400">{stats.completionRate}%</p>
							</div>

							{/* Overdue Tasks */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Overdue</p>
								<p className="text-3xl font-bold text-red-400">{stats.overdueTasks}</p>
							</div>

							{/* Tasks with Due Date */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">With Due Date</p>
								<p className="text-3xl font-bold text-blue-400">{stats.tasksWithDueDate}</p>
							</div>

							{/* Urgent Tasks */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Urgent</p>
								<p className="text-3xl font-bold text-orange-400">{stats.tasksByPriority.urgent}</p>
							</div>
						</div>
					)}
					<div className="flex flex-col sm:flex-row gap-4 my-4">
						<ElegantButton variant="primary" size="lg" icon={<ChartBarIcon className="h-5 w-5" />}>
							Run List Stats
						</ElegantButton>
						<ElegantButton
							variant="secondary"
							size="lg"
							icon={<PlusIcon className="h-5 w-5" />}
							onClick={handleShowOldListStats}
						>
							View Previous Timeframes
						</ElegantButton>
					</div>
					<div className="flex flex-col sm:flex-row gap-4 my-4">
						<ElegantButton variant="secondary" size="lg" onClick={handleShowListNotifications}>
							View Notifications
						</ElegantButton>
					</div>
					<ElegantButton onClick={() => setNotificationCount(notificationCount + 1)}>
						Add notifications
					</ElegantButton>
					<ElegantButton onClick={() => setNotificationCount(Math.max(0, notificationCount - 1))}>
						Remove notifications
					</ElegantButton>
				</div>
			</div>
		</>
	)
}

export default Stats
