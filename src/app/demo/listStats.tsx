import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function ListStats() {
	// Generate sample data for last 7 days productivity
	const productiveDaysData = [
		{ day: 'Mon', tasks: 5 },
		{ day: 'Tue', tasks: 8 },
		{ day: 'Wed', tasks: 12 },
		{ day: 'Thu', tasks: 7 },
		{ day: 'Fri', tasks: 9 },
		{ day: 'Sat', tasks: 3 },
		{ day: 'Sun', tasks: 6 }
	]

	return (
		<div className="bg-slate-900 border border-slate-600 rounded p-6 mb-6">
			<h4 className="text-xl font-semibold text-white mb-4">List Statistics</h4>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
				<div className="text-center">
					<p className="text-3xl font-bold text-green-400">12</p>
					<p className="text-sm text-gray-400 mt-1">Active Lists</p>
				</div>
				<div className="text-center">
					<p className="text-3xl font-bold text-indigo-400">24</p>
					<p className="text-sm text-gray-400 mt-1">Tasks Completed</p>
				</div>
				<div className="text-center">
					<p className="text-3xl font-bold text-yellow-400">89%</p>
					<p className="text-sm text-gray-400 mt-1">Completion Rate</p>
				</div>
				<div className="text-center">
					<p className="text-3xl font-bold text-blue-400">37</p>
					<p className="text-sm text-gray-400 mt-1">Tasks Added</p>
				</div>
				<div className="text-center">
					<p className="text-3xl font-bold text-gray-400">8</p>
					<p className="text-sm text-gray-400 mt-1">Deleted Tasks</p>
				</div>
				<div className="text-center">
					<p className="text-3xl font-bold text-cyan-400">2.3d</p>
					<p className="text-sm text-gray-400 mt-1">Avg Completion Time</p>
				</div>
				<div className="text-center">
					<p className="text-3xl font-bold text-emerald-400">+15%</p>
					<p className="text-sm text-gray-400 mt-1">Weekly Trend</p>
				</div>
				<div className="text-center">
					<p className="text-3xl font-bold text-orange-400">18d</p>
					<p className="text-sm text-gray-400 mt-1">Longest Open Task</p>
				</div>
			</div>

			{/* Tasks Completed by Day Chart */}
			<div className="mb-6 pt-6 border-t border-slate-700 grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<h5 className="text-lg font-semibold text-white mb-4">Tasks Completed - Last 7 Days</h5>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={productiveDaysData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#475569" />
							<XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: '12px' }} />
							<YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
							<Tooltip
								contentStyle={{
									backgroundColor: '#1e293b',
									border: '1px solid #475569',
									borderRadius: '0.5rem',
									color: '#f1f5f9'
								}}
								labelStyle={{ color: '#cbd5e1' }}
							/>
							<Line
								type="monotone"
								dataKey="tasks"
								stroke="#10b981"
								strokeWidth={3}
								dot={{ fill: '#10b981', r: 5 }}
								activeDot={{ r: 7 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div className="lg:col-span-1 flex flex-col justify-center">
					<div className="flex items-center gap-4 mb-6 justify-around">
						<div className="text-center flex-shrink-0">
							<p className="text-3xl font-bold text-red-400">3</p>
							<p className="text-sm text-gray-400 mt-1">Overdue Tasks</p>
						</div>
						<button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap">
							Review Tasks
						</button>
					</div>
					<div className="flex items-center gap-4 mb-6 justify-around">
						<div className="text-center flex-shrink-0">
							<p className="text-3xl font-bold text-yellow-400">7</p>
							<p className="text-sm text-gray-400 mt-1">High Priority Tasks</p>
						</div>
						<button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 whitespace-nowrap">
							Review Tasks
						</button>
					</div>
					<div className="flex items-center gap-4 justify-around">
						<div className="text-center flex-shrink-0">
							<p className="text-3xl font-bold text-indigo-400">5</p>
							<p className="text-sm text-gray-400 mt-1">Pinned Lists</p>
						</div>
						<button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap">
							View Lists
						</button>
					</div>
				</div>
			</div>

			{/* Most Active List Categories */}
			<div className="mb-6 pt-6 border-t border-slate-700">
				<h5 className="text-lg font-semibold text-white mb-4">Most Active List Categories</h5>
				<div className="space-y-3">
					<div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
						<div className="flex items-center gap-3">
							<div className="w-3 h-3 rounded-full bg-indigo-400"></div>
							<span className="text-white font-medium">Monthly</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-32 bg-slate-700 rounded-full h-2">
								<div className="bg-indigo-400 h-2 rounded-full" style={{ width: '85%' }}></div>
							</div>
							<span className="text-sm text-gray-400 w-8">17</span>
						</div>
					</div>
					<div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
						<div className="flex items-center gap-3">
							<div className="w-3 h-3 rounded-full bg-purple-400"></div>
							<span className="text-white font-medium">Shopping List</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-32 bg-slate-700 rounded-full h-2">
								<div className="bg-purple-400 h-2 rounded-full" style={{ width: '65%' }}></div>
							</div>
							<span className="text-sm text-gray-400 w-8">13</span>
						</div>
					</div>
					<div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
						<div className="flex items-center gap-3">
							<div className="w-3 h-3 rounded-full bg-green-400"></div>
							<span className="text-white font-medium">Work</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-32 bg-slate-700 rounded-full h-2">
								<div className="bg-green-400 h-2 rounded-full" style={{ width: '40%' }}></div>
							</div>
							<span className="text-sm text-gray-400 w-8">8</span>
						</div>
					</div>
				</div>
			</div>

			{/* Advice for Further Productivity */}
			<div className="mt-6 pt-6 border-t border-slate-700">
				<h5 className="text-lg font-semibold text-white mb-4">Advice for Further Productivity</h5>
				<div className="space-y-3">
					<div className="flex items-start gap-3 bg-slate-800 p-4 rounded-lg">
						<div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
							1
						</div>
						<div>
							<p className="text-white font-medium mb-1">Break Down Large Tasks</p>
							<p className="text-sm text-gray-400">
								Split complex tasks into smaller, manageable steps to maintain momentum and track
								progress more effectively.
							</p>
						</div>
					</div>
					<div className="flex items-start gap-3 bg-slate-800 p-4 rounded-lg">
						<div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
							2
						</div>
						<div>
							<p className="text-white font-medium mb-1">Prioritize Your Daily Tasks</p>
							<p className="text-sm text-gray-400">
								Focus on your most important tasks during your peak productivity hours. Use the
								urgent/high priority categories wisely.
							</p>
						</div>
					</div>
					<div className="flex items-start gap-3 bg-slate-800 p-4 rounded-lg">
						<div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-sm">
							3
						</div>
						<div>
							<p className="text-white font-medium mb-1">Review and Archive Regularly</p>
							<p className="text-sm text-gray-400">
								Take time each week to review completed tasks and archive old lists. This keeps your
								workspace organized and motivating.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ListStats
