import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function Stats() {
	// Generate sample data for last 30 days
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

	// Format time for tooltip
	const formatTime = (value: number) => {
		const hours = Math.floor(value)
		const minutes = Math.round((value - hours) * 60)
		const period = hours >= 12 ? 'PM' : 'AM'
		const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
		return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
	}

	return (
		<>
			{/* Journal Stats Section */}
			<div className="bg-slate-900 border border-slate-600 rounded p-6 mb-6">
				<h4 className="text-xl font-semibold text-white mb-4">Journal Statistics</h4>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
					<div className="text-center">
						<p className="text-3xl font-bold text-purple-400">17</p>
						<p className="text-sm text-gray-400 mt-1">Total Entries</p>
					</div>
					<div className="text-center">
						<p className="text-3xl font-bold text-indigo-400">5</p>
						<p className="text-sm text-gray-400 mt-1">This Week</p>
					</div>
					<div className="text-center">
						<p className="text-3xl font-bold text-blue-400">4</p>
						<p className="text-sm text-gray-400 mt-1">Day Streak</p>
					</div>
				</div>

				{/* Entry Times Graph */}
				<div className="mt-6 pt-6 border-t border-slate-700">
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
								formatter={(value: any) => [formatTime(value as number), 'Time']}
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
			</div>

			{/* List Stats Section */}
			<div className="bg-slate-900 border border-slate-600 rounded p-6 mb-6">
				<h4 className="text-xl font-semibold text-white mb-4">List Statistics</h4>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
				</div>
			</div>
		</>
	)
}

export default Stats
