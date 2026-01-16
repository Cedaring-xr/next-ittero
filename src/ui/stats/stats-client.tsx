'use client'
import ElegantButton from '@/ui/elegant-button'
import { PlusIcon, ChartBarIcon, BellIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { lusitana } from '@/ui/fonts'
import { HiOutlinePresentationChartBar, HiOutlineBookOpen, HiOutlineClipboardList } from 'react-icons/hi'
import { useListsStats } from '@/app/hooks/use-stats-queries'
import { useJournalStats, formatTime } from '@/app/hooks/use-journal-queries'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface StatsClientProps {
	username?: string
}

export default function StatsClient({ username }: StatsClientProps) {
	const [notificationCount, setNotificationCount] = useState(0)

	const { stats: listStats, isLoading: listsLoading } = useListsStats()
	const { stats: journalStats, isLoading: journalLoading } = useJournalStats()

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
					<h2 className="md:text-xl ml-2">{username ? `${username}'s Usage Statistics` : ''}</h2>
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
					{journalLoading ? (
						<div className="flex items-center justify-center py-8 mt-6 pt-6 border-t border-slate-700">
							<div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-purple-400"></div>
						</div>
					) : (
						<>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700">
								<div className="bg-slate-700 rounded-lg p-4 text-center">
									<p className="text-3xl font-bold text-purple-400">{journalStats.entriesThisMonth}</p>
									<p className="text-sm text-gray-400 mt-1">This Month</p>
								</div>
								<div className="bg-slate-700 rounded-lg p-4 text-center">
									<p className="text-3xl font-bold text-indigo-400">{journalStats.entriesThisWeek}</p>
									<p className="text-sm text-gray-400 mt-1">This Week</p>
								</div>
								<div className="bg-slate-700 rounded-lg p-4 text-center">
									<p className="text-3xl font-bold text-blue-400">{journalStats.currentStreak}</p>
									<p className="text-sm text-gray-400 mt-1">Day Streak</p>
								</div>
								<div className="bg-slate-700 rounded-lg p-4 text-center">
									<p className="text-3xl font-bold text-emerald-400">{journalStats.totalEntries}</p>
									<p className="text-sm text-gray-400 mt-1">Total Entries</p>
								</div>
							</div>

							{/* Charts Grid */}
							<div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-1 lg:grid-cols-3 gap-6">
								{/* Entry Times Line Chart */}
								<div className="lg:col-span-2">
									<h5 className="text-lg font-semibold text-white mb-4">
										Entry Times - {journalStats.currentMonth}
									</h5>
									{journalStats.entryTimesData.length > 0 ? (
										<ResponsiveContainer width="100%" height={300}>
											<LineChart
												data={journalStats.entryTimesData}
												margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
											>
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
									) : (
										<div className="flex items-center justify-center h-[300px] bg-slate-900 rounded-lg">
											<p className="text-gray-400">No entries this month</p>
										</div>
									)}
								</div>

								{/* Activity Heatmap */}
								<div className="lg:col-span-1">
									<h5 className="text-lg font-semibold text-white mb-4">
										{journalStats.currentMonth} Activity
									</h5>
									<div className="flex flex-wrap gap-1.5">
										{journalStats.activityData.map((dayData, i) => {
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
																: 'bg-slate-800 border-slate-600'
														} transition-all hover:scale-110`}
													></div>
													<span className="text-xs text-gray-500 mt-1">{day}</span>
													{dayData.hasEntry && (
														<div className="absolute -top-8 hidden group-hover:block bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-white whitespace-nowrap z-10">
															{dayData.date}
														</div>
													)}
												</div>
											)
										})}
									</div>
								</div>
							</div>
						</>
					)}
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
					{listsLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-emerald-400"></div>
						</div>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							{/* Total Lists */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Total Lists</p>
								<p className="text-3xl font-bold text-white">{listStats.totalLists}</p>
							</div>

							{/* Total Tasks */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Total Tasks</p>
								<p className="text-3xl font-bold text-white">{listStats.totalTasks}</p>
							</div>

							{/* Completed Tasks */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Completed</p>
								<p className="text-3xl font-bold text-green-400">{listStats.completedTasks}</p>
							</div>

							{/* Active Tasks */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Active</p>
								<p className="text-3xl font-bold text-indigo-400">{listStats.activeTasks}</p>
							</div>

							{/* Completion Rate */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Completion Rate</p>
								<p className="text-3xl font-bold text-emerald-400">{listStats.completionRate}%</p>
							</div>

							{/* Overdue Tasks */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Overdue</p>
								<p className="text-3xl font-bold text-red-400">{listStats.overdueTasks}</p>
							</div>

							{/* Tasks with Due Date */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">With Due Date</p>
								<p className="text-3xl font-bold text-blue-400">{listStats.tasksWithDueDate}</p>
							</div>

							{/* Urgent Tasks */}
							<div className="bg-slate-700 rounded-lg p-4 text-center">
								<p className="text-gray-400 text-xs uppercase mb-2">Urgent</p>
								<p className="text-3xl font-bold text-orange-400">{listStats.tasksByPriority.urgent}</p>
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
